# EvidenceGraph web app

This directory contains the minimal EvidenceGraph vertical slice: one reviewed
Morgan 2017 evidence fixture, a server-side Meta Model API request, a grounded
answer card, and exact source-passage reveal.

## Run locally

```bash
npm install
cp .env.example .env.local
# Add your MODEL_API_KEY to .env.local
npm run dev
```

Open <http://localhost:3000>. The reviewed baseline and source reveal work
without an API key. The **Analyze evidence** action requires the key.

`MODEL_API_KEY` is server-only: it is read only inside the answer route and is
never exposed through a `NEXT_PUBLIC_` variable. The integration uses the
official Meta Model API base URL, `https://api.meta.ai/v1`, and defaults to
`muse-spark-1.3`.

## Checks

```bash
npm test
npm run lint
npm run build
```

The response validator rejects malformed model output and any source ID that
does not exist in the checked evidence fixture.
