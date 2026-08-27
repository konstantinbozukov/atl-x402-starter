# Target repos for optional ATL PRs

**Rule:** one issue + one PR at a time. Prefer small **x402 agent starters**, not framework cores.

| Priority | Repo | Why | Approach | Risk |
|----------|------|-----|----------|------|
| **P0** | [valeo-cash/x402-agent-starter](https://github.com/valeo-cash/x402-agent-starter) | Explicit “25-line starter”; already wraps `fetch` for audit (Sentinel) — same shape as `withAtl` | Optional second wrap or note “compose with ATL”; PR after issue | Low–med (they have competing audit product — pitch as complementary trust-before-spend, not audit replacement) |
| **P0** | [routexcc/x402-agent-starter](https://github.com/routexcc/x402-agent-starter) | MIT starter; agent pays via Routex; clear `agent.ts` | Opt-in `ATL_ENABLED` around paid fetch | Low |
| **P1** | [daydreamsai/lucid-agents](https://github.com/daydreamsai/lucid-agents) | Commerce SDK / templates; x402 among rails | Tiny adapter example in templates, not core rewrite | Med (larger surface) |
| **P1** | [google-agentic-commerce/a2a-x402](https://github.com/google-agentic-commerce/a2a-x402) | A2A × x402 extension — high visibility | Example only / docs link first; PR to examples if welcome | Med–high (process-heavy) |
| **P2** | [coinbase/x402](https://github.com/coinbase/x402) `examples/` | Official examples | Add optional ATL note in one typescript example — ask first | High (noise sensitivity) |
| **Avoid first** | LangChain / CrewAI / Autogen **core** | Politics + latency fears | Wait until 1–2 starter merges exist | — |

## First campaign (this week)

1. Use **this repo** as the demo link in every issue/PR.  
2. Open **one** issue on **routexcc/x402-agent-starter** (clean MIT, no competing “trust” brand).  
3. If friendly or silent 5 days → open the optional PR.  
4. Only then touch valeo (position ATL as pre-spend trust; Sentinel as post-spend audit).

## Issue / PR templates

See `.github/ISSUE_TEMPLATE.md` and `.github/PULL_REQUEST_TEMPLATE.md` — paste into the **target** repo when filing.
