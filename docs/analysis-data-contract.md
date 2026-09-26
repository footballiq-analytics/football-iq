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
