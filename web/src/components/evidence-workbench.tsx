"use client";

import { FormEvent, useState } from "react";

import { AnswerCard } from "@/components/answer-card";
import { SourceDrawer } from "@/components/source-drawer";
import { defaultQuestion, getPassageById } from "@/lib/evidence";
import { groundedAnswerSchema, type GroundedAnswer } from "@/lib/schemas";

type EvidenceWorkbenchProps = {
  initialAnswer: GroundedAnswer;
};

export function EvidenceWorkbench({ initialAnswer }: EvidenceWorkbenchProps) {
  const [question, setQuestion] = useState(defaultQuestion);
  const [answer, setAnswer] = useState(initialAnswer);
  const [activePassageId, setActivePassageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activePassage = activePassageId
    ? getPassageById(activePassageId)
    : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const body: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof body === "object" && body !== null && "error" in body
            ? String(body.error)
            : "The request failed.";
        throw new Error(message);
      }

      setAnswer(groundedAnswerSchema.parse(body));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The request failed.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="EvidenceGraph home">
          Evidence<span>Graph</span>
        </a>
        <div className="corpus-meta" aria-label="Corpus status">
          <span className="status-dot" aria-hidden="true" />
          1 paper · 2 reviewed passages
        </div>
      </header>

      <section className="hero" id="top">
        <p className="eyebrow">RNA small-molecule literature · investigation 01</p>
        <h1>Trace the answer.<br />Inspect the evidence.</h1>
        <p className="hero-copy">
          EvidenceGraph turns a literature question into an answer whose claims
          stay connected to the exact passages that support—and limit—them.
        </p>
      </section>

      <section className="workbench" aria-label="Evidence investigation">
        <div className="question-panel">
          <div className="section-label">
            <span>01</span>
            <p>Research question</p>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="question">Ask the reviewed corpus</label>
            <textarea
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={7}
              minLength={12}
              maxLength={600}
              required
            />
            <div className="question-footer">
              <p>Answers are constrained to the passages in this corpus.</p>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Tracing evidence…" : "Analyze evidence"}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
          {error ? (
            <p className="request-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="answer-panel">
          <div className="section-label">
            <span>02</span>
            <p>Grounded answer</p>
          </div>
          <AnswerCard answer={answer} onOpenSource={setActivePassageId} />
        </div>
      </section>

      <footer className="site-footer">
        <p>EvidenceGraph · Hackathon research prototype</p>
        <p>Every answer should survive a source check.</p>
      </footer>

      <SourceDrawer
        passage={activePassage}
        onClose={() => setActivePassageId(null)}
      />
    </main>
  );
}
