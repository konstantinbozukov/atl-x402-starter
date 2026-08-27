# First outreach checklist

## Before filing

- [ ] `npm run demo:headers` passes locally
- [ ] README + DEMO.md match live seller behavior
- [ ] TARGETS.md: use the **First 10 asks** list (skip routexcc wait)

## Issues (batch OK)

1. Open issues using `.github/ISSUE_TEMPLATE.md` text (ASCII punctuation).
2. Title: `Optional ATL trust headers on x402 fetch (fail-open)?`
3. Link `atl-x402-starter` + `demo:headers`.
4. File the screened 10 in parallel if desired; do **not** spam Discord the same day.
5. Special pitches: valeo = complementary to Sentinel; vet402 = compose with their allowlist (not replace).

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
- Then expand to Hold/later list or bounty channel.
