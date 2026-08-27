/**
 * Demo maintainers can run in 30s — no wallet required.
 * Shows live seller WITH vs WITHOUT X-ATL-Agent-Id.
 *
 *   npm install
 *   npm run demo:headers
 */
const SELLER = (
  process.env.SELLER_BASE ?? "https://signals.edge.report"
).replace(/\/$/, "");
const AGENT = "0xf8E55aAA8F2f41B0D7cC2c6502C1311cb1342a39";

function pickAtl(headers: Headers) {
  return {
    "X-ATL-Consult-Id": headers.get("x-atl-consult-id"),
    "X-ATL-Verdict": headers.get("x-atl-verdict"),
    "X-ATL-Score": headers.get("x-atl-score"),
  };
}

async function hit(label: string, headers?: Record<string, string>) {
  const res = await fetch(`${SELLER}/v1/gas`, { headers });
  const atl = pickAtl(res.headers);
  const hasAtl = Object.values(atl).some((v) => v != null);
  console.log(`\n=== ${label} ===`);
  console.log(`HTTP ${res.status}`);
  console.log("ATL response headers:", atl);
  console.log(hasAtl ? "→ ATL soft path ACTIVE" : "→ zero ATL work (no headers)");
  return { status: res.status, hasAtl, atl };
}

async function main() {
  console.log(`Seller: ${SELLER}`);
  console.log("Expect: without header = no X-ATL-*; with header = verdict/score even on 402.");

  const a = await hit("A) No X-ATL-Agent-Id (discovery agent / default)");
  const b = await hit("B) With X-ATL-Agent-Id (ATL-aware agent)", {
    "X-ATL-Agent-Id": AGENT,
    "X-ATL-Amount-Usd": "0.001",
  });

  const consultRes = await fetch(`${SELLER}/v1/atl/consult`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      agentId: AGENT,
      seller: SELLER,
      sku: "/v1/gas",
      amountUsd: 0.001,
    }),
  });
  const consult = await consultRes.json();
  console.log("\n=== C) Free POST /v1/atl/consult ===");
  console.log(JSON.stringify(consult, null, 2));

  console.log("\n--- verdict ---");
  if (!a.hasAtl && b.hasAtl && consult.protocol === "atl") {
    console.log("PASS: zero-cost without header; soft ATL with header; consult OK.");
    process.exit(0);
  }
  console.error("FAIL: unexpected header/consult behavior.");
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
