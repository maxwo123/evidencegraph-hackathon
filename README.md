# EvidenceGraph

EvidenceGraph is a verified scientific-literature agent that connects each
generated claim to an exact, human-reviewed source passage—and abstains when
the reviewed corpus cannot support an answer.

**Live application:** <https://evidencegraph-hackathon.vercel.app>

## Why it exists

Ordinary research chat can produce a plausible synthesis while hiding whether
its sources are comparable, whether a quotation actually exists, or whether
the available papers address the question at all. EvidenceGraph separates the
model's proposal from the application's decision to trust it.

The hackathon investigation asks what molecular-property differences Morgan
2017 and Donlic 2022 report for RNA-targeting small molecules. The demonstration
corpus is deliberately narrow: **two papers and six manually reviewed
passages**. This is a verifiable prototype, not a general scientific database
or molecule-binding predictor.

## What works

- A direct evidence-constrained answer path using Meta Model API and
  `muse-spark-1.3`.
- A bounded agent path using Meta's open-weight Muse Spark Open model through a
  Modal Shared Endpoint.
- Model-directed evidence planning and reviewed-passage selection.
- Deterministic rejection of unknown passage IDs, altered quotations, and
  citations outside the agent's selected evidence.
- One bounded repair attempt, followed by a verified answer or abstention.
- Claim-level source buttons that reveal the exact passage, metadata, and
  official source URL.
- Review-gated PubMed Central ingestion that stops before adding unreviewed text
  to the live corpus.

## Verified agent flow

```text
Research question
      ↓
Muse Spark Open plans evidence needs and selects reviewed passage IDs
      ↓
Application code retrieves only approved passages
      ↓
Muse Spark Open drafts atomic claims and exact quotations
      ↓
Zod validates structure; deterministic code validates provenance
      ↓
valid answer ── or ── one repair ── or ── abstention
```

The model cannot approve its own citations. Exact quotation matching proves
provenance, not scientific truth or semantic entailment; important scientific
claims still require human review.

## Models and infrastructure

| Role | System |
| --- | --- |
| Direct answer and fallback | Meta Model API · `muse-spark-1.3` |
| Agent planning and drafting | Meta Muse Spark Open · `meta-models/Muse-Spark-Open-816B-A42B` |
| Open-weight hosting | Modal Shared Endpoint |
| Application | Next.js 16, React 19, TypeScript, Zod |
| Hosting | Vercel |

The OpenAI JavaScript package is used only as an OpenAI-compatible protocol
client for the Meta and Modal endpoints. No OpenAI-hosted model powers the
application.

## Evidence from the release candidate

- 24 automated tests pass across provenance, route boundaries, agent repair,
  abstention, and UI behavior.
- The hosted supported-question agent run selected four reviewed passages and
  returned nine claims with nine exact-quote citations; all passed the
  deterministic validator without repair.
- The hosted unsupported SARS-CoV-2 question selected zero passages, skipped
  drafting, and returned `insufficient` with zero claims.
- The direct Meta answer path remains available and passed its hosted check.

These are bounded demonstration results, not evidence of accuracy across
arbitrary papers or research domains.

## Run locally

```bash
cd web
npm install
cp .env.example .env.local
# Add the required server-only credentials to .env.local
npm run dev
```

Required for the direct path:

- `MODEL_API_KEY`
- `META_API_BASE_URL`
- `META_MODEL`

Required for the verified agent:

- `MODAL_PROXY_TOKEN`
- `MODAL_API_BASE_URL`
- `MODAL_MODEL`

Never prefix these credentials with `NEXT_PUBLIC_`.

## Checks and evaluation

```bash
cd web
npm test
npm run lint
npm run build
npm run evaluate:modal-open-weight
```

The Modal evaluation command makes billable endpoint requests. The two-paper
comparison materials are in [`evaluation/two-paper`](evaluation/two-paper), and
the agent implementation record is in
[`Modal/evidence-agent-implementation.md`](Modal/evidence-agent-implementation.md).

## Ingest a PubMed Central paper for review

```bash
cd web
npm run ingest-paper -- --pmcid PMC9343015
```

The command saves metadata, source XML, checksums, and stable paragraph records
under the ignored `local-papers/ingestion/` directory. It finishes with
`needs_review`; a paper is never added to the live corpus automatically.

## Known limitations

- The live corpus contains only two related R-BIND papers and six excerpts.
- Donlic 2022 adds data to an overlapping corpus; it is partial,
  non-independent replication rather than independent validation.
- Exact-quote validation does not prove that a claim is scientifically correct.
- Passage selection and interpretation can still be wrong and require review.
- There is no arbitrary upload interface, vector database, user account system,
  fine-tuning, or prospective prediction of RNA binding.
- Modal Shared Endpoint usage may be billed separately from promotional
  credits.

## Hackathon disclosure

The public implementation, reviewed demonstration corpus, evaluation harness,
trust checks, Modal integration, verified agent, and deployment were built
during the Meta Global AI Developer Hackathon. Earlier research and planning
are identified separately. See
[`submission/work-history-and-disclosures.md`](submission/work-history-and-disclosures.md).

## License

Copyright © 2026 Max Wo.

Except where otherwise noted, original source code and original documentation
are licensed under the [GNU Affero General Public License version 3](LICENSE),
SPDX expression `AGPL-3.0-only`.

This license does not relicense third-party materials. Research papers,
datasets, quoted passages, event materials, trademarks, dependencies, and other
third-party materials remain subject to their respective owners' terms.
