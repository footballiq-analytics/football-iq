# Analysis V12 data contract

The application works with TFF results without an external evidence feed. It does **not** claim that missing injury, lineup, xG, weather or workload data is known. Current fixture context notes are explanatory; no unvalidated weather/motivation/absence coefficient is applied to scores.

Optional GitHub Actions configuration: variable `ANALYSIS_EVIDENCE_URL` pointing to a normalized HTTPS JSON feed; optional secret `ANALYSIS_EVIDENCE_TOKEN` (Bearer). This is a normalized feed integration, **not** a raw API-Football adapter. No provider or credential is configured by this change. Never put tokens in public JSON or client code.

The publishing script checks season, player IDs against the actual exported catalog, fixture IDs against TFF, numeric bounds, duplicate appearances, source URLs and timestamps. It retains prior evidence on failure. The UI requires recent weekly evidence (72 hours); absence from an injury list is not proof of availability.

JSON schemaVersion 2: `season`, `updatedAt` (ISO with timezone), `players` keyed by catalog ID, `matchStats` keyed by TFF match ID, `fixtures` keyed by TFF match ID, optional `weeklyScores`.

Player fields: `week`, public HTTPS `source`, `verifiedAt`, `availability` (available/unavailable/doubtful/suspended/unknown), optional `startProbability` 0–1, `minutesWhenStarting` 0–90, `rotationRisk`, `injuryRisk`, `riskFlags` string array, `roles` string array, `allCompetitionsComplete` boolean, `nextKickoff`, optional `travelKm`, `home`, `motivationNote` with `motivationSource`. `recentAppearances` contain fixtureId, kickoff, minutes (0–130, include extra time), source, verifiedAt. Include league, cup, continental and international matches, including explicit coverage for players who did not appear. All-competition coverage cannot be inferred from domestic league records alone.

Match statistics: `source`, `availableAt` (when the statistic first became knowable), `homeXg`, `awayXg`. Do not substitute goals for missing xG. Historical stats only enter forecasts if available by the forecast cutoff.

Fixture context: `source`, `verifiedAt`, optional sourced plain-text `lineup`, `absences`, `workload`, `travel`, `weather`, `pitch`, `tactics`, `coachChange`, `motivation`. Unknown notes stay missing. Do not infer motivation from table position.

Weekly scores: `week`, `complete:true`, public `source`, players [{id,points}]. The actual fantasy scoring rules must match the game's scoring rules. These are used for the completed-week team, never as projected points.

## Model and evaluation

Opponent-adjusted attack/defence uses three regularized passes, 0.85 weekly decay, five-game shrinkage, and separate home/away adjustments with a six-game prior. Goal rates use league home/away averages with ten-game priors (1.35/1.15). If sourced historical xG exists, blend 65% xG / 35% goals. These are explicit **heuristic defaults, not fitted or calibrated coefficients**. Poisson predicts a score distribution; UI shows three scores plus outcome, over-2.5, both-score and clean-sheet probabilities.

Backtesting begins after two prior rounds, fits only earlier rounds and excludes known future kickoffs/finishes. It uses results only, never today's player evidence or xG. Compare multiclass Brier sum (range 0–2), log loss, outcome accuracy and exact score accuracy against a same-training-data league-average Poisson baseline. Probability bins report realized frequencies without fitting on test results. Missing historic kickoff timestamps and revised results prevent a claim of a strict historical as-of test. Display this as retrospective round-ordered evaluation, not a live prediction archive. Do not tune these defaults against the displayed test and call it out-of-sample success.

## V12.1 roster recovery

The FotMob roster refresh now handles both dictionary and list table envelopes, validates the provider season and all 18 TFF clubs, accepts both squad envelopes, and writes only complete validated results atomically. Listed injury records carry source and observation timestamp and exclude the player even from provisional drafts. An empty injury field means unknown, never verified fit; this feed does not establish match-specific suspension clearance, start probability or all-competition workload. Player matching uses exact normalized name + club, and ambiguous matches are ignored.

FBref performance rows require a matching season heading and nonempty xG fields. Retained stats keep their original timestamp and source. The client ignores unsourced, future or older-than-72-hour player performance stats, displays a dash for missing xG/xA, and uses explicitly provisional positional priors. Roster refresh time never rejuvenates stats. The visible data-quality panel separates roster, performance, fixtures and availability coverage.

After a successful roster workflow, Pages rebuilds from the newly committed data via workflow_run. This addresses the fact that bot-token pushes do not start another push workflow. The scheduled Pages build remains a fallback.

FotMob player xG/xA/minutes integration uses the statistic links advertised by the current-season league response (no hard-coded season ID). Only allowlisted HTTPS statistic URLs are fetched. Join by provider player ID **and** team ID; minutes and appearances must agree across all three datasets. Missing rows/values, duplicate IDs or mismatched totals are excluded, never converted into zero. Real zero values remain zero. xG90 and xA90 are calculated as total xG/xA × 90 / minutes. Source and observation timestamp are attached per player. This is season-to-date league performance, not all-competition workload, verified first-XI probability, or match-level xG for historical score backtests. Sourced injuries remain excluded regardless of high performance.

## V12.2 observed club calendar and historical lineup

`teamContext` in tff-scout.json is keyed by club. Each entry includes checkedAt, source, coverage `club-calendar-only`, fixtures and optional lastLineup. Accept only club-identified, dated fixtures within 30 days before / 45 days after observation; exclude cancelled, awarded and future-finished records. Historical lineup requires the exact finished fixture and team IDs, 11 unique starters and no overlapping bench IDs.

Kadro Sağlığı shows completed club fixtures within 7/14 days before the target league kickoff and separately counts still-scheduled fixtures. Start-to-start gaps are labelled explicitly, not treated as actual rest. Freshness is 72 hours. Missing target kickoff or stale sources produce an unknown state, never zero load. Historical player roles are descriptive only. Neither club fixtures nor last-match selection establish complete player minutes, future start probability, international workload or motivation. Verified eligibility rules remain unchanged.
