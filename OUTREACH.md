# First outreach checklist

## Notifications (do this once — real-time)

Issues you **open** should auto-subscribe you as Participating. Still verify:

1. GitHub → Settings → Notifications  
   - **Participating** email + web = on  
   - Optional: GitHub **mobile app** push for Participating (best for answer-right-away)
2. Do **not** Watch whole target repos (noise). Only stay subscribed to the issues you filed.
3. Backup poll: `npm run outreach:check` (see below)

## Before filing

- [ ] `npm run demo:headers` passes locally
- [ ] README + DEMO.md match live seller behavior
- [ ] TARGETS.md: use the **Wave 1 / Wave 2** lists

## Issues (batch OK)

1. Open issues using `.github/ISSUE_TEMPLATE.md` text (ASCII punctuation).
2. Title: `Optional ATL trust headers on x402 fetch (fail-open)?` (adapt per repo)
3. Link `atl-x402-starter` + `demo:headers`.
4. Add the issue to `scripts/outreach-issues.json` so `outreach:check` tracks it.
5. Special pitches: valeo = complementary to Sentinel; vet402 = compose with their allowlist (not replace).

## Track replies

```bash
npm run outreach:check
```

- First run baselines `logs/outreach-state.json`
- Later runs print `!! REPLY` when comment count increases
- Optional: Windows Task Scheduler every 1–2h, or a Cursor `/loop 1h` that runs the check and pings you only on alerts

For **immediate** reply: rely on GitHub email/mobile, not the poller.

## Wait / PR

- Reply → refine and open PR on that repo.
- No reply on a **maintained** repo after ~5 days → one small optional PR is OK.
- No reply on a dead/0-activity repo → skip PR; move on.
- Do not open 10 PRs blind the same day.

## PR (if proceeding)

1. Fork target → branch `feat/optional-atl`
2. Minimal wrap; default off
3. Body from `.github/PULL_REQUEST_TEMPLATE.md`
4. Offer to iterate; no protocol-takeover or roadmap language

## After merge or close

- Update TARGETS.md with result (merged / closed / asked changes).
- Then expand to Wave 2 or bounty channel.
