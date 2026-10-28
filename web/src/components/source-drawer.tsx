import { useEffect, useRef } from "react";

import type { EvidencePassage } from "@/lib/evidence";

type SourceDrawerProps = {
  passage: EvidencePassage | undefined;
  onClose: () => void;
};

export function SourceDrawer({ passage, onClose }: SourceDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!passage) return;

    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [passage, onClose]);

  if (!passage) return null;

  return (
    <div className="drawer-layer" role="presentation">
      <button
        className="drawer-scrim"
        type="button"
        aria-label="Close source passage"
        onClick={onClose}
      />
      <aside
        className="source-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-title"
      >
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Source passage</p>
            <p className="passage-id">{passage.id}</p>
          </div>
          <button
            ref={closeButtonRef}
            className="close-button"
            type="button"
            onClick={onClose}
            aria-label="Close source passage"
          >
            ×
          </button>
        </div>

        <div className="source-body">
          <h2 id="source-title">{passage.title}</h2>
          <p className="source-authors">{passage.authors}</p>
          <dl className="source-metadata">
            <div><dt>Journal</dt><dd>{passage.journal}</dd></div>
            <div><dt>Location</dt><dd>{passage.location}</dd></div>
            <div><dt>DOI</dt><dd>{passage.doi}</dd></div>
            <div><dt>PMID · PMCID</dt><dd>{passage.pmid} · {passage.pmcid}</dd></div>
          </dl>

          <blockquote>{passage.text}</blockquote>
          {passage.excerptNote ? (
            <p className="excerpt-note">{passage.excerptNote}</p>
          ) : null}
          <p className="copyright-note">{passage.copyrightNotice}</p>

          <a
            className="source-action"
            href={passage.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open full source <span aria-hidden="true">↗</span>
          </a>
        </div>
      </aside>
    </div>
  );
}
