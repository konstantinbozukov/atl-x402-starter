# AGENTS.md

Rules for any Cursor agent working in `atl-x402-starter` (https://github.com/konstantinbozukov/atl-x402-starter). Owner: Konstantin Bozukov.

This file is guidance only. It does not change runtime behavior.

## What this project is

A small **local demo and outreach kit** for [Agent Trust Layer (ATL)](https://github.com/konstantinbozukov/agent-trust-layer) on an x402 paid fetch. It is not a hosted application. Scripts show:

- a live seller call **without** `X-ATL-Agent-Id` (expect no ATL response headers)
- the same call **with** the header (expect soft `X-ATL-Verdict` / `X-ATL-Score` even on HTTP 402)
- a free `POST /v1/atl/consult`
- an optional real Base USDC payment through `withAtl`
- a drop-in snippet plus a free pioneer credit
- a checklist of GitHub issues filed against other x402 repos (`TARGETS.md`, `OUTREACH.md`)

The protocol implementation is the vendored tarball `vendor/agent-trust-layer-0.1.1.tgz` (`agent-trust-layer` 0.1.1, repository `konstantinbozukov/agent-trust-layer`, directory `packages/core`). Consults in `withAtl` are **local** (stub policy + JSONL ledger). The live seller is separate.

As of the 2026-11-13 audit, the documented seller no longer serves the ATL routes. Read `docs/AUDIT.md` before treating `npm run demo:headers` as a passing proof.

## Stack

- Node.js `>=20` (verified with Node `v22.23.4`, npm `10.9.9`). `"type": "module"`.
- TypeScript sources, executed by `tsx`. There is no `tsconfig.json`, no compile step, and no typecheck script.
- Runtime dependencies in `package.json`: `@x402/evm`, `@x402/fetch`, `viem`, `dotenv`, `tsx`, and `agent-trust-layer` via `file:./vendor/agent-trust-layer-0.1.1.tgz`.
- One Python helper, `scripts/make-demo-gif.py`, imports Pillow. Pillow is not declared in this repo.
- Package is `"private": true` and `"version": "0.1.0"`. License: MIT.

## Folder layout

| Path | Role |
|---|---|
| `src/demo-headers.ts` | No-wallet live header demo. Exits 0 only on its PASS check. |
| `src/demo.ts` | Local `withAtl` consult against `GET /v1/gas`. Does not assert headers. |
| `src/drop-in.ts` | Free pioneer credit, soft headers, copy-paste snippet, local ledger touch. |
| `src/pay-with-atl.ts` | Real x402 pay. Requires `X402_BUYER_PRIVATE_KEY`. |
| `vendor/agent-trust-layer-0.1.1.tgz` | Vendored ATL core (`withAtl`, stub policy, JSONL ledger). |
| `scripts/make-demo-gif.py` | Builds `docs/demo-headers.gif` from a transcript. |
| `scripts/outreach-issues.json` | GitHub issue numbers for `outreach:check`. |
| `docs/PIONEERS.md` | Free-credit and pioneer-board curls. |
| `docs/demo-headers.gif` | Checked-in capture of a previous `demo:headers` run. |
| `DEMO.md` | Maintainer script and expected output. |
| `TARGETS.md`, `OUTREACH.md` | Where issues were filed and how to follow up. |
| `.github/ISSUE_TEMPLATE.md`, `.github/PULL_REQUEST_TEMPLATE.md` | Copy for issues and PRs opened on **other** repos. |
| `.env.example` | Variable names for the optional paid run. |

`scripts/outreach-check.ts` is referenced by `package.json` and `OUTREACH.md` and is **not in the tree**. It has no git history.

## Install, run, test, lint, build

Commands below were run from a clean tree on 2026-11-13, except `pay` and `drop-in` (see Never touch).

Install (lockfile install succeeded, 22 packages added):

```bash
npm ci
```

`npm install` is what the README tells a cloner to run. `npm ci` matches `package-lock.json`.

Run:

```bash
npm run demo:headers   # tsx src/demo-headers.ts — live seller, no wallet
npm run demo           # tsx src/demo.ts — local consult + live GET /v1/gas
npm run drop-in        # tsx src/drop-in.ts — pioneer credit + snippet
npm run pay            # tsx src/pay-with-atl.ts — spends Base USDC
npm run demo:gif       # demo:headers transcript, then python scripts/make-demo-gif.py
npm run outreach:check # tsx scripts/outreach-check.ts — file is missing
```

On 2026-11-13:

- `npm run demo:headers` exited **1**. Calls A and B were HTTP 402 with no `X-ATL-*` headers. `POST /v1/atl/consult` returned HTML, and `src/demo-headers.ts:52` threw `SyntaxError: Unexpected token '<'`.
- `npm run demo` exited **0**. Local consult was `allow` / score `50` / reason `unknown_agent`. Live response was HTTP 402 with null ATL headers. No `atl-ledger.jsonl` was created.
- `npm run outreach:check` exited **1** with `ERR_MODULE_NOT_FOUND` for `scripts/outreach-check.ts`.
- `python3 scripts/make-demo-gif.py` exited **1** with `ModuleNotFoundError: No module named 'PIL'` (Python 3.12.3).

Test: there is no test script and no test files.

```bash
npm test
```

exits **1** with `Missing script: "test"`. There is no GitHub Actions workflow.

Lint: no ESLint, Prettier, or `lint` script.

Build: no `build` script and no `tsc` config. `tsx` runs the TypeScript directly.

Do not run `npm run pay` to "see if it works." It pays a live x402 challenge with a real key.

## Deploy

This repository has no deploy target and no deploy config. There is no Dockerfile, `vercel.json`, `fly.toml`, serverless config, or `.github/workflows`. Nothing is published (`private: true`).

What exists in production is the **seller this client calls**, default `https://signals.edge.report`. This repo does not contain that service. Observed on 2026-11-13: `GET /v1/gas` is HTTP 402 from Express behind Caddy (`X-Powered-By: Express`, `Via: 1.1 Caddy`), x402 version 2, scheme `exact`, network `eip155:8453` (Base), asset named USD Coin. The challenge `payTo` matched the default in `src/pay-with-atl.ts` and `.env.example`. Amount on the challenge was `"1000"`; the starter labels the same SKU as `amountUsd: 0.001`. TODO: confirm with Konstantin that those are the same price and where the Express app is hosted.

`/v1/atl/health`, `/v1/atl/pioneers`, `/v1/atl/free/gas`, and `POST /v1/atl/consult` returned **404** HTML (`Cannot GET` / `Cannot POST`) on that date. README, `DEMO.md`, and `docs/PIONEERS.md` still describe them as live.

## External services

- **Edge Signals** at `https://signals.edge.report` — live x402 seller. Override with `SELLER_BASE` only in processes that actually load it (see conventions).
- **Base (eip155:8453) USDC** via `@x402/evm` + `viem`, only in `npm run pay`. The 402 asset was the Base USDC contract `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` (also the sample address in `src/drop-in.ts`).
- **GitHub** — outreach targets in `TARGETS.md` and `scripts/outreach-issues.json`. The poller script is missing.
- **npm registry** — direct dependencies. The registry package named `agent-trust-layer` is a **different** project (`kauf3r/agent-trust-layer` 0.1.0, description about trust gates and eval harnesses). Do not `npm install agent-trust-layer` as a substitute for the vendored tarball.

No Supabase, Vercel project, or AWS config is in this repo.

## Environment variable names

Names only. Never print or commit values.

| Name | Read by | In `.env.example` |
|---|---|---|
| `X402_BUYER_PRIVATE_KEY` | `src/pay-with-atl.ts` | yes (placeholder) |
| `X402_PAY_TO` | `src/pay-with-atl.ts`, `src/demo.ts` | yes |
| `SELLER_BASE` | all four `src/*.ts` entrypoints | yes |
| `ATL_AGENT_ID` | `src/drop-in.ts` only | no |

Only `src/pay-with-atl.ts` imports `dotenv/config`. A `.env` file does nothing for `demo`, `demo:headers`, or `drop-in` unless the shell already exported the variables.

## Coding conventions

Inferred from `src/` and the vendored package, not from a formatter config:

- ESM TypeScript, run with `tsx`. Semicolons, double quotes, two-space indent.
- Each entrypoint is `async function main()` and ends with `main().catch(...)` then `process.exit(1)`.
- Module-level constants for the seller, agent id, and payee. Seller URLs are trimmed of a trailing slash.
- Env access is `process.env.NAME ?? "default"` or a trim plus a thrown error for the buyer key.
- `withAtl` from the vendored package is the integration point. Default consult is on. Default settlement is async. The helper always sends `GET` with only the `X-ATL-*` headers (`package/src/withAtl.ts` inside the tarball, around the `fetchImpl` call).
- Local ledger path is `./atl-ledger.jsonl` (gitignored).
- Outreach text is ASCII. `OUTREACH.md` says to keep issue and PR text that way. Do not add roadmap or token language to those templates.
- Comments state intent above the script. There is no shared library inside this repo; `src/` are scripts, not a published API.

## Never touch

- `.env`, `.env.local`, and any real `X402_BUYER_PRIVATE_KEY`. `.gitignore` already ignores `.env` and `.env.local`. Do not commit them. Do not print the key.
- `atl-ledger.jsonl`. It is local trust history. Gitignored.
- Production seller data: pioneer board, free credits, and paid settlements on `signals.edge.report`. Do not run `npm run drop-in` or `npm run pay` as a casual check.
- `vendor/agent-trust-layer-0.1.1.tgz` unless Konstantin asked to bump ATL. A registry install of the same name is a different package.
- `scripts/outreach-issues.json` unless an outreach issue was actually opened or closed.
- `docs/demo-headers.gif` unless regenerating the capture on purpose.
- There are no database migrations, store configs, or deploy configs. Do not add them as part of a docs or drive-by change.
- Do not "fix" the live 404s by rewriting README expectations unless Konstantin confirms the seller change. The 2026-11-13 behavior is recorded in `docs/AUDIT.md`.

## TODO: confirm with Konstantin

- Whether `/v1/atl/*` was removed on purpose, and what the replacement base URL is.
- Where `signals.edge.report` is deployed (Express behind Caddy is observed; the provider is not in this repo).
- Whether `scripts/outreach-check.ts` was never written or was left out of the initial commit.
- Whether the GIF helper is intentionally Windows-only (font paths under `C:\Windows\Fonts`, and the PowerShell `Out-File` example in `DEMO.md`).
