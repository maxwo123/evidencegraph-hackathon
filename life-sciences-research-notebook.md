# Life sciences research: a working notebook

**Started:** October 19, 2026  
**Purpose:** Learn how life sciences research works, find problems worth investigating, and explore where ML might help.  
**Status:** First draft. We will revise this as conversations and examples change our understanding.

> **How to use this file:** Read one section at a time. Add questions in `Questions to investigate`. When a researcher tells us how their work actually happens, add it to `Conversation notes` with a date. Keep an observation, our interpretation, and a proposed solution separate.

## 1. What is life sciences research?

Life sciences research studies living systems: molecules, cells, organisms, populations, and ecosystems. A project might ask how a protein works, why an infection spreads, how cells respond to stress, or which species live in a habitat. The questions, tools, and evidence differ across fields. There is no single “life sciences workflow.”

One useful distinction is **what the study aims to learn**:

| Kind of work | Typical question | Possible output |
| --- | --- | --- |
| Basic research | How does this biological process work? | A new mechanism or explanation |
| Applied or translational research | Can this knowledge help solve a practical problem? | A candidate intervention, tool, or method |
| Clinical research | What happens in people receiving care or participating in a study? | Evidence about human health, interventions, or outcomes |

These categories overlap. Research can also happen in different **settings**: a wet lab, a field site, a clinic, or a computational workspace. For example, an ecologist may use field observations to answer a basic question; a clinical researcher may analyze existing data. Findings and questions move back and forth; progress is rarely a straight line. [NIH NCATS explains the translational research spectrum](https://ncats.nih.gov/about/about-translational-science/spectrum).

## 2. The basic loop of a research project

The details vary, but this is a useful first map:

1. **Notice a gap or puzzling result.** A paper, observation, or failed experiment suggests something we do not understand.
2. **Make the question specific.** Decide what would count as an answer. “How do cells work?” is too broad; “Does condition A change measurement B in this cell system?” can be tested.
3. **Design a fair comparison.** Choose samples, controls, measurements, and an analysis plan. Ask what else could explain the result.
4. **Pilot the method.** Check that the measurement works and the data are usable. Researchers often revise the method at this point.
5. **Collect and record data.** Perform experiments, field observations, or computational analyses. Record what happened, including deviations and failed attempts.
6. **Check quality and analyze.** Look for errors, missing metadata, technical artifacts, and uncertainty before interpreting a pattern.
7. **Interpret, challenge, and share.** Compare the result with the original question and other evidence. Another experiment, dataset, or researcher may be needed to check the finding.

Research loops back: a negative result, bad measurement, or unexpected pattern can lead to a better question. NIH defines rigor in terms of careful design, methods, analysis, interpretation, and reporting—not just whether a result looks exciting. [NIH guidance](https://www.grants.nih.gov/policy-and-compliance/policy-topics/reproducibility)

### Three questions to ask at every step

- **What is the biological claim?** For example, “this treatment changes growth.”
- **What was measured?** A measurement is usually a proxy for some aspect of the claim.
- **What else could produce the measurement?** Differences in samples, instruments, timing, or analysis may create a misleading pattern.

## 3. A worked example: studying yeast growth

*Illustrative example only; this describes research reasoning, not a lab protocol.*

**Question:** Does a stressful growth condition change yeast growth compared with a standard condition?

**Possible study:** A researcher grows independent yeast cultures under the two conditions and measures a growth indicator over time. The standard condition is a **control**. The researcher tries to keep other relevant factors, such as the starting material and measurement schedule, comparable. They record which sample came from which culture and when it was measured.

**Why this takes care:** A measurement such as cloudiness can indicate how much material is in a liquid culture, but it is not a direct count of living cells. A difference could reflect the condition, starting differences between cultures, or measurement problems. Repeated readings of *one* culture help check the measurement; independently grown cultures help test whether the biological result recurs. [NIH research guidance discusses biological and technical replicates](https://oir.nih.gov/system/files/media/file/2026-01/guidelines-conduct_research.pdf).

**What a result means:** If the stressed cultures repeatedly show less growth, that supports an effect *in this system under these conditions*. It does not automatically explain the biological mechanism or prove the same effect in another organism.

**Possible ML question:** If a lab collected many images, could software estimate growth consistently enough to save manual counting? First compare it with the lab’s existing method and define an acceptable error. If training an ML model, keep images from the same culture or experiment together when testing whether it works on genuinely new material. Biological datasets can contain hidden relationships that make a model look better than it will perform in use. [Review of data leakage in biological ML](https://pubmed.ncbi.nlm.nih.gov/39122953/)

## 4. Who does what in a lab?

Roles vary by lab, but this gives us a starting vocabulary:

| Role | Often contributes |
| --- | --- |
| Principal investigator (PI) | Sets research direction, secures resources, supervises people, and remains responsible for the lab’s work |
| Research staff or technician | Maintains methods, equipment, samples, records, and experiments; may have deep practical expertise |
| Postdoctoral researcher | Leads projects after a doctorate, designs studies, mentors others, and analyzes or publishes results |
| Graduate student | Develops research questions and conducts studies while training toward a degree |
| Undergraduate researcher | Learns methods and contributes to scoped tasks or projects under supervision |
| Computational collaborator | Helps design analyses, process data, build tools, or interpret quantitative results |

The PI may see a problem as a priority or budget issue. The person who runs the experiment may know the actual workaround and where time is lost. We should speak with both when investigating a problem.

## 5. The outputs between “experiment” and “paper”

A research result depends on more than a final figure. A lab may create a **protocol** (the method), **samples**, **raw measurements**, **metadata** (information about each sample and how it was collected), **quality checks**, **analysis code or spreadsheets**, **figures**, and finally a report, dataset, or paper.

Missing context can make data difficult to reuse. Before reanalyzing public genomics data, EMBL-EBI advises checking sample descriptions, controls, replicates, study design, and data quality. [EMBL-EBI training](https://www.ebi.ac.uk/training/online/courses/functional-genomics-iii-submitting-data/re-use-of-functional-genomics-data/)

**Question for any workflow:** Where does information get copied, cleaned, checked, or reconstructed by a person? That is often where a practical problem becomes visible.

## 6. How to read a research paper

A paper is the authors’ structured account of a study. Many life sciences papers have an **abstract** (short summary), **introduction** (why the question matters), **methods** (what they did), **results** (what they found), and **discussion** (what they think it means and its limits). The figures and tables are often the quickest way to find the main evidence. [NIH guide to reading a scientific article](https://www.nccih.nih.gov/health/know-science/how-to-make-sense-of-a-scientific-journal-article/abstract-and-main-section)

For a first pass, write down four things: **the question, the comparison, the main measurement, and the authors’ conclusion**. Then ask whether the measurements and controls support that conclusion. It is normal to return to the methods after a figure raises a question.

## 7. Where ML might fit

ML learns patterns from examples to make predictions or help process new data. Across life sciences, possible uses include analyzing images, finding patterns in molecular measurements, or prioritizing cases for human review. The biological question and the quality of the data determine whether those predictions are useful.

Before choosing a model, ask:

1. What decision or task would improve?
2. What examples and trustworthy reference answers already exist?
3. How much of the task can current software or a simple rule handle?
4. What errors would matter to the researcher?
5. Can we test on genuinely new samples, experiments, labs, or time periods?
6. Who would check and use the output in the existing workflow?

In some projects, the best opportunity may be organizing data, improving measurement, or connecting existing tools. EMBL-EBI notes that an analysis plan and computing needs should be considered while designing a genomics experiment, before the data are generated. [EMBL-EBI experimental design training](https://www.ebi.ac.uk/training/online/courses/functional-genomics-i-introduction-and-design/designing-functional-genomics-experiments/data-analysis/)

## 8. Questions for conversations with researchers

Start with a recent project and ask the person to walk through what happened:

- What question were you trying to answer?
- What did your team collect or measure? Who collected it?
- Which steps took the most time, and why?
- Where did a person need to make a scientific judgment?
- What failed, had to be repeated, or required manual correction?
- What tools or collaborators helped? Where did they fall short?
- How did you decide the result was trustworthy?
- If one step improved, what would it let the team do next?

For an idea to become a real project, also learn who owns the workflow, whether the same problem happens elsewhere, and who could authorize time, data access, or money to test a solution.

Start with individual conversations when possible. In a lab-group discussion, let each person describe their work before the group settles on an answer; differences between the PI’s view and the day-to-day workflow are useful evidence.

## 9. Small glossary

| Term | Plain meaning |
| --- | --- |
| Hypothesis | A proposed explanation or relationship that evidence can test |
| Sample | A unit of material or observation in a study; its meaning depends on the design |
| Control | A comparison that helps interpret the effect of the condition being studied |
| Assay | A procedure for measuring a biological or chemical property |
| Endpoint | The outcome the study plans to evaluate |
| Biological replicate | An independently generated biological observation or sample |
| Technical replicate | A repeated measurement or processing of the same biological material |
| Confounder | Another difference that could help explain an observed result |
| Metadata | Information about a sample, measurement, method, or context |
| Quality control (QC) | Checks that data or procedures meet the needs of the analysis |
| Validation | Testing whether a method or result holds up under a relevant check |
| Preprint | A research manuscript shared before formal peer review |

## 10. Questions to investigate next

- [ ] What does a typical week look like for a graduate student, technician, and PI in different kinds of life sciences labs?
- [ ] How does someone turn a broad biological interest into a feasible study?
- [ ] What exactly is a “good control” in different experiments?
- [ ] What makes biological data hard to analyze or reuse?
- [ ] Where have labs tried ML already, and what happened when they put it into daily work?
- [ ] How do funding, equipment, staffing, and publication goals affect a lab’s priorities?
- [ ] Which problems recur across several labs, rather than only one project?

## 11. Idea parking lot

These are **possibilities to investigate**, not validated opportunities.

| Idea or problem | Where it came from | Who experiences it? | Current workaround | Evidence needed next |
| --- | --- | --- | --- | --- |
| Finding specialists for narrow scientific AI tasks | Earlier market analysis | AI labs or life sciences teams | Existing expert platforms, internal recruiting | Ask buyers about recent unmet requests and rejected work |

## 12. Conversation notes

Copy this template after each conversation. Avoid recording confidential lab data here.

```markdown
### YYYY-MM-DD — Person/role — Research area

- Research question and workflow:
- Specific recent problem (their words):
- Current workaround:
- Frequency and consequence:
- What I observed or was shown:
- My interpretation (may be wrong):
- Possible ML or non-ML approach:
- Who else to ask:
- Open questions:
```

## 13. How ML reaches a life sciences workflow

An ML project usually moves through these steps. The hardest part may happen before or after model training.

| Step | What it means | Friction to listen for |
| --- | --- | --- |
| Scientific question | Decide what result would be useful | The task may be too vague, or the result may not change a decision. |
| Data collection | Gather images, sequences, measurements, records, or literature | Data may be scattered, restricted, inconsistent, or too small. |
| Curation and context | Check quality and attach metadata such as sample, condition, instrument, and protocol | Missing context can make apparently similar records incomparable. |
| Annotation, when needed | Have people assign reference answers, such as cell boundaries, phenotypes, or whether an AI response is scientifically correct | Specialist time, ambiguous instructions, disagreement, and quality review can be costly. Not every ML project needs manual labels. |
| Modeling and evaluation | Train or adapt a model and test it against a useful baseline on relevant new data | A model may fit one lab's data but fail on another instrument, site, or population. |
| Use in the workflow | Put the output where a researcher can inspect and act on it | Integration, trust, validation, and ownership can block adoption even when a model works. |

**Keep the possible businesses separate:** An annotation service produces or reviews reference answers. An expert recruitment platform finds people who can do that work. A workflow tool helps a lab use data or ML in its existing process. A model company builds the prediction itself. Interviews should reveal which layer causes the pain.

For background, see [EMBL-EBI's life sciences ML practical](https://www.ebi.ac.uk/training/materials/data-science-for-life-scientists-materials/introduction-to-machine-learning/machine-learning-practical/), its [data management course](https://www.ebi.ac.uk/training/online/courses/bringing-data-to-life-data-management/), and [research guidance on data quality and validation in biomarker ML](https://pmc.ncbi.nlm.nih.gov/articles/PMC9371329/).

## 14. Who to talk with first

1. **Lab researchers and research staff:** Ask about the real work, including experiments, data handling, analysis, and decisions. Include technicians, graduate students, postdocs, and, where possible, principal investigators. Speak one-on-one first so each person can describe their own experience.
2. **ML and data teams in life sciences:** Ask how they acquire data, create or review labels, evaluate models, and get a tool adopted. These teams may be customers for specialist annotation or collaborators on other workflow problems.
3. **Annotation and expert-talent providers:** Learn how they recruit, screen, train, and quality-check specialists. Their account of customer demand is useful context, but confirm any claimed gap with potential customers.
4. **Someone who controls the budget or deployment:** Learn who approves a purchase, what evidence they need, and what alternative they would stop using.

An initial learning round could be 4–6 researchers across a few life sciences settings, 2–3 ML/data practitioners, and 1–2 provider or buying-side conversations. These are starting targets, not a rule for deciding that a market exists.

## 15. Interview guides

**Opening:** “I'm learning how life sciences teams turn data into research results and where ML could help. Could you walk me through a recent project from question to result?” Ask for a specific recent example before discussing your idea. A 20–30 minute one-on-one conversation is enough for a first pass.

### Researchers and lab staff

1. What question was the project trying to answer? What experiment or data did you use?
2. Walk me through the last time you processed that data. Which steps did you do by hand, and with what tools?
3. Where did you wait, redo work, or ask someone else for help? What caused that?
4. How did you check that the data, labels, or analysis were right? Where did people disagree?
5. What happened downstream when that step was slow or wrong? How often does it happen?
6. Have you tried software, automation, or ML for this? What worked, and what still needed a person?
7. Who would need to approve a change to this workflow? What proof would make them comfortable trying it?

### ML and data teams

1. Tell me about a recent life sciences ML project that shipped, stalled, or was abandoned. What was the intended user decision?
2. Where did the most time go: finding data, permissions, cleaning, labeling, modeling, evaluation, integration, or review?
3. If you needed specialist labels or evaluations, who defined the task, who did the work, and who checked quality?
4. Which expertise was hardest to find? How did you screen for it, and what happened when expertise was mismatched?
5. What did you build internally versus buy? What failed with existing vendors or tools in a specific project?
6. What metric or demonstration would justify paying for a better solution? Who owns that budget?

### Annotation or expert-talent providers

1. What life sciences tasks do customers bring to you, and which requests are hardest to fulfill?
2. How do you verify specialist expertise, give task instructions, and resolve disagreement between experts?
3. What does the customer still have to do after your work is delivered?

**Useful follow-ups:** “Can you describe the last time?” “How long did that take?” “How often?” “What did you do instead?” “Who else was involved?” “Could you show a public or redacted example?” Avoid asking people to share confidential research data.

## 16. Turn interviews into testable opportunities

For each story, record five separate things: **observed problem**, **current workaround**, **cost or consequence**, **possible ML or service approach**, and **what remains unverified**. Interest in an idea is weaker evidence than a repeated costly problem and an existing workaround.

| If the recurring obstacle is… | A first experiment might be… |
| --- | --- |
| Researchers repeatedly clean or reconcile the same data | Manually standardize a small dataset and measure time saved or errors caught. |
| Specialist labels are slow or inconsistent | Run a small, blinded annotation task with clear instructions and independent quality review. |
| Teams cannot find qualified reviewers | Recruit a few experts manually and compare screening time, accuracy, and customer review effort with their current process. |
| A usable model never reaches the lab workflow | Prototype one decision step with a researcher and measure whether it changes time, accuracy, or confidence. |

Before building a platform, identify a specific user and buyer, a frequent problem with a meaningful consequence, access to appropriate data, a measurable improvement, and a workflow where the solution can be used. The first trial can be a manual service or lightweight prototype.

## Sources and reading path

Start with [NIH NCATS on types of translational research](https://ncats.nih.gov/about/about-translational-science/spectrum), then [NIH on rigor and reproducibility](https://www.grants.nih.gov/policy-and-compliance/policy-topics/reproducibility). When we get to data workflows, use [EMBL-EBI’s training materials](https://www.ebi.ac.uk/training/). For a deeper distinction between reproducing an analysis and repeating a study, see the [National Academies report](https://www.ncbi.nlm.nih.gov/books/NBK547546/).
