export type LeagueSlug = "super-lig" | "champions-league";
export interface League { id: LeagueSlug; name: string; country: string; season: string; accent: string; }
export interface Team { id: string; slug: string; name: string; shortName: string; leagueId: LeagueSlug; colors: [string, string]; form: Form; stats: TeamStats; }
export interface Probability { home: number; draw: number; away: number; over25: number; btts: number; }
export interface ModelConfidence { score: number; label: "Yüksek" | "Orta" | "Gelişmekte"; rationale: string; }
export interface Prediction { predictedScore: string; probabilities: Probability; confidence: ModelConfidence; scoreDistribution: ScoreProbability[]; methods: ("Poisson" | "xG" | "Elo" | "Monte Carlo" | "Ensemble")[]; }
export interface Match { id: string; slug: string; leagueId: LeagueSlug; kickoff: string; dateLabel: string; status: "upcoming" | "finished"; home: Team; away: Team; prediction: Prediction; result?: string; }
export interface Form { results: ("W" | "D" | "L")[]; points: number; }
export interface TeamStats { played: number; goalsFor: number; goalsAgainst: number; xg: number; xga: number; homePoints: number; awayPoints: number; over25Rate: number; bttsRate: number; }
export interface ScoreProbability { score: string; probability: number; }
export interface Injury { player: string; status: "Sakat" | "Cezalı" | "Şüpheli"; note: string; }
export interface Lineup { formation: string; players: string[]; status: "Beklenen" | "Açıklanmadı"; }
export interface DataSource { name: string; type: "demo" | "provider"; url?: string; }
export interface DataFreshness { updatedAt: string; isLive: boolean; message: string; }
export interface Standing { team: Team; position: number; points: number; }
export interface PlatformStatistics { highestScoring: Team[]; strongestDefence: Team[]; bestForm: Team[]; bestHome: Team[]; bestAway: Team[]; }
