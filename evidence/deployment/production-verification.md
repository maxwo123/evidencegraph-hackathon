# Production deployment verification

- **Verification date:** 2026-10-29 PDT
- **Production URL:** <https://evidencegraph-hackathon.vercel.app>
- **Immutable deployment URL:** <https://evidencegraph-hackathon-e7ean8fcq-maxs-projects-7003fe5c.vercel.app>
- **Vercel deployment ID:** `dpl_J58NpfnmwmKe5f4VSWd7PfrZaEp5`
- **Application commit:** `83eb412`
- **Model:** `muse-spark-1.3`
- **Project root directory:** `web/`
- **Deployment state:** Ready

## Public, signed-out checks

The checks below were made without application authentication or session
cookies.

| Check | Result |
| --- | --- |
| `GET /` | HTTP 200; page reported 2 papers and 6 reviewed passages |
| Q1: molecular-property differences | HTTP 200 in 12.841 seconds; `supported_with_limitations`; 7 API claims; response included both `direct_evidence` and `interpretation` claim kinds |
| Unrelated CRISPR question | HTTP 200 in 2.886 seconds; `insufficient`; zero claims |
| Recent production error log | No error-level logs found during the one-hour verification window |

## Browser and citation verification

The live Q1 flow completed in a clean browser session and rendered a grounded
answer with direct-evidence and interpretation labels. Each unique passage
used by the answer opened the expected source drawer with the correct stable
passage ID, paper metadata, location, excerpt, and official PMC source link:

- `morgan-2017-rbind-fda-01` — PDF page 4
- `morgan-2017-future-testing-01` — PDF page 5
- `donlic-2022-dataset-update-01` — Introduction
- `donlic-2022-rbind-fda-01` — R-BIND (SM) 2.0 vs FDA
- `donlic-2022-reclassification-01` — R-BIND (SM) 1.2 vs 2.0

## Credential safety

- `MODEL_API_KEY` is configured as a sensitive, server-only Vercel environment
  variable for Production and Preview.
- The model name and API base URL are also configured in Vercel rather than in
  browser code.
- No credential uses a `NEXT_PUBLIC_` prefix.
- No secret value, prefix, authentication header, or identifying fragment is
  recorded in this evidence file.

## Build note

Vercel built the Next.js application successfully. The install step emitted
non-blocking npm warnings, but the build and both live API checks completed
successfully. The local and hosted versions use the same application code and
reviewed corpus.
