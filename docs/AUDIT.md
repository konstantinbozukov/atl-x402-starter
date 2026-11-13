# Repository audit — atl-x402-starter

Audited 2026-11-13 for Konstantin Bozukov. Documentation only. No application code, config, dependencies, CI, or infrastructure was changed. Commands were run on Node `v22.23.4`, npm `10.9.9`, Python `3.12.3`. Commit at audit time: `bd4e0d0` (branch `master`). All five commits are dated 2026-08-27.

## Summary

`atl-x402-starter` is a private, local Node demo and outreach kit for Agent Trust Layer on an x402 paid fetch. It is a **prototype**. The x402 seller at `https://signals.edge.report` still answers `GET /v1/gas` with HTTP 402, and the vendored library still produces a local consult, but the ATL surface the README, `DEMO.md`, and `docs/PIONEERS.md` describe (soft headers, `/v1/atl/consult`, health, pioneers, free credits) returned 404 or no headers on the audit date. There is no test suite, no CI, and no deploy path in this repo. Five commits from a single day, a missing script that the docs already tell you to run, and a live demo that crashes, are the maturity evidence.

## Stack and hosting

- **This repo:** Node `>=20`, ESM, TypeScript executed by `tsx` 4.23.12 (no `tsconfig.json`). Dependencies: `@x402/evm` 2.23.0, `@x402/fetch` 2.23.0, `viem` 2.56.0, `dotenv` 17.4.2, `tsx`, and `agent-trust-layer` 0.1.1 from `vendor/agent-trust-layer-0.1.1.tgz`. Transitive `@x402/core` 2.23.0 and `zod` 3.25.76. Python 3 is used only by `scripts/make-demo-gif.py`.
- **Hosting of this repo:** none. No Dockerfile, `vercel.json`, serverless config, or GitHub Actions. `package.json` is `"private": true`.
- **Seller it calls:** `https://signals.edge.report`. Response headers on `GET /v1/gas` were `X-Powered-By: Express` and `Via: 1.1 Caddy`, plus `X-Ratelimit-Limit: 100`. TODO: confirm with Konstantin which host runs that process. It is not defined in this repository.
- **Chain, only when paying:** the live `Payment-Required` challenge was x402 version 2, scheme `exact`, network `eip155:8453` (Base), asset name "USD Coin", asset `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`, amount `"1000"`. The starter's matching constant is `amountUsd: 0.001`. The challenge `payTo` matched the default payee in `src/pay-with-atl.ts` and `.env.example`.

The npm package named `agent-trust-layer` is not this code. Registry latest on the audit date was `0.1.0` from `github.com/kauf3r/agent-trust-layer` ("Security and governance framework for AI agent operations"). The tarball's `package.json` points at `github.com/konstantinbozukov/agent-trust-layer`, directory `packages/core`, version `0.1.1`.

## Deploy path

There is nothing to deploy from this repository. A person clones it, runs `npm install`, and executes a script. The scripts call the seller over HTTPS. `npm run pay` additionally signs an x402 payment with a Base account.

How the seller itself is deployed is not in this repo. TODO: confirm with Konstantin.

## Environment variable names

Values are omitted on purpose. No secret values were printed while auditing.

| Name | Where it is read |
|---|---|
| `X402_BUYER_PRIVATE_KEY` | `src/pay-with-atl.ts` |
| `X402_PAY_TO` | `src/pay-with-atl.ts`, `src/demo.ts` |
| `SELLER_BASE` | `src/demo-headers.ts`, `src/demo.ts`, `src/drop-in.ts`, `src/pay-with-atl.ts` |
| `ATL_AGENT_ID` | `src/drop-in.ts` |

`.env.example` lists the first three. `ATL_AGENT_ID` is code-only. `.env` and `.env.local` are gitignored and were not present. Only `src/pay-with-atl.ts` loads `dotenv/config`, so a `.env` file is invisible to the other three scripts.

## Test coverage and what was run

Coverage is **none**. There are no `*.test` / `*.spec` files, no test runner, and no `.github/workflows`.

| Command | Result |
|---|---|
| `npm ci` | Exit 0. Added 22 packages, audited 23. Reported 4 high severity vulnerabilities. |
| `npm test` | Exit 1. `Missing script: "test"`. |
| `npm run demo:headers` | Exit 1. See output below. |
| `npm run demo` | Exit 0. Local consult `verdict: allow`, `score: 50`, `reasons: ["unknown_agent"]`, protocol `atl` `0.1.0`. Then `HTTP 402`, `X-ATL-Verdict: null`, `X-ATL-Score: null`. No `atl-ledger.jsonl` written (settlement runs only when `response.ok`). |
| `npm run outreach:check` | Exit 1. `ERR_MODULE_NOT_FOUND` for `/workspace/scripts/outreach-check.ts`. `git log -- scripts/outreach-check.ts` is empty. |
| `python3 scripts/make-demo-gif.py` | Exit 1. `ModuleNotFoundError: No module named 'PIL'` at `scripts/make-demo-gif.py:8`. |
| `npm outdated` | `@x402/evm` and `@x402/fetch` 2.23.0 → 2.31.0; `viem` 2.56.0 → 2.57.19; `tsx` 4.23.12 → 4.23.15; `dotenv` 17.4.2 (latest major 18.0.10, wanted stays 17.4.2 because of `^17`). |
| `npm audit` | 4 high. All are GHSA-mrhx-c7xc-m3w5 ("Zod can exhaust memory while validating oversized constrained collections"), range `zod <4.6.6`. `@x402/core` 2.0.0–2.28.0, `@x402/evm` 2.0.0–2.28.0, `@x402/fetch` 2.3.0–2.28.0 depend on that `zod`. Installed `zod` is 3.25.76. |
| `npm audit fix --dry-run` | Proposed `zod` 3.25.76 → 4.6.7, `@x402/evm` / `@x402/fetch` / `@x402/core` 2.23.0 → 2.31.0. The command's summary still listed the same 4 high findings. The fix was **not** applied. TODO: confirm with Konstantin that a lockfile bump actually clears the advisory. `zod` 3 → 4 is a major bump. |
| `npm run pay` | Not run. It spends Base USDC. |
| `npm run drop-in` | Not run. It calls the pioneer endpoints and, on a synthetic HTTP 200, appends a settlement to `atl-ledger.jsonl`. |

`npm run demo:headers` output (abridged only by the thrown stack's Node internals):

```
Seller: https://signals.edge.report
Expect: without header = no X-ATL-*; with header = verdict/score even on 402.

=== A) No X-ATL-Agent-Id (discovery agent / default) ===
HTTP 402
ATL response headers: { 'X-ATL-Consult-Id': null, 'X-ATL-Verdict': null, 'X-ATL-Score': null }
→ zero ATL work (no headers)

=== B) With X-ATL-Agent-Id (ATL-aware agent) ===
HTTP 402
ATL response headers: { 'X-ATL-Consult-Id': null, 'X-ATL-Verdict': null, 'X-ATL-Score': null }
→ zero ATL work (no headers)
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
    at async main (src/demo-headers.ts:52:19)
```

Separate status checks the same day (no bodies stored):

| Request | Status | ATL headers | Body |
|---|---|---|---|
| `GET /v1/gas` | 402 | none | `{}` JSON |
| `GET /v1/gas` with `X-ATL-Agent-Id` and `X-ATL-Amount-Usd` | 402 | none | `{}` JSON |
| `GET /v1/token-risk?...` with `X-ATL-Agent-Id` | 402 | none | `{}` JSON |
| `GET /v1/atl/health` | 404 | none | HTML `Cannot GET /v1/atl/health` |
| `GET /v1/atl/pioneers` | 404 | none | HTML `Cannot GET /v1/atl/pioneers` |
| `GET /v1/atl/free/gas` with an agent id | 404 | none | HTML `Cannot GET /v1/atl/free/gas` |
| `POST /v1/atl/consult` | 404 | none | HTML `Cannot POST /v1/atl/consult` |

Call A matches `DEMO.md`. Call B and call C do not. `DEMO.md` expects call B to carry `X-ATL-Verdict: allow` and `X-ATL-Score: 50`, and call C to return JSON with `protocol: atl`.

## Bugs and likely bugs

Verified by running the script:

1. `src/demo-headers.ts:52` calls `consultRes.json()` with no status or content-type check. On the live 404 HTML it throws, so the explicit `FAIL` branch at `src/demo-headers.ts:61-62` never runs. Exit code is 1 either way, and the message is a `SyntaxError` instead of `FAIL: unexpected header/consult behavior.`
2. `src/demo-headers.ts:37-40` and the PASS condition at `src/demo-headers.ts:57` require ATL headers when `X-ATL-Agent-Id` is set. The live seller returned none. The demo's own contract is currently false.
3. `src/demo.ts:44-50` treats any non-OK response as the expected 402 and then exits 0. Verified: missing ATL headers still produce exit 0. A green `npm run demo` does not mean the seller is speaking ATL.

Verified by reading, and consistent with the 404s above. `drop-in` was not executed.

4. `src/drop-in.ts:99-100` calls `board.json()` with no `.catch`. `GET /v1/atl/pioneers` is HTML 404, so this should throw the same way `demo-headers.ts:52` does. The free-credit parse at `src/drop-in.ts:33` does use `.catch`.
5. `src/drop-in.ts:80-97` comments "Touch consult so local ledger has activity" and then calls `withAtl` with a fake HTTP 200. In the tarball, `package/src/withAtl.ts:97-98` records a settlement whenever `response.ok`, and if the body has no tx hash it stores `` `pending-${Date.now()}` ``. That appends a paid-looking row (amount `0`, payee the zero address, sku `/v1/atl/health`) to `atl-ledger.jsonl`. The stub policy in `package/src/policy.ts` adds 10 points per settlement, so the next local consult for that agent id scores 60 with reason `history_positive` instead of 50 / `unknown_agent`.
6. `package.json` script `outreach:check` and `OUTREACH.md` ("Backup poll: `npm run outreach:check`") point at a file that was never committed.

Env footgun, verified by reading imports:

7. `src/demo-headers.ts:9`, `src/demo.ts:10` and `src/demo.ts:14`, and `src/drop-in.ts:16` and `src/drop-in.ts:20` read `SELLER_BASE`, `X402_PAY_TO`, and `ATL_AGENT_ID`, but only `src/pay-with-atl.ts:4` imports `dotenv/config`. Copying `.env.example` to `.env` does not change `demo`, `demo:headers`, or `drop-in`.

Docs / tooling:

8. `DEMO.md:16` links `./demo-headers.gif`. The file is `docs/demo-headers.gif`. `README.md` links the docs path, so the README image resolves and the DEMO.md image does not.
9. `DEMO.md:21` regenerates the transcript with PowerShell `Out-File`. The npm script `demo:gif` uses shell `>`. On Linux the documented manual command is the wrong shell.
10. `scripts/make-demo-gif.py:27-35` loads fonts only from `C:\Windows\Fonts`. Elsewhere it falls back to Pillow's default font. Pillow itself is undeclared, so the script does not start on a machine without a global install.

Likely, from the vendored source plus `@x402/core` (not executed, because that requires a funded key):

11. `package/src/withAtl.ts` inside `vendor/agent-trust-layer-0.1.1.tgz` (`parseTxHash`) accepts `x-payment-response` only when the header value itself matches `0x` plus 64 hex characters. `@x402/core` `encodePaymentResponseHeader` base64-encodes a JSON settlement (`node_modules/@x402/core/dist/cjs/http/index.js`, `encodePaymentResponseHeader`). Header lookup is case-insensitive, so the name `PAYMENT-RESPONSE` is seen, and the base64 value fails the regex. The ledger row then gets `pending-<timestamp>` unless the JSON body happens to contain `transaction`, `txHash`, or `tx`. `src/pay-with-atl.ts:47-56` decodes that header correctly for the console log and does not pass the decoded transaction into the ledger. A successful pay can be stored locally as a pending hash.
12. `package/src/withAtl.ts` always calls `fetchImpl(url, { method: "GET", headers })` and replaces headers with only `X-ATL-*`. `src/drop-in.ts` describes this as a wrap of "any" paid fetch. A POST payment, or a caller header besides the ATL ones, is dropped. `npm run pay` is a GET (`/v1/gas`), so this matches the one paid script and not the general claim.
13. `src/pay-with-atl.ts:18-41` records `X402_PAY_TO` (or the hardcoded default) into the ledger. The USDC recipient comes from the 402 challenge inside `wrapFetchWithPayment` (`@x402/fetch`), not from that option. Today the default matches the live challenge. If `SELLER_BASE` changes and `X402_PAY_TO` does not, the chain payment and the ledger payee diverge.

## Security risks

Committed secrets: **none found**. Searched the tree and `git` history for a 64-hex `0x` private key and for common token prefixes (`AKIA`, `ghp_`, `sk_live`, `xox`, `BEGIN PRIVATE KEY`). No matches. The tarball had none either. `.env.example` contains a placeholder private key (`0x...`, not a key) and a public payee address. Report path only: `.env.example`. That payee is also hardcoded in `src/pay-with-atl.ts` and `src/demo.ts` and matched the live 402 `payTo`. It is a receiving address, not a signing key.

Risks that are real:

- **`npm run pay` spends money.** `src/pay-with-atl.ts:12-15` only checks that the key starts with `0x`. There is no confirm step, no max amount beyond the hardcoded `0.001`, and no check that the 402 payee is the one in `X402_PAY_TO`. The key lives in `.env`, which is gitignored. One accidental commit of `.env` is a Base USDC key compromise.
- **High npm advisory in the payment parser.** `zod` 3.25.76 (via `@x402/*` 2.23.0) is inside GHSA-mrhx-c7xc-m3w5. The buyer uses that stack to parse a seller's payment requirements. A hostile `SELLER_BASE` is the realistic trigger. This repo does not validate the seller URL.
- **Forged local reputation.** Item 5 above writes a settlement for a request that never paid. Anything that trusts `atl-ledger.jsonl` or the stub score will treat it as history.
- **Likely missing real tx hash** in that same ledger (item 11). A ledger used as a trust input would not be tied to the chain.
- **Public demo agent id** `0xf8E55aAA8F2f41B0D7cC2c6502C1311cb1342a39` is hardcoded in `src/demo-headers.ts:11` and sent to the seller on every header demo. It is an address, not a key. TODO: confirm with Konstantin that this address is an intentional public demo id.
- **Seller header disclosure** (`X-Powered-By: Express`) is on the other service, not in this codebase.

`npm run drop-in` was not run. A read-only probe of `GET /v1/atl/free/gas` returned 404, so no free credit was issued.

## Dependency and staleness issues

The lockfile is from 2026-08-27. On 2026-11-13 the direct packages are behind current releases by the amounts in the table above. The meaningful gap is `@x402/*` 2.23.0 versus 2.31.0, because 2.23.0 is inside the advisory range (through 2.28.0) and 2.31.0 is outside it. Whether that upgrade pulls a patched `zod` was not proven: the dry-run still printed the advisory.

`dotenv` 18.0.10 is a new major. The declared range `^17.4.2` correctly stays on 17.4.2. `tsx` is one patch behind. `viem` is a minor behind (2.56.0 vs 2.57.19). `@x402/evm` also depends on its own `viem` range, so a bump should be done in one lockfile update and then `npm run pay` re-checked by Konstantin, not by an unattended agent.

`agent-trust-layer` is pinned to a git-unfriendly binary tarball rather than a commit of `konstantinbozukov/agent-trust-layer`. The public npm name is taken by another author. Installing "the latest agent-trust-layer" will not update this demo, and can swap in the wrong library if the `file:` spec is removed.

`tsx` and `dotenv` are `dependencies`, not `devDependencies`. That matches a repo whose only run path is `tsx` on the source, with no build. Pillow is an undeclared system dependency of `scripts/make-demo-gif.py`.

## Top 5 improvements

Ranked by value to this repo, then by how small the change is.

1. **Make the seller contract fail in words, and run that check somewhere.** `demo:headers` is the proof `TARGETS.md` tells other maintainers to trust, and it currently crashes on HTML. Check status and content-type before `response.json()`, print the explicit FAIL line, and add a CI workflow that runs at least a mocked version of calls A/B/C. A live job can be scheduled separately so a 404 cannot sit from August to November again. Value is high because the outreach kit's claim is false today. The assertion is a small edit. The seller fix, if ATL was removed on purpose, is outside this repo.
2. **Add local tests around `withAtl` and the JSONL ledger.** No network required: unknown agent scores 50; HTTP 402 writes nothing; HTTP 200 writes one row; a second consult sees the new score. This locks the behavior `npm run demo` already demonstrated, including the forged-settlement case. Small, and it is the first test script this package would have.
3. **Upgrade `@x402/evm`, `@x402/fetch`, and `@x402/core` off 2.23.0 and re-audit.** Target the 2.31.0 line the dry-run proposed, then confirm GHSA-mrhx-c7xc-m3w5 is gone before accepting a `zod` 4 major. Do this together with one real or mocked payment parse so `wrapFetchWithPayment` still accepts the Edge Signals challenge. Medium effort only because the major `zod` bump needs a compatibility check.
4. **Stop writing fake settlements, and store the real tx hash.** Remove or narrow the synthetic `withAtl` call in `src/drop-in.ts:80-97`. In the vendored `withAtl`, decode `PAYMENT-RESPONSE` the way `x402HTTPClient.getPaymentSettleResponse` does, and skip `recordSettlement` when the only hash available is `pending-*`. High value for any score that is supposed to mean "this agent has paid." The drop-in edit is small. The tarball change means cutting a new `agent-trust-layer` build.
5. **Repair the outreach and demo tooling so the docs match the tree.** Either add `scripts/outreach-check.ts` or delete the `outreach:check` script and the poll section in `OUTREACH.md`. Point `DEMO.md:16` at `docs/demo-headers.gif`. Declare Pillow (or stop importing it) and accept a non-Windows font path in `scripts/make-demo-gif.py`. Load `dotenv/config` in the three scripts that already read env vars, or stop documenting `.env` as if it applied to them. All of this is small, and each item is a trap the current docs set.

## Open questions for the owner

1. Were `/v1/atl/health`, `/v1/atl/consult`, `/v1/atl/pioneers`, and `/v1/atl/free/*` removed on purpose after 2026-08-27? Is there a new base URL the starter should use?
2. Is soft `X-ATL-*` on HTTP 402 still the seller's behavior for some other path, or is the header demo obsolete?
3. Where is `signals.edge.report` deployed, and who can roll back or confirm the Express routes? This repo cannot answer that.
4. Is `scripts/outreach-check.ts` something to write, or should the poller be dropped? The issue list in `scripts/outreach-issues.json` is still the Wave 1 and Wave 2 set from 2026-08-27.
5. Is the hardcoded demo agent address in `src/demo-headers.ts` a public id you want on every clone's requests?
6. Should `agent-trust-layer` 0.1.1 stay vendored, and under what npm name, given `agent-trust-layer` on the registry is `kauf3r/agent-trust-layer`?
7. Is the GIF pipeline meant to be run on Windows only?
8. Is `amount: "1000"` on the Base USDC challenge still the $0.001 price the scripts send as `amountUsd`?
