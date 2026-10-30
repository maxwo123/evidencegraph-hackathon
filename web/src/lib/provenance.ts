import { getPassageById, type EvidencePassage } from "@/lib/evidence";

export type CitationInput = {
  passageId: string;
  quote: string;
};

export type CitationProvenance = {
  passage: EvidencePassage;
  provenance: "valid";
  semanticSupport: "not_assessed";
};

export class CitationProvenanceError extends Error {
  constructor(
    public readonly code: "unknown_passage" | "quote_mismatch",
    message: string,
  ) {
    super(message);
    this.name = "CitationProvenanceError";
  }
}

function normalizeForExactMatch(value: string): string {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}

export function verifyCitationProvenance(
  citation: CitationInput,
): CitationProvenance {
  const passage = getPassageById(citation.passageId);

  if (!passage) {
    throw new CitationProvenanceError(
      "unknown_passage",
      `Model returned an unknown passage ID: ${citation.passageId}`,
    );
  }

  const sourceText = normalizeForExactMatch(passage.text);
  const quote = normalizeForExactMatch(citation.quote);

  if (!sourceText.includes(quote)) {
    throw new CitationProvenanceError(
      "quote_mismatch",
      `Citation quote does not match passage: ${citation.passageId}`,
    );
  }

  return {
    passage,
    provenance: "valid",
    semanticSupport: "not_assessed",
  };
}
