# EvidenceGraph agentic + open-weight pivot

**Planned start:** October 30, 2026
**Status:** Modal spike and scientific spot check passed; ready for agent workflow
**Primary learning goal:** Run and evaluate a Meta open-weight model through
Modal
**Primary prize positioning:** Best Agentic Use-Case
**Secondary prize positioning:** Best Build on Meta Open Weight Models

## Why this is a controlled pivot

EvidenceGraph already has a working public product: a reviewed two-paper
corpus, a Next.js interface, a server-side Meta Model API call, source drawers,
abstention behavior, and deterministic citation-provenance checks. This pivot
must extend that product rather than replace it.

The new thesis is:

> EvidenceGraph is an evidence-verification agent that plans what evidence it
> needs, retrieves reviewed passages, compares related studies, drafts atomic
> claims, validates every citation, and either answers or abstains. Muse Spark
> Open runs through Modal as the open-weight reasoning path.

## Product invariants

The pivot is not allowed to weaken these properties:

1. Only reviewed passages can appear as verified sources.
2. Unknown passage IDs and altered quotations are rejected server-side.
3. Exact quotation matching proves provenance, not scientific interpretation.
4. Unsupported questions must be allowed to return insufficient evidence.
5. The current `muse-spark-1.3` path remains available until the Modal path is
   proven reliable.
6. The public Vercel application must remain usable while the experiment is in
   progress.
7. API credentials remain server-only and are never committed or displayed.

## Proposed architecture

```text
Research question
      |
      v
Evidence planner
      |
      v
Reviewed-passage retrieval
      |
      v
Cross-paper and dataset comparison
      |
      v
Muse Spark Open through Modal
      |
      v
Atomic claim + exact quotation proposal
      |
      v
Deterministic provenance validator
      |
      +---- invalid ----> one bounded repair attempt
      |                         |
      |                         v
      |                  answer or abstain
      v
Answer or abstain
```

The first implementation should be one orchestrating workflow, not multiple
independent agents. Each stage must have a typed input and output, and the
validator—not the model—decides whether a citation is mechanically valid.

## Model and infrastructure decision

Use a Modal shared Endpoint for Muse Spark Open before considering a dedicated
deployment. The full model is too large to self-host casually: Meta documents
an 816B-total/42B-active mixture-of-experts architecture, with checkpoints far
beyond ordinary local hardware.

Official references:

- [Meta Muse Spark Open](https://dev.meta.ai/docs/muse-spark-open)
- [Modal supported models](https://modal.com/docs/guide/supported-models)
- [Modal Endpoints](https://modal.com/docs/guide/endpoints)

Do not fine-tune during the initial pivot. First establish inference quality,
schema compliance, citation behavior, latency, and cost. Fine-tuning can become
a post-hackathon learning project once there is an appropriate training set and
evaluation baseline.

## Tomorrow: bounded Modal inference spike

### Objective

Run one saved EvidenceGraph question through Muse Spark Open on Modal and
determine whether it is suitable for the agent workflow without changing the
production default.

### Work plan

1. **Confirm Modal readiness**
   - Verify the active Modal account and credit balance.
   - Inspect available Muse Spark Open Endpoint options.
   - Record the exact model identifier and billing mode.
   - Set a conservative usage boundary before making requests.

2. **Create the server-side experiment path**
   - Add a minimal Modal client or provider adapter outside browser code.
   - Store Modal authentication only in ignored local configuration and the
     relevant deployment environment when needed.
   - Keep the existing Meta Model API adapter unchanged as the fallback.

3. **Run a controlled comparison**
   - Send the same reviewed Q1 evidence bundle to both model paths.
   - Require the same structured answer schema.
   - Run both outputs through the existing passage-ID and exact-quote
     validator.
   - Record model, provider, latency, status, claim count, citation pass/fail,
     and approximate usage.

4. **Test the scientific boundary**
   - Run the prepared unsupported question.
   - Confirm the open-weight path abstains with zero claims.
   - Do not repair a scientifically unsupported answer merely to make the
     endpoint look successful.

5. **Make the decision**
   - Keep the Modal path if it is usable, inspectable, and adds a credible
     open-weight story.
   - Keep it experimental if quality or latency is inconsistent.
   - Remove it from the demo path if it threatens reliability or cannot pass
     provenance validation.

### Acceptance criteria

- [x] A real Muse Spark Open response is received through Modal.
- [x] The exact provider and model identifier are recorded.
- [x] No Modal credential reaches browser code or Git.
- [x] Q1 produces schema-valid output or a clearly recorded failure.
- [x] Every proposed citation passes the existing provenance validator, or the
      response is rejected.
- [x] The unsupported question abstains with zero claims.
- [x] Latency and approximate usage are recorded.
- [x] The original Meta Model API path still passes its existing tests.
- [x] Production remains on the known-good path until the spike passes.

### Stop rules

Stop the spike and preserve the result if any of these occur:

- Endpoint access or the eligible model cannot be confirmed.
- The experiment requires an uncontrolled paid GPU deployment.
- The model repeatedly fails the response schema or citation validator.
- Integration work begins threatening the existing public demo.
- The spike exceeds the planned work session without producing one measured
  comparison.

## Decision gate after the spike

### If Modal passes

Proceed with the agentic workflow:

1. Make the planning, retrieval, comparison, validation, and abstention stages
   explicit in server code.
2. Preserve structured stage results for debugging and evaluation.
3. Permit one bounded repair attempt after citation-validation failure.
4. Display concise workflow progress in the UI.
5. Compare effectiveness against the current single-call baseline.

### If Modal is usable but inconsistent

Keep it as an opt-in demonstration or evaluation path. Do not make it the
production default. The current Meta API remains the judge-facing fallback.

### If Modal fails

Document the experiment and revert to the existing model path. The agentic
workflow can still be implemented with `muse-spark-1.3`; open-weight training
and deployment move to the post-hackathon roadmap.

## Later phases

### Phase 2 — Provider comparison

- Add a typed provider interface.
- Preserve identical evidence, prompt constraints, and response schema.
- Save redacted A/B outputs and a short evaluation.
- Do not silently switch providers in production.

### Phase 3 — Explicit agent workflow

- [x] Evidence-needs planning.
- [x] Reviewed retrieval.
- [x] Cross-paper comparison and dataset-lineage checks.
- [x] Claim drafting with exact quotations.
- [x] Deterministic citation validation.
- [x] One repair attempt, followed by answer or abstention.

### Phase 4 — Demo and evaluation

- [x] Show workflow stages without exposing private reasoning traces.
- [ ] Demonstrate one successful answer, one rejected citation, and one abstention.
  Success and abstention are live; rejected-citation repair is covered by the
  automated harness rather than forced in the production demo.
- [x] Measure citation validity, schema success, abstention behavior, latency, and
  recovery from provider failure.
- [x] Retain a deterministic reviewed fallback for the three-minute demo.

## X and community strategy

Do not announce the pivot before the open-weight path works. The strongest
short demo is a contrast:

1. A research question is asked.
2. An unsupported or altered citation is visibly rejected.
3. The agent repairs the answer or abstains.
4. A source drawer opens to the exact reviewed passage.
5. The caption clearly states that Muse Spark Open runs through Modal.

This story is more understandable than advertising a generic research chatbot
or listing infrastructure components.

## Explicitly out of scope for the initial pivot

- Fine-tuning Muse Spark Open.
- A multi-agent framework.
- Replacing the Next.js/Vercel application.
- Public paper uploads.
- Autonomous publication of model-extracted evidence.
- Adding providers solely to increase the technology count.
- Claiming that deterministic provenance validation proves scientific truth.

## Definition of success

The pivot succeeds if EvidenceGraph gains a measured, working open-weight path
and a genuine multi-step evidence workflow while the existing product remains
stable. Prize eligibility is a useful consequence, not the acceptance test.
