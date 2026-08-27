/**
 * Drop-in ATL wrap for any paid fetch — no starter maintainer required.
 *
 *   npm run drop-in
 *
 * Copy the pattern into your agent. Uses free pioneer credit first (no wallet),
 * then shows how withAtl wraps a real pay path.
 */
import {
  createAtlClient,
  createJsonlLedger,
  withAtl,
} from "agent-trust-layer";

const SELLER = (
  process.env.SELLER_BASE ?? "https://signals.edge.report"
).replace(/\/$/, "");

const AGENT =
  process.env.ATL_AGENT_ID?.trim() ||
  `pioneer-${Date.now().toString(36)}`;

async function main() {
  console.log("ATL drop-in demo");
  console.log(`Seller: ${SELLER}`);
  console.log(`Agent:  ${AGENT}\n`);

  // 1) Free pioneer credit (non-cash incentive) — no wallet
  const freeUrl = `${SELLER}/v1/atl/free/gas`;
  const freeRes = await fetch(freeUrl, {
    headers: { "X-ATL-Agent-Id": AGENT },
  });
  const freeBody = await freeRes.json().catch(() => ({}));
  console.log("=== Free pioneer GET /v1/atl/free/gas ===");
  console.log(`HTTP ${freeRes.status}`);
  console.log("X-ATL-Free:", freeRes.headers.get("x-atl-free"));
  console.log("X-ATL-Verdict:", freeRes.headers.get("x-atl-verdict"));
  console.log("X-ATL-Score:", freeRes.headers.get("x-atl-score"));
  if (freeRes.status === 200) {
    console.log("pioneer:", (freeBody as { pioneer?: unknown }).pioneer);
  } else {
    console.log(JSON.stringify(freeBody, null, 2));
  }

  // 2) Soft headers on paid path (may 402 without payment — still shows ATL)
  const softRes = await fetch(`${SELLER}/v1/token-risk?address=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&chain=base`, {
    headers: {
      "X-ATL-Agent-Id": AGENT,
      "X-ATL-Amount-Usd": "0.01",
    },
  });
  console.log("\n=== Soft ATL on /v1/token-risk (may be 402) ===");
  console.log(`HTTP ${softRes.status}`);
  console.log("X-ATL-Verdict:", softRes.headers.get("x-atl-verdict"));
  console.log("X-ATL-Score:", softRes.headers.get("x-atl-score"));

  // 3) Local withAtl pattern (settlement after a successful paid call)
  const client = createAtlClient({
    ledger: createJsonlLedger("./atl-ledger.jsonl"),
  });
  console.log("\n=== Drop-in pattern (copy into your agent) ===");
  console.log(`
import { createAtlClient, createJsonlLedger, withAtl } from "agent-trust-layer";

const client = createAtlClient({
  ledger: createJsonlLedger("./atl-ledger.jsonl"),
});

// fetchPaid = your existing x402-aware fetch
const { body } = await withAtl(fetchPaid, url, {
  client,
  agentId: "${AGENT}",
  seller: "${SELLER}",
  sku: "/v1/gas",
  amountUsd: 0.001,
  payTo: "0x...", // seller payTo
});
`);

  // Touch consult so local ledger has activity
  await withAtl(
    async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    `${SELLER}/v1/atl/health`,
    {
      client,
      agentId: AGENT,
      seller: SELLER,
      sku: "/v1/atl/health",
      amountUsd: 0,
      payTo: "0x0000000000000000000000000000000000000000",
      consult: true,
    }
  );

  const board = await fetch(`${SELLER}/v1/atl/pioneers`);
  const pioneers = await board.json();
  console.log("=== Pioneer board ===");
  console.log(`GET ${SELLER}/v1/atl/pioneers`);
  console.log(`count=${(pioneers as { count?: number }).count ?? "?"}`);
  console.log("\nDone. Free credit + soft headers need no maintainer PR.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
