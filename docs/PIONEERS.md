# ATL pioneers (non-cash incentive)

Get on the board **without** waiting for a starter maintainer to merge a PR.

## Free credits (Edge Signals)

One free call per `X-ATL-Agent-Id` per SKU:

```bash
curl -sS -H "X-ATL-Agent-Id: your-agent-id" \
  "https://signals.edge.report/v1/atl/free/gas"

curl -sS -H "X-ATL-Agent-Id: your-agent-id" \
  "https://signals.edge.report/v1/atl/free/token-risk?address=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&chain=base"
```

## Soft headers on paid paths

Same as before — no payment required to *see* ATL headers (402 still returns them):

- `GET /v1/gas` + `X-ATL-Agent-Id`
- `GET /v1/token-risk` + `X-ATL-Agent-Id`

## Board

```bash
curl -sS https://signals.edge.report/v1/atl/pioneers
```

Paid settlements recorded via `withAtl` / `recordSettlement` also appear here.

## Drop-in (no maintainer)

```bash
git clone https://github.com/konstantinbozukov/atl-x402-starter
cd atl-x402-starter && npm i && npm run drop-in
```

Copy the printed `withAtl` snippet into any agent that already pays.
