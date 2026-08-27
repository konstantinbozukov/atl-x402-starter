## Optional ATL (Agent Trust Layer) on x402 paid fetch?

Hi — I maintain a small open protocol ([ATL v0.1](https://github.com/konstantinbozukov/agent-trust-layer)) for **consult-before-spend** on agent payments.

**Ask:** Would you take a tiny **opt-in** PR that wraps your existing paid `fetch` with ATL headers?

### Why it might fit this repo
- Same shape as other fetch wrappers (audit / routing): optional, fail-open.
- **No header ⇒ zero ATL work** (no latency tax on default agents).
- Does **not** block HTTP 402 / settlement.

### Live demo (no wallet)
```bash
git clone https://github.com/konstantinbozukov/atl-x402-starter
cd atl-x402-starter && npm i && npm run demo:headers
```
Or curl: https://signals.edge.report/v1/atl/health

### Out of scope for the PR
Token, escrow, remote consult RTT before every pay, making ATL required.

Happy to keep the PR ≤ ~20 lines and revise to your taste. Thanks either way.
