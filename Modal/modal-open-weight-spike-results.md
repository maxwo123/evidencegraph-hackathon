# Modal open-weight inference spike

**Run date:** October 31, 2026
**Decision:** Passed the technical and human scientific-review gates
**Provider:** Modal Shared Endpoint
**Model:** `meta-models/Muse-Spark-Open-816B-A42B`
**Production default changed:** No

## Supported-question result

**Question:** What molecular-property differences does each paper report?

- Status: `supported_with_limitations`
- Latency: 6,601 ms
- Input tokens: 1,617
- Output tokens: 3,323
- Claims: 8
- Citations: 9
- Deterministic passage-ID and exact-quote validation: passed

Model answer:

> Morgan 2017 compared R-BIND (SM) to an FDA library MW-filtered to the
> R-BIND range and reported statistically significant lower molecular
> complexity (fewer Fsp3 and stereocenters). Donlic 2022 extends and
> reclassifies the same R-BIND corpus (n=97 to n=153, +50%) and finds
> persistence of distinguishing trends: using an MW cutoff at 705.93 Da,
> 18/20 physicochemical parameters differed significantly between R-BIND 2.0
> and FDA by Mann-Whitney U. Within R-BIND, the 1.2 vs 2.0 MW increase
> (P=0.02) and ASA increase (P=0.03) was attributed to reclassification, not
> a change in chemical space itself, indicating persistence across a database
> update rather than independent replication.

Claims proposed for human scientific review:

1. Morgan restricted the FDA comparison to the R-BIND molecular-weight range.
2. Morgan reported fewer sp3-hybridized carbons and stereocenters in R-BIND.
3. Donlic used a 705.93 Da FDA molecular-weight cutoff.
4. Donlic reported significant differences in 18 of 20 parameters.
5. Donlic reported persistence of distinguishing trends as the corpus grew
   from 97 to 153 molecules.
6. Donlic reported significant increases in molecular weight and accessible
   surface area between R-BIND 1.2 and 2.0.
7. Donlic attributed those version differences to reclassification rather
   than a changed chemical space.
8. Morgan framed the patterns as a privileged chemical space while calling
   for further explicit testing.

Exact quotations for all nine citations were accepted by the existing
provenance validator. This proves that the quotations occur in the reviewed
passages; it does not by itself prove that each quotation semantically supports
its attached claim.

## Human scientific spot check

Completed October 31, 2026. The reviewer confirmed the reported figures and
claims against both papers, subject to these recorded qualifications:

- Morgan's complexity difference is observational and may be confounded by the
  lower complexity of synthetic and commercial screening libraries from which
  many R-BIND ligands were discovered.
- The growth from 97 to 153 refers to R-BIND 1.2 versus 2.0, not Morgan's
  original 2017 set.
- Donlic adds new molecules but retains an overlapping corpus, related curation,
  and the same analysis pipeline. The most precise framing is therefore
  "partial, non-independent replication," not independent validation.
- Donlic attributes the MW and ASA shifts to reclassification. That explanation
  should not be generalized to every parameter; hydrogen-bond acceptors were
  discussed separately as a trend to monitor.
- The verified Donlic title is *R-BIND 2.0: An Updated Database of Bioactive
  RNA-Targeting Small Molecules and Associated RNA Secondary Structures*.

The repository's active evidence fixture already uses that correct title. A
repository-wide search found no remaining use of the incorrect "Associated RNA
Drug Targets" title.

## Unsupported-question result

**Question:** Which of the reviewed molecules is proven to bind SARS-CoV-2 RNA
in humans?

- Status: `insufficient`
- Latency: 3,259 ms
- Input tokens: 1,626
- Output tokens: 598
- Claims: 0
- Citations: 0
- Abstention behavior: passed

The model correctly stated that the reviewed passages contain no SARS-CoV-2
binding assays or human evidence.

## Cost and safety

- Two capture requests used 7,164 total tokens.
- Modal reported the first two-request run as $0.02 metered and $0.00 billed,
  with the cost deducted from credits. A second two-request capture was made
  to preserve reviewable claims; check the final billing summary for the
  cumulative rounded amount.
- The proxy token is stored only in ignored `web/.env.local`, with file mode
  `0600`.
- No credential is included in this report, source code, browser bundle, or
  Git.

## Reproduce

From `web/`, run:

```bash
npm run evaluate:modal-open-weight
```

The runner sends the two fixed questions through the same evidence prompt and
schema, validates every returned citation, and prints a reviewable JSON result.
