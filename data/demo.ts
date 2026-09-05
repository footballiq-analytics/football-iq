import type { League, Match, PlatformStatistics, Prediction, Standing, Team } from "@/types";

export const leagues: League[] = [
  { id: "super-lig", name: "Süper Lig", country: "Türkiye", season: "2026/27", accent: "#d93f52" },
  { id: "champions-league", name: "UEFA Şampiyonlar Ligi", country: "Avrupa", season: "2026/27", accent: "#2459a6" },
];
const team = (id: string, name: string, leagueId: "super-lig" | "champions-league", colors: [string, string], form: ("W"|"D"|"L")[], gf: number, ga: number): Team => ({ id, slug: id, name, shortName: name, leagueId, colors, form: { results: form, points: form.reduce((p, r) => p + (r === "W" ? 3 : r === "D" ? 1 : 0), 0) }, stats: { played: 5, goalsFor: gf, goalsAgainst: ga, xg: gf + .7, xga: ga + .5, homePoints: 10, awayPoints: 7, over25Rate: 62, bttsRate: 58 } });
export const teams: Team[] = [
  team("fenerbahce", "Fenerbahçe", "super-lig", ["#ffdc19", "#193f8f"], ["W","W","D","W","W"], 11, 4),
  team("galatasaray", "Galatasaray", "super-lig", ["#f1b51c", "#9c183a"], ["W","D","W","W","L"], 10, 5),
  team("besiktas", "Beşiktaş", "super-lig", ["#111827", "#f8fafc"], ["D","W","W","L","W"], 8, 6),
  team("trabzonspor", "Trabzonspor", "super-lig", ["#7b233d", "#66b9da"], ["W","L","D","W","D"], 7, 6),
  team("real-madrid", "Real Madrid", "champions-league", ["#ffffff", "#cba135"], ["W","W","W","D","W"], 12, 3),
  team("manchester-city", "Manchester City", "champions-league", ["#6cabdd", "#ffffff"], ["W","D","W","W","W"], 11, 4),
];
const t = (id: string) => teams.find((item) => item.id === id)!;
const prediction = (score: string, home: number, draw: number, away: number, confidence: number): Prediction => ({ predictedScore: score, probabilities: { home, draw, away, over25: 64, btts: 61 }, confidence: { score: confidence, label: confidence >= 75 ? "Yüksek" : "Orta", rationale: "Form, gol üretimi ve saha avantajı birlikte değerlendirildi." }, scoreDistribution: [{ score, probability: 18 }, { score: "1-1", probability: 14 }, { score: "1-0", probability: 12 }, { score: "2-0", probability: 10 }], methods: ["Ensemble", "Poisson", "xG", "Elo", "Monte Carlo"] });
export const matches: Match[] = [
  { id: "1", slug: "fenerbahce-galatasaray", leagueId: "super-lig", kickoff: "20:00", dateLabel: "Bugün, 5 Eylül", status: "upcoming", home: t("fenerbahce"), away: t("galatasaray"), prediction: prediction("2 - 1", 58, 24, 18, 78) },
  { id: "2", slug: "besiktas-trabzonspor", leagueId: "super-lig", kickoff: "17:00", dateLabel: "Bugün, 5 Eylül", status: "upcoming", home: t("besiktas"), away: t("trabzonspor"), prediction: prediction("1 - 1", 38, 31, 31, 68) },
  { id: "3", slug: "real-madrid-manchester-city", leagueId: "champions-league", kickoff: "22:00", dateLabel: "Bugün, 5 Eylül", status: "upcoming", home: t("real-madrid"), away: t("manchester-city"), prediction: prediction("2 - 1", 48, 27, 25, 74) },
];
export const getStandings = (leagueId: "super-lig" | "champions-league"): Standing[] => teams.filter((t) => t.leagueId === leagueId).sort((a,b) => b.form.points-a.form.points).map((team, index) => ({ team, position: index + 1, points: team.form.points }));
export const statistics: PlatformStatistics = { highestScoring: [t("real-madrid"), t("fenerbahce"), t("manchester-city")], strongestDefence: [t("real-madrid"),t("fenerbahce"),t("galatasaray")], bestForm: [t("fenerbahce"),t("real-madrid"),t("manchester-city")], bestHome: [t("fenerbahce"),t("besiktas"),t("real-madrid")], bestAway: [t("galatasaray"),t("manchester-city"),t("trabzonspor")] };
