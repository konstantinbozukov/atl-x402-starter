/**
 * Real x402 pay through withAtl against live Edge Signals /v1/gas.
 * Requires funded Base USDC wallet in X402_BUYER_PRIVATE_KEY.
 */
import "dotenv/config";
import { x402Client, wrapFetchWithPayment, x402HTTPClient } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";
import { createAtlClient, createJsonlLedger, withAtl } from "agent-trust-layer";

async function main() {
  const pk = process.env.X402_BUYER_PRIVATE_KEY?.trim();
  if (!pk?.startsWith("0x")) {
    throw new Error("Set X402_BUYER_PRIVATE_KEY in .env");
  }

  const account = privateKeyToAccount(pk as `0x${string}`);
  const seller = (
    process.env.SELLER_BASE ?? "https://signals.edge.report"
  ).replace(/\/$/, "");
  const payTo =
    process.env.X402_PAY_TO ?? "0xE2520f1497ee47645072a6214304807BC3340D58";
  const sku = "/v1/gas";

  const x402 = new x402Client().register("eip155:*", new ExactEvmScheme(account));
  const fetchPaid = wrapFetchWithPayment(fetch, x402);
  const atl = createAtlClient({
    ledger: createJsonlLedger("./atl-ledger.jsonl"),
  });

  const { response, body, consult, settlementPromise } = await withAtl(
    fetchPaid,
    `${seller}${sku}`,
    {
      client: atl,
      agentId: account.address,
      seller,
      sku,
      amountUsd: 0.001,
      payTo,
    }
  );

  console.log("consult:", consult);
  console.log(`HTTP ${response.status}`);
  console.log(JSON.stringify(body, null, 2).slice(0, 800));
  try {
    console.log(
      "PAYMENT-RESPONSE:",
      new x402HTTPClient(x402).getPaymentSettleResponse((n) =>
        response.headers.get(n)
      )
    );
  } catch {
    /* optional */
  }
  console.log("ATL settlement:", await settlementPromise);
  if (!response.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
