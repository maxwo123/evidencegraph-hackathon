# Work history and disclosures

## Before the hackathon

- General life-sciences research notes and customer-discovery planning.
- Project scoping, risk analysis, proposed technology choices, and lab-style
  work plans.
- No submitted EvidenceGraph application or agent existed.

## Built during the hackathon

- Next.js research-question interface and evidence source drawer.
- Two-paper, six-passage human-reviewed demonstration corpus.
- Server-side Meta Model API integration and structured answer schemas.
- Exact-quotation and passage-ID provenance validation.
- Supported and missing-evidence failure harness.
- Review-gated PubMed Central ingestion command.
- Two-paper evaluation artifacts and scientific corrections.
- Modal Shared Endpoint integration for Muse Spark Open.
- Bounded evidence agent with planning, reviewed retrieval, drafting,
  validation, one repair, and abstention.
- Visible workflow trace, tests, Vercel deployment, and release documentation.

## Human work

- Selected the scientific investigation and reviewed-paper scope.
- Compared passages and generated claims against Morgan 2017 and Donlic 2022.
- Corrected framing around the FDA comparison, source-library confounding,
  reclassification, and partial non-independent replication.
- Must personally review the final video, declarations, and submission.

## AI assistance

- OpenAI Codex assisted with planning, implementation, tests, documentation,
  command execution, and release verification.
- Meta models generate the user-facing research answers.
- Muse Spark Open performs the verified agent's planning and drafting steps.

AI assistance did not replace the recorded human review of scientific claims.

## Third-party systems and materials

- Meta Model API and Meta Muse model family.
- Modal Shared Endpoints.
- Vercel hosting.
- Open-source npm dependencies listed in `web/package-lock.json`.
- Research-paper metadata and selected passages remain subject to their
  authors' and publishers' terms; the repository license does not relicense
  them.

## Manual curation disclosure

The live corpus is not automatically approved. Paper ingestion produces local
review artifacts, and a human must select and verify a passage before it can be
included in `web/src/lib/evidence.ts`.
