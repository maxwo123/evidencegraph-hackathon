# Q1 first-run scoring notes

- **Run:** `q1-first-run.json`
- **Model:** `muse-spark-1.3`
- **Question:** What molecular-property differences does each paper report?
- **Human spot-check status:** Pending for Donlic passage `donlic-2022-reclassification-01`

## Approach A - extracted paper text

- **Material claims supported:** Pass on initial review.
- **Citation precision:** Weak. The answer cites only paper-level source IDs, so a user must search the full paper to verify each claim.
- **Required qualifications:** Pass. It identifies the FDA group as a reference rather than confirmed RNA non-binders and does not claim prospective prediction.
- **Prohibited overstatements:** None observed.
- **Important omissions:** It does not clearly foreground that Donlic 2022 extends a related R-BIND corpus rather than independently replicating Morgan 2017.
- **Other observation:** The answer is detailed but much longer than needed for the question, increasing review burden.

## Approach B - EvidenceGraph records

- **Material claims supported:** Pass on initial review.
- **Citation precision:** Pass. Every claim points to a stable passage ID.
- **Required qualifications:** Pass. It identifies the FDA comparison limitation, the related-dataset limitation, reclassification effects, and lack of prospective validation.
- **Prohibited overstatements:** None observed.
- **Important omissions:** It omits some secondary property details available in the full texts, but those details are not needed for a concise answer to Q1.
- **Other observation:** The response is shorter and materially easier to audit.

## Narrow conclusion

In this single run, both approaches produced scientifically plausible answers. The EvidenceGraph approach improved claim-level traceability and concision while retaining the required limitations. This is a demonstration result, not evidence of general superiority; the remaining three questions and additional runs are needed before making a broader claim.
