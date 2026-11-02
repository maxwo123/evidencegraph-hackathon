# EvidenceGraph verified agent implementation

**Implemented:** October 31, 2026

## Purpose

The verified agent turns a single model request into a bounded scientific
workflow. Muse Spark Open chooses relevant reviewed passages and drafts claims;
deterministic application code controls retrieval and decides whether citations
are mechanically valid.

## Workflow

1. **Plan evidence** — Muse Spark Open identifies evidence needs and selects
   exact IDs from the reviewed catalog.
2. **Retrieve passages** — application code rejects unknown IDs and loads only
   reviewed passages.
3. **Check study lineage** — the draft prompt applies the known Morgan/Donlic
   dataset relationship and scientific framing constraints.
4. **Draft claims** — Muse Spark Open proposes atomic claims with exact quotes.
5. **Validate citations** — Zod validates the response shape; deterministic
   code checks that every passage was selected and every quotation occurs in
   the cited reviewed passage.
6. **Repair once** — a rejected draft gets one constrained repair attempt.
7. **Finish or abstain** — a valid answer is returned; a second validation
   failure becomes an abstention with zero claims.

The UI exposes stage outcomes but not hidden model reasoning. The original
direct `/api/answer` route remains the default and fallback. The experimental
agent uses `/api/agent-answer` and is selected with **Verified agent · Modal**.

## Live validation

Supported question:

- Question: What molecular-property differences does each paper report?
- Planner selected four reviewed passages.
- Result: `supported_with_limitations`
- Claims: 6
- Citations: 6
- Repair used: no
- Exact-quote validation: passed

Unsupported question:

- Question: Which reviewed molecule is proven to bind SARS-CoV-2 RNA in humans?
- Planner selected zero passages.
- Drafting was skipped.
- Result: `insufficient`
- Claims: 0

The first two end-to-end workflow checks added $0.02 according to Modal's
billing summary. That early summary temporarily labeled the amount as billed.
After the final release checks, Modal reported $0.08 metered usage deducted from
credits and $0.00 billed cost. Shared-endpoint billing should still be monitored
through judging.

## Safety boundaries

- The model cannot retrieve arbitrary documents or invent approved passage IDs.
- The model cannot declare its own citations valid.
- Only one repair is allowed.
- Invalid output is not silently displayed.
- Modal credentials remain server-only.
- The existing direct answer route remains available if the agent is disabled.
