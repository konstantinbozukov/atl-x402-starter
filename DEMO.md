# Demo script (for maintainers / PR reviewers)

**Goal:** prove ATL is fail-open and zero-cost when unused — in under one minute.

## Run

```bash
npm install
npm run demo:headers
```

No wallet. Hits live `https://signals.edge.report`.

## Expected output (shape)

```
=== A) No X-ATL-Agent-Id ===
HTTP 402
ATL response headers: { 'X-ATL-Consult-Id': null, 'X-ATL-Verdict': null, 'X-ATL-Score': null }
→ zero ATL work (no headers)

=== B) With X-ATL-Agent-Id ===
HTTP 402
ATL response headers: { 'X-ATL-Consult-Id': '…', 'X-ATL-Verdict': 'allow', 'X-ATL-Score': '50' }
→ ATL soft path ACTIVE

=== C) Free POST /v1/atl/consult ===
{ "verdict": "allow", "score": 50, "protocol": "atl", "version": "0.1.0", … }

PASS: zero-cost without header; soft ATL with header; consult OK.
```

## What this proves for a PR

1. **Default agents unchanged** — no header ⇒ identical to pre-ATL.
2. **Opt-in agents get a soft signal** — verdict/score on the 402/200 response.
3. **No payment blocking** — still HTTP 402 until x402 settles as usual.
4. **Live, not vapor** — same endpoints your PR would call.

## Optional: record a GIF

1. Run `npm run demo:headers` in a clean terminal.
2. Capture with [asciinema](https://asciinema.org/) or Windows Game Bar / CapCut.
3. Attach to the GitHub issue/PR (15–30s is enough).

## Optional: real pay

`npm run pay` with `X402_BUYER_PRIVATE_KEY` — shows `withAtl` + on-chain settle + local ledger.
