# Three-minute EvidenceGraph demo script

## Before recording

- Use the production URL in a clean browser window.
- Set browser zoom so the question, workflow trace, answer, and source drawer
  are readable at 1080p.
- Close notifications, unrelated tabs, terminals containing environment
  variables, email, and personal information.
- Run Q1 once immediately before recording to confirm endpoint health.
- Record a real run, but trim long network waiting time if necessary. Do not
  imply a saved result is live.

## Script and shot list

### 0:00–0:20 — Problem

**Show:** EvidenceGraph landing page and the two-paper/six-passage corpus label.

**Say:**

> Scientific chat can give a plausible answer without showing whether its
> sources are comparable—or whether a quoted passage even exists. EvidenceGraph
> is a verified literature agent that separates what a model proposes from what
> the application can mechanically verify.

### 0:20–0:40 — Agent choice

**Show:** Select **Verified agent · Modal**, then Q1.

**Say:**

> I am asking what molecular-property differences Morgan 2017 and Donlic 2022
> report. Meta's open-weight Muse Spark Open model is running through Modal. It
> first plans what evidence it needs and chooses only from human-reviewed
> passages.

### 0:40–1:20 — Successful workflow

**Show:** Click **Analyze evidence**. After the response, scroll through the
workflow trace and answer.

**Say:**

> The agent retrieved reviewed passages, applied the studies' dataset lineage,
> drafted atomic claims, and passed deterministic citation validation. The
> model does not approve its own evidence: Zod checks the response contract,
> and application code rejects unknown passage IDs or quotations that do not
> occur in the selected source.

### 1:20–1:50 — Reveal the evidence

**Show:** Open the Morgan source attached to the complexity claim; point to the
exact excerpt and limitation.

**Say:**

> I can open the exact passage behind a claim. Morgan reports fewer sp3 carbons
> and stereocenters, but also warns that source-library complexity may confound
> the observation. EvidenceGraph preserves that boundary instead of turning it
> into a binding prediction.

### 1:50–2:20 — Safe failure

**Show:** Ask, “Which reviewed molecule is proven to bind SARS-CoV-2 RNA in
humans?”

**Say:**

> This question is outside the corpus. The planner selects no passages, drafting
> is skipped, and the agent returns insufficient evidence with zero claims. If
> a draft instead contains a bad citation, it receives one repair attempt and
> then must abstain.

### 2:20–2:45 — Architecture and measured result

**Show:** Briefly show the architecture diagram or repository README.

**Say:**

> The release candidate has twenty-four automated tests covering provenance,
> repair, abstention, API failures, and UI behavior. A direct Meta Model API path
> remains available as a fallback. The hosted agent passed both the supported
> and unsupported demonstration flows.

### 2:45–3:00 — Close honestly

**Show:** Return to the answer and source.

**Say:**

> This prototype contains two related papers and six reviewed passages. It does
> not prove scientific truth or predict RNA binding. It demonstrates something
> narrower and essential: an agent that can show its evidence, accept validator
> feedback, and refuse to answer when the evidence is not there.

## Recording acceptance check

- Duration is at or below 3:00.
- Source text is readable.
- Audio is clear and has no long silent waits.
- No credentials or personal notifications appear.
- The video says two papers and six passages.
- Muse Spark Open, Modal, and the deterministic validator have distinct roles.
- The unsupported example visibly returns zero claims.
