# Target repos for optional ATL PRs

**Wave 1 (filed):** wrap-friendly pay clients + starters.  
**Wave 2 (next):** broader **agents pay here** surfaces (wallets, routers, MCP, multi-rail, L402, A2A) - not x402-starter-only.  
**Fit rule:** opt-in, fail-open, default unchanged. No token/escrow/roadmap in issues.  
**Demo:** `atl-x402-starter` + `npm run demo:headers`.

**PR rule:** reply or clearly maintained => optional `feat/optional-atl`. Do not mass-PR silence.

---

## Wave 1 - filed (2026-08-27)

| # | Repo | Issue | Why |
|---|------|-------|-----|
| 1 | [leventilo/boltzpay](https://github.com/leventilo/boltzpay) | [#164](https://github.com/leventilo/boltzpay/issues/164) | Paying `agent.fetch()` product |
| 2 | [parallel-protocol/parallel-x402-agent-starter](https://github.com/parallel-protocol/parallel-x402-agent-starter) | [#2](https://github.com/parallel-protocol/parallel-x402-agent-starter/issues/2) | Fresh org wrap-fetch starter |
| 3 | [tevfikefeaydin/x402-agent-starter](https://github.com/tevfikefeaydin/x402-agent-starter) | [#1](https://github.com/tevfikefeaydin/x402-agent-starter/issues/1) | Smallest useful buyer |
| 4 | [mariano-aguero/arbitrum-agent-payments](https://github.com/mariano-aguero/arbitrum-agent-payments) | [#1](https://github.com/mariano-aguero/arbitrum-agent-payments/issues/1) | Claude paying tools kit |
| 5 | [Br0ski777/x402-trading-agent-starter](https://github.com/Br0ski777/x402-trading-agent-starter) | [#2](https://github.com/Br0ski777/x402-trading-agent-starter/issues/2) | Multi paid-API agent |
| 6 | [kzmttkc/vet402-agent-template](https://github.com/kzmttkc/vet402-agent-template) | [#1](https://github.com/kzmttkc/vet402-agent-template/issues/1) | Compose with fail-closed gate |
| 7 | [valeo-cash/x402-agent-starter](https://github.com/valeo-cash/x402-agent-starter) | [#1](https://github.com/valeo-cash/x402-agent-starter/issues/1) | Complement Sentinel audit wrap |
| 8 | [Omnivalent/x402-agent-pay](https://github.com/Omnivalent/x402-agent-pay) | [#1](https://github.com/Omnivalent/x402-agent-pay/issues/1) | Policy pay client / skill |
| 9 | [nirholas/x402-approval-page](https://github.com/nirholas/x402-approval-page) | [#1](https://github.com/nirholas/x402-approval-page/issues/1) | Spend-cap HITL path |
| 10 | [daydreamsai/lucid-agents](https://github.com/daydreamsai/lucid-agents) | [#1713](https://github.com/daydreamsai/lucid-agents/issues/1713) | Example/adapter only (reach) |

### Earlier / parked

| Repo | Note |
|------|------|
| [routexcc/x402-agent-starter](https://github.com/routexcc/x402-agent-starter/issues/1) | Filed; **low signal** (ghost repo). Do not wait. |

---

## Wave 2 - next 10 (agents pay here)

Not starter-name cargo cult. These are places agents **actually spend** (wallet agents, routers, MCP, multi-rail CLIs, L402, A2A). Ask = optional consult hook / example — still fail-open, no roadmap.

| # | Repo | Stars / push | Why good for ATL |
|---|------|--------------|------------------|
| 1 | [BlockRunAI/Franklin](https://github.com/BlockRunAI/Franklin) | ~550 · active | Agent **with a wallet** that spends USDC to do work - consult belongs at spend. |
| 2 | [BlockRunAI/ClawRouter](https://github.com/BlockRunAI/ClawRouter) | ~6.5k · active | Agent-native LLM router; every model call can be a paid hop - high density if optional hook lands. |
| 3 | [BlockRunAI/blockrun-mcp](https://github.com/BlockRunAI/blockrun-mcp) | ~390 · active | **MCP pay-per-call** data tools - spend happens at tool invoke, not only HTTP starter fetch. |
| 4 | [solana-foundation/pay](https://github.com/solana-foundation/pay) | ~1.7k · active | CLI for **x402 + MPP + AP2** - multi-rail pay surface; adapter/example is the ask. |
| 5 | [qntx/openai-python](https://github.com/qntx/openai-python) | ~260 · active | Drop-in OpenAI client with transparent payments - wrap sits on the client agents already use. |
| 6 | [nikoSchoinas/routeweiler-python-sdk](https://github.com/nikoSchoinas/routeweiler-python-sdk) | ~31 | HTTP client that intercepts 402 across **x402 / L402 / MPP** + budgets - rail-agnostic ATL home. |
| 7 | [lightninglabs/lightning-agent-tools](https://github.com/lightninglabs/lightning-agent-tools) | ~58 · active | Agent toolkit for **L402** pay-for-API - proves ATL beyond Base/USDC dialect. |
| 8 | [apify/mcpc](https://github.com/apify/mcpc) | ~755 · active | Universal MCP CLI with x402 among features - agents pay through tooling they already run. |
| 9 | [google-agentic-commerce/a2a-x402](https://github.com/google-agentic-commerce/a2a-x402) | ~554 · active | A2A agents monetize via payments - **examples/docs only**, not core politics. |
| 10 | [vercel-labs/x402-ai-starter](https://github.com/vercel-labs/x402-ai-starter) | ~71 / 28 forks | Widely cloned AI+x402 app; optional example path after Wave 1 signal (heavier surface). |

### Wave 2 alternates (if issues disabled / hostile)

| Repo | Why |
|------|-----|
| [daydreamsai/daydreams](https://github.com/daydreamsai/daydreams) | Parent commerce framework for Lucid |
| [Fewsats/amazon-mcp](https://github.com/Fewsats/amazon-mcp) | MCP buy via L402 |
| [lightninglabs/LangChainBitcoin](https://github.com/lightninglabs/LangChainBitcoin) | LangChain + L402 pay path |

### Avoid / careful

| Repo | Why |
|------|-----|
| [internet-court/internet-court-skill](https://github.com/internet-court/internet-court-skill) | Competing “trust + escrow + dispute” skill - do not spam as ATL ask |
| `coinbase/x402` / `x402-foundation/x402` **core** | Noise sensitivity; examples only after density |
| LangChain / CrewAI **core** | Wait for Wave 1–2 merges |

---

## Issue / PR templates

See `.github/ISSUE_TEMPLATE.md` and `.github/PULL_REQUEST_TEMPLATE.md`. ASCII punctuation. No roadmap language.
