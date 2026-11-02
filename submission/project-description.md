# EvidenceGraph submission copy

## One-line description

EvidenceGraph is a verified scientific-literature agent that ties every claim
to an exact reviewed passage and abstains when the corpus cannot support an
answer.

## Short description

EvidenceGraph helps researchers inspect—not merely accept—AI literature
answers. Meta's open-weight Muse Spark Open model plans evidence needs, selects
reviewed passages, and drafts atomic claims. Deterministic code then validates
the response schema, passage IDs, and exact quotations. Invalid drafts receive
one repair attempt; unsupported questions end in abstention. The hackathon demo
uses two related RNA-targeting small-molecule papers and clearly distinguishes
database persistence from independent validation.

## Full description

Scientific chat systems can produce plausible answers without showing whether
their sources are comparable or whether a quotation actually supports the
claim attached to it. EvidenceGraph makes that boundary visible.

For the hackathon investigation, a researcher asks what molecular-property
differences Morgan 2017 and Donlic 2022 report for RNA-targeting small
molecules. Muse Spark Open, hosted through a Modal Shared Endpoint, first plans
the evidence needed and selects stable IDs from six human-reviewed passages.
Application code retrieves only those passages. The model then drafts atomic
claims with exact quotations. Zod enforces the output contract, and
deterministic validators reject unknown IDs, altered quotes, and citations
outside the selected evidence. The agent gets one repair attempt before it must
answer or abstain.

The interface reveals a safe workflow trace and lets the viewer open every
source passage with its authors, location, DOI, PMID, PMCID, and official URL.
An unsupported SARS-CoV-2 question selects no passages, skips drafting, and
returns zero claims. A direct Meta Model API path remains available as a
fallback.

EvidenceGraph does not claim to verify scientific truth or predict RNA binding.
It demonstrates a narrower capability: separating model-generated proposals
from deterministic provenance checks so a research answer is inspectable and
allowed to fail safely.

## Submission facts

- **Theme:** Push the Frontier
- **Track:** Indie Developer
- **Primary positioning:** Best Agentic Use-Case
- **Secondary positioning:** Best Build on Meta Open Weight Models
- **Live URL:** <https://evidencegraph-hackathon.vercel.app>
- **Repository:** <https://github.com/maxwo123/evidencegraph-hackathon>
- **Corpus:** 2 papers, 6 reviewed passages
- **Open-weight model:** `meta-models/Muse-Spark-Open-816B-A42B`
- **Open-weight host:** Modal Shared Endpoint
- **Direct fallback:** Meta Model API, `muse-spark-1.3`

## Claims safe to make

- The agent chooses among reviewed passages before drafting.
- Unknown IDs and altered quotations are rejected deterministically.
- The demonstrated unsupported question abstains with zero claims.
- The hosted supported run passed passage-ID and exact-quote validation.

## Claims not to make

- The application proves scientific truth.
- It predicts whether an unseen molecule binds RNA.
- The FDA collection is a same-assay non-binder control.
- Donlic 2022 independently replicates Morgan 2017.
- The prototype supports arbitrary papers or a six-paper live corpus.
