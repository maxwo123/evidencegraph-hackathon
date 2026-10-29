import { getPassageById } from "@/lib/evidence";
import type { GroundedAnswer } from "@/lib/schemas";

type AnswerCardProps = {
  answer: GroundedAnswer;
  onOpenSource: (passageId: string) => void;
};

const statusLabels: Record<GroundedAnswer["status"], string> = {
  supported: "Supported",
  supported_with_limitations: "Supported · with limits",
  mixed: "Mixed evidence",
  insufficient: "Insufficient evidence",
};

export function AnswerCard({ answer, onOpenSource }: AnswerCardProps) {
  return (
    <article className="answer-card" aria-live="polite">
      <div className="answer-meta">
        <span className={`evidence-status status-${answer.status}`}>
          {statusLabels[answer.status]}
        </span>
        <span>{answer.mode === "live" ? answer.model : "Reviewed baseline"}</span>
      </div>

      <p className="answer-summary">{answer.answer}</p>

      <div className="evidence-rail">
        {answer.claims.map((claim, claimIndex) => (
          <section className="claim-row" key={`${claim.text}-${claimIndex}`}>
            <div className="claim-index" aria-hidden="true">
              C{claimIndex + 1}
            </div>
            <div>
              <h2>Claim {claimIndex + 1}</h2>
              <p className={`claim-kind kind-${claim.kind}`}>
                {claim.kind === "direct_evidence"
                  ? "Direct evidence"
                  : "Interpretation"}
              </p>
              <p>{claim.text}</p>
              <div
                className="source-links"
                aria-label={`Sources for claim ${claimIndex + 1}`}
              >
                {claim.passageIds.map((passageId) => {
                  const passage = getPassageById(passageId);
                  if (!passage) return null;

                  return (
                    <button
                      type="button"
                      key={passageId}
                      onClick={() => onOpenSource(passageId)}
                    >
                      <span aria-hidden="true">↳</span>
                      {passage.authors.split(",")[0]} {passage.year} · {passage.location}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="limits-block">
        <h2>Boundary conditions</h2>
        <ul>
          {answer.limitations.map((limitation) => (
            <li key={limitation}>{limitation}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
