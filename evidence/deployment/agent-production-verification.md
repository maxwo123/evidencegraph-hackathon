# Verified-agent production deployment

- **Verification date:** November 1, 2026 PST
- **Production URL:** <https://evidencegraph-hackathon.vercel.app>
- **Tested immutable deployment:**
  <https://evidencegraph-hackathon-hwcfiiqxm-maxs-projects-7003fe5c.vercel.app>
- **Vercel deployment ID:** `dpl_DPTcPj9cEbmXrNbEw2g7zjWmLAFh`
- **Application commit:** `5f99e77`
- **State:** READY and promoted

## Release checks

| Boundary | Result |
| --- | --- |
| Public `GET /` | HTTP 200 |
| Direct Meta API path | `supported_with_limitations`; 11 claims; `muse-spark-1.3` |
| Modal agent path | `supported_with_limitations`; 9 claims; 9 citations |
| Agent planner retrieval | 4 reviewed passages selected |
| Agent validation | Passed without repair |
| Unsupported question | `insufficient`; 0 passages; 0 claims; drafting skipped |
| Production error log scan | No error-level logs found |

At final verification, Modal reported $0.08 metered LLM-token usage, $0.08
deducted from credits, and $0.00 billed cost.

## Environment and credential boundary

Vercel has server-only Production and Preview variables for the direct Meta
path and the Modal agent path. The Modal proxy token is stored as a Sensitive
variable. No secret value is included in this file, browser code, Git, or
deployment output.

## Verification limitation

The immutable production deployment used Vercel Deployment Protection and was
tested through the authenticated Vercel CLI bypass before promotion. The
primary production URL was then checked without authentication. Automated HTTP
checks confirm the API and data flow; the final source-drawer interaction still
requires the human private-window recording rehearsal in the submission
checklist.
