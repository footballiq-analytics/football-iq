import type { Match, Prediction } from "@/types";
/** API tabanlı Poisson, xG, Elo ve Monte Carlo çıktılarının birleştirileceği servis sınırı. */
export interface PredictionService { getPrediction(match: Match): Promise<Prediction>; }
export class DemoPredictionService implements PredictionService { async getPrediction(match: Match) { return match.prediction; } }
export const predictionService = new DemoPredictionService();
