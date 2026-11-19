/**
 * Poll outreach issues for new comments. Baselines logs/outreach-state.json on first run.
 *
 *   npm run outreach:check
 *
 * Optional: GITHUB_TOKEN for higher GitHub API rate limits.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ISSUES_PATH = join(ROOT, "scripts", "outreach-issues.json");
const STATE_PATH = join(ROOT, "logs", "outreach-state.json");

type IssueRef = { repo: string; number: number; note?: string };
type IssueState = { comments: number; updatedAt: string };
type State = Record<string, IssueState>;

async function loadState(): Promise<State> {
  try {
    return JSON.parse(await readFile(STATE_PATH, "utf8")) as State;
  } catch {
    return {};
  }
}

async function main() {
  const issues = JSON.parse(await readFile(ISSUES_PATH, "utf8")) as IssueRef[];
  const token = process.env.GITHUB_TOKEN?.trim();
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "atl-x402-starter-outreach-check",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const state = await loadState();
  const next: State = { ...state };
  let alerts = 0;
  const baseline = Object.keys(state).length === 0;

  for (const { repo, number, note } of issues) {
    const key = `${repo}#${number}`;
    const url = `https://api.github.com/repos/${repo}/issues/${number}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const snippet = (await res.text()).slice(0, 120);
      console.error(
        `${key}: HTTP ${res.status} fetching issue${note ? ` (${note})` : ""} — ${snippet}`
      );
      continue;
    }
    const data = (await res.json()) as { comments: number; state: string };
    const prev = state[key]?.comments;
    const cur = data.comments;
    next[key] = { comments: cur, updatedAt: new Date().toISOString() };

    if (prev !== undefined && cur > prev) {
      console.log(`!! REPLY ${key} comments ${prev} → ${cur} (${data.state})`);
      alerts++;
    } else {
      console.log(`${key} comments=${cur} state=${data.state}${note ? ` (${note})` : ""}`);
    }
  }

  await mkdir(dirname(STATE_PATH), { recursive: true });
  await writeFile(STATE_PATH, `${JSON.stringify(next, null, 2)}\n`);

  if (baseline) {
    console.log("\nBaselined logs/outreach-state.json — re-run to detect new replies.");
  } else if (alerts === 0) {
    console.log("\nNo new replies.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});