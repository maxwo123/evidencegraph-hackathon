# EvidenceGraph trust and failure harness

- **Implemented:** 2026-10-29
- **Command:** `cd web && npm run test:trust`
- **Scope:** deterministic provenance, API failure boundaries, and UI recovery

## What the harness proves

1. A valid grounded response with an approved passage ID and an exact source
   quote passes.
2. A nonexistent passage ID is rejected before the answer reaches the UI.
3. An altered scientific phrase is rejected because it is not an exact
   substring of the reviewed passage.
4. An insufficient-evidence answer can abstain without inventing claims.
5. Missing credentials, malformed model output, and an unexpected upstream
   failure produce controlled HTTP errors.
6. The interface prevents duplicate requests, exits its loading state after a
   failure, displays an understandable error, and permits retry.

## Important scientific boundary

Passage-ID and exact-quote validation establish provenance: the quoted words
exist in the reviewed source. They do **not** establish that a claim is a valid
interpretation of those words. The harness preserves this distinction by
returning `semanticSupport: "not_assessed"` from the mechanical provenance
check and includes a test showing that an unrelated claim can still carry a
real quote.

Scientific support therefore remains a separate review layer. For the MVP it
is tested with prepared supported and unsupported questions plus human source
checks. A future agentic workflow may add an explicit claim-support review
stage, but it must not present model judgment as deterministic proof.
