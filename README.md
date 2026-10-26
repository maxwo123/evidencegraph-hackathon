# Life sciences + ML discovery and EvidenceGraph

This repository is a working place to learn how life sciences research happens, identify useful applications of ML, and prepare EvidenceGraph for the Meta Global AI Developer Hackathon.

## Current hackathon project — October 23, 2026

EvidenceGraph is a chatbot-style scientific research assistant. Its hackathon demonstration uses six papers from the RNA Rule of Five literature. A small knowledge graph connects generated answers to claims, datasets, comparison groups, methods, and exact source passages. Meta Model API performs structured extraction and evidence-constrained answer generation.

The public implementation, permitted demonstration data, evaluation artifacts, and
submission documentation will be added to this repository during the hackathon.
Private planning notes and lab manuals are intentionally maintained outside the
public Git history.

The separate [life sciences research notebook](life-sciences-research-notebook.md) records the broader research and customer-discovery work that preceded the hackathon direction.

## Research notebook status — October 19, 2026

- The notebook is a **first draft**. It maps the research process, common lab roles, data and ML workflows, and questions to ask researchers.
- There are **no recorded researcher interviews yet**. The [conversation notes section](life-sciences-research-notebook.md#12-conversation-notes) contains a template ready to copy after each call.
- The only idea in the parking lot is finding specialists for narrow scientific AI tasks. It came from earlier market analysis and is **unvalidated**. Do not treat it as the chosen business.
- The notebook distinguishes four possible layers: annotation work, expert recruitment, workflow tools, and prediction models. Interviews should show which problem, if any, is costly and repeated.

## Resume from here

1. **Talk to people doing the work.** Start with individual conversations with technicians, graduate students, postdocs, and other lab researchers. The notebook suggests an initial round of 4–6 researchers across a few settings, plus 2–3 life sciences ML/data practitioners and 1–2 provider or buyer conversations.
2. **Ask about a recent project.** Use the [interview guides](life-sciences-research-notebook.md#15-interview-guides). Get the actual workflow, the last concrete problem, the current workaround, its frequency and consequence, and who could approve a change.
3. **Write up each call.** Copy the [conversation note template](life-sciences-research-notebook.md#12-conversation-notes). Keep what the person said separate from your interpretation and any proposed solution. Do not put confidential lab data in this repository.
4. **Look for a repeated problem before building.** Compare the stories using the [testable opportunities section](life-sciences-research-notebook.md#16-turn-interviews-into-testable-opportunities). Pick a small manual trial or prototype only after identifying a specific user, buyer, and measurable improvement.

For background before a call, read the notebook's [research overview](life-sciences-research-notebook.md#1-what-is-life-sciences-research), [ML workflow map](life-sciences-research-notebook.md#13-how-ml-reaches-a-life-sciences-workflow), and [open questions](life-sciences-research-notebook.md#10-questions-to-investigate-next).

## License

Copyright © 2026 Max Wo.

Except where otherwise noted, the original source code and original
documentation in this repository are licensed under the
[GNU Affero General Public License version 3](LICENSE), identified by the SPDX
expression `AGPL-3.0-only`.

This license does not relicense third-party materials. Research papers,
datasets, quoted or extracted source passages, event rules and waiver text,
trademarks, dependencies, and other third-party materials remain subject to
their respective owners' terms. Only third-party material that may lawfully be
redistributed will be included in this repository, with its source and license
identified where applicable.
