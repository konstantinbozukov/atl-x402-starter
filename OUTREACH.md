# First outreach checklist

## Before filing

- [ ] `npm run demo:headers` passes locally
- [ ] README + DEMO.md match live seller behavior
- [ ] TARGETS.md: pick **one** P0 repo (prefer routexcc first)

## Issue (day 0)

1. Open issue using `.github/ISSUE_TEMPLATE.md` text.
2. Title: `Optional ATL trust headers on x402 fetch (fail-open)?`
3. Link `atl-x402-starter` + `demo:headers`.
4. Do **not** spam Discord the same day.

## Wait

- Reply within ~5 days → refine and open PR.
- No reply → still OK to open one small PR once; then stop.

## PR (if proceeding)

1. Fork target → branch `feat/optional-atl`
2. Minimal wrap; default off
3. Body from `.github/PULL_REQUEST_TEMPLATE.md`
4. Offer to iterate; no “protocol takeover” language

## After merge or close

- Update TARGETS.md with result (merged / closed / asked changes).
- Only then start the next repo.
