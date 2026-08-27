/**
 * Full path: withAtl (local consult) → print what a paid agent would do.
 * Does NOT require a wallet — uses unpaid header demo + local ledger settle simulation.
 *
 * For a real on-chain pay: npm run pay (needs X402_BUYER_PRIVATE_KEY).
 */
import { createAtlClient, createJsonlLedger, withAtl } from "agent-trust-layer";

const SELLER = (
  process.env.SELLER_BASE ?? "https://signals.edge.report"
).replace(/\/$/, "");
const AGENT = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const PAY_TO =
  process.env.X402_PAY_TO ?? "0xE2520f1497ee47645072a6214304807BC3340D58";

async function main() {
  const client = createAtlClient({
    ledger: createJsonlLedger("./atl-ledger.jsonl"),
  });

  // Unpaid fetch — still shows ATL soft headers from live seller when agent id set.
  // Real agents wrap with wrapFetchWithPayment (see pay-with-atl.ts).
  const { consult, response, settlementPromise } = await withAtl(
    fetch,
    `${SELLER}/v1/gas`,
    {
      client,
      agentId: AGENT,
      seller: SELLER,
      sku: "/v1/gas",
      amountUsd: 0.001,
      payTo: PAY_TO,
      // unpaid will 402 — skip ledger write noise
      consult: true,
      settleAsync: false,
    }
  );

  console.log("local consult:", consult);
  console.log(`HTTP ${response.status}`);
  console.log("response X-ATL-Verdict:", response.headers.get("x-atl-verdict"));
  console.log("response X-ATL-Score:", response.headers.get("x-atl-score"));

  if (response.ok) {
    console.log("settlement:", await settlementPromise);
  } else {
    console.log("(402 expected without payment — settlement skipped on !ok)");
  }

  console.log("\nNext: copy .env.example → .env and run: npm run pay");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
