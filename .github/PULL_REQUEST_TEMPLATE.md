## Summary

Optional, fail-open **Agent Trust Layer (ATL)** on the paid fetch path.

- Default: **unchanged** (no `X-ATL-Agent-Id` => no ATL work / no added latency).
- Opt-in: set agent id / `ATL_ENABLED` → soft `X-ATL-Verdict` / `X-ATL-Score` from sellers that support ATL; local `withAtl` consult + async settlement.

## Demo

```bash
# standalone proof against live Edge Signals
git clone https://github.com/konstantinbozukov/atl-x402-starter
cd atl-x402-starter && npm i && npm run demo:headers
```

Protocol: https://github.com/konstantinbozukov/agent-trust-layer  
Live: https://signals.edge.report/v1/atl/health  

## Changes

- [ ] Opt-in only (default off)
- [ ] No blocking of 402 / payment
- [ ] No required remote consult before pay
- [ ] Docs: one short paragraph + link to demo

## Test plan

- [ ] Run existing starter tests / `npm start` without ATL → identical behavior
- [ ] Enable ATL → headers or local consult as documented
- [ ] Confirm unpaid discovery path has no ATL headers

## Notes

Happy to split / shrink further. Opt-in only; default path unchanged.
