# Two-paper comparison evaluation

This evaluation tests whether structured EvidenceGraph records improve a bounded scientific comparison over supplying paper text alone.

## Approaches

- **A - extracted paper text:** the model receives extracted Morgan 2017 and Donlic 2022 text with the same question and output instructions.
- **B - EvidenceGraph:** the model receives reviewed passage records with stable IDs, metadata, and interpretation boundaries.

Both approaches use the same model. The comparison is not a model benchmark and does not establish statistical superiority from one question.

## Scoring

For each answer, record:

1. Whether every material claim is supported by the supplied source.
2. Whether citations point to the correct passage.
3. Whether required qualifications are present.
4. Whether any prohibited overstatement appears.
5. Important omissions.

The four human-authored reference records are in `reference-answers.json`. They are evaluation criteria, not prompt context.

## Interpretation boundary

Morgan 2017 and Donlic 2022 are related R-BIND analyses. Donlic is an update and expansion, not an independent replication. Neither paper validates prospective RNA-binding prediction for unseen compounds.
