# EvidenceGraph web application

This Next.js application provides two server-side research paths over a
two-paper, six-passage reviewed corpus:

- **Direct answer** uses Meta Model API with `muse-spark-1.3`.
- **Verified agent · Modal** uses Muse Spark Open to plan evidence, retrieve
  reviewed passages, draft cited claims, validate provenance, repair once, and
  answer or abstain.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

The initial human-reviewed answer and source reveal work without credentials.
The direct and agent actions require their corresponding server-only variables
from `.env.example`. No credential may use a `NEXT_PUBLIC_` prefix.

## Quality checks

```bash
npm test
npm run lint
npm run build
```

## Modal open-weight evaluation

```bash
npm run evaluate:modal-open-weight
```

This command sends one supported and one unsupported question to the configured
Modal endpoint and may incur usage charges.

## Review-gated PMC ingestion

```bash
npm run ingest-paper -- --pmcid PMC9343015
```

Generated source artifacts are saved under ignored `local-papers/ingestion/`.
Ingestion ends at `needs_review`; it never silently changes the live corpus.

## Trust boundary

The response validator rejects malformed output, unknown passage IDs, altered
quotations, and—on the agent path—citations to passages the planner did not
select. Exact quotation matching establishes provenance only. It does not
establish semantic support or scientific truth.
