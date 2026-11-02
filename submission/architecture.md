# EvidenceGraph release architecture

```text
Browser
  ├─ Direct answer ──> /api/answer ──> Meta Model API / muse-spark-1.3
  │                                      │
  │                                      v
  │                               grounded JSON answer
  │
  └─ Verified agent ─> /api/agent-answer
                         │
                         ├─ 1. Muse Spark Open plans evidence needs
                         ├─ 2. Code retrieves reviewed passage IDs
                         ├─ 3. Lineage constraints are applied
                         ├─ 4. Muse Spark Open drafts claims + quotes
                         ├─ 5. Zod validates structure
                         ├─ 6. Code validates IDs + exact quotations
                         └─ 7. Answer, one repair, or abstention
                                      │
                                      v
                              answer card + source reveal
```

## Responsibility split

| Component | Responsibility | Cannot do |
| --- | --- | --- |
| Muse Spark Open | Plan evidence and propose cited claims | Approve its own citations |
| Reviewed corpus | Provide stable IDs, metadata, and exact text | Expand without human review |
| Zod schemas | Enforce required structured fields | Judge scientific truth |
| Provenance validator | Reject unknown IDs and non-verbatim quotations | Prove semantic entailment |
| Agent orchestrator | Bound stages and permit one repair | Loop indefinitely |
| Human reviewer | Check scientific interpretation and framing | Be replaced by exact matching |

## Why this is agentic

The model is not called once as a generic chatbot. It first chooses evidence
based on the question, receives the retrieved evidence, takes a second action
to draft claims, and may take one corrective action in response to deterministic
tool feedback. The orchestrator owns terminal outcomes and can stop without an
answer when evidence is missing.
