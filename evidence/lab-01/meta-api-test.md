# Meta Model API connection evidence

- **Test time:** 2026-10-26 17:38 PDT / 2026-10-27T00:38:26Z
- **Local endpoint:** `POST /api/answer`
- **HTTP status:** `200`
- **Provider:** Meta Model API
- **Model:** `muse-spark-1.3`
- **Response mode:** `live`
- **Evidence status:** `supported_with_limitations`

## Test question

> What does Morgan et al. 2017 show—and not show—about using molecular
> properties to prioritize compounds for RNA screening?

## Harmless response record

> In a molecular-weight-matched comparison, R-BIND (SM) ligands had lower
> complexity (fewer Fsp3 and stereocenters) than FDA molecules, interpreted as
> supporting a “privileged chemical space” for RNA targeting; the principles
> were not explicitly tested for prioritizing screening against several RNA
> targets and library-origin bias could not be excluded.

The validated response cited only these approved passage IDs:

- `morgan-2017-rbind-fda-01`
- `morgan-2017-future-testing-01`

The response preserved both required limitations: possible screening-library
origin bias and the lack of prospective testing across RNA targets.

## Credential-safety check

- The credential variable is named `MODEL_API_KEY`.
- Its value is stored in `web/.env.local`, which is excluded by Git.
- The server-only integration reads it in `web/src/lib/meta.ts`.
- No `NEXT_PUBLIC_` credential variable is used.
- The browser request contains only the research question.
- A scan of the compiled browser assets found neither `MODEL_API_KEY` nor a
  `NEXT_PUBLIC_` credential reference.
- No credential value, prefix, or identifying fragment is recorded here.

This file is a redacted verification record. It demonstrates a successful
request without preserving the secret or raw authentication headers.
