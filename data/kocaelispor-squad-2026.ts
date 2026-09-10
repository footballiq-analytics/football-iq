import type { Player as StorePlayer } from "@/store/useTeamStore";

/** Kocaelispor 2026-27 A takım oyuncu havuzu. Kaynak: güncel UEFA Süper Lig kadro sayfası. Gerçek fantasy puanı/popülerlik canlı sağlayıcı bağlanana kadar 0 tutulur. */
export const KOCAELISPOR_FANTASY_PLAYERS: StorePlayer[] = [
  { id: "koc-t-polat", name: "T. Polat", club: "Kocaelispor", position: "GK", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "koc-aleksandar-jovanovic", name: "Aleksandar Jovanović", club: "Kocaelispor", position: "GK", price: 5.5, points: 0, matches: 0, selected: 0 },
  { id: "koc-onurcan-piri", name: "Onurcan Piri", club: "Kocaelispor", position: "GK", price: 4.8, points: 0, matches: 0, selected: 0 },
  { id: "koc-s-oztasdelen", name: "S. Öztaşdelen", club: "Kocaelispor", position: "GK", price: 4.0, points: 0, matches: 0, selected: 0 },

  { id: "koc-m-kucuk", name: "M. Küçük", club: "Kocaelispor", position: "DEF", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "koc-anfernee-dijksteel", name: "Anfernee Dijksteel", club: "Kocaelispor", position: "DEF", price: 6.0, points: 0, matches: 0, selected: 0 },
  { id: "koc-m-cinan", name: "M. Cinan", club: "Kocaelispor", position: "DEF", price: 4.8, points: 0, matches: 0, selected: 0 },
  { id: "koc-tidiane-zoukrou", name: "Tidiane Zoukrou", club: "Kocaelispor", position: "DEF", price: 5.5, points: 0, matches: 0, selected: 0 },
  { id: "koc-emir-ortakaya", name: "Emir Ortakaya", club: "Kocaelispor", position: "DEF", price: 5.4, points: 0, matches: 0, selected: 0 },
  { id: "koc-matej-maglica", name: "Matej Maglica", club: "Kocaelispor", position: "DEF", price: 5.8, points: 0, matches: 0, selected: 0 },
  { id: "koc-massadio-haidara", name: "Massadio Haïdara", club: "Kocaelispor", position: "DEF", price: 6.2, points: 0, matches: 0, selected: 0 },
  { id: "koc-u-yildiz", name: "U. Yıldız", club: "Kocaelispor", position: "DEF", price: 4.7, points: 0, matches: 0, selected: 0 },
  { id: "koc-o-oztonga", name: "O. Öztonga", club: "Kocaelispor", position: "DEF", price: 4.6, points: 0, matches: 0, selected: 0 },
  { id: "koc-tayfur-bingol", name: "Tayfur Bingöl", club: "Kocaelispor", position: "DEF", price: 5.6, points: 0, matches: 0, selected: 0 },

  { id: "koc-e-narin", name: "E. Narin", club: "Kocaelispor", position: "MID", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "koc-habib-keita", name: "Habib Keïta", club: "Kocaelispor", position: "MID", price: 6.2, points: 0, matches: 0, selected: 0 },
  { id: "koc-samuel-yalcin", name: "S. Yalçın", club: "Kocaelispor", position: "MID", price: 5.3, points: 0, matches: 0, selected: 0 },
  { id: "koc-h-destici", name: "H. Destici", club: "Kocaelispor", position: "MID", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "koc-tobias-gulliksen", name: "Tobias Gulliksen", club: "Kocaelispor", position: "MID", price: 7.3, points: 0, matches: 0, selected: 0 },
  { id: "koc-berkan-kutlu", name: "Berkan Kutlu", club: "Kocaelispor", position: "MID", price: 6.7, points: 0, matches: 0, selected: 0 },
  { id: "koc-manuel-cafumana", name: "Manuel Cafumana", club: "Kocaelispor", position: "MID", price: 6.6, points: 0, matches: 0, selected: 0 },
  { id: "koc-h-karatas", name: "H. Karataş", club: "Kocaelispor", position: "MID", price: 4.1, points: 0, matches: 0, selected: 0 },
  { id: "koc-mahamadou-susoho", name: "Mahamadou Susoho", club: "Kocaelispor", position: "MID", price: 6.0, points: 0, matches: 0, selected: 0 },
  { id: "koc-e-bilim", name: "E. Bilim", club: "Kocaelispor", position: "MID", price: 4.3, points: 0, matches: 0, selected: 0 },
  { id: "koc-m-baku", name: "M. Baku", club: "Kocaelispor", position: "MID", price: 6.8, points: 0, matches: 0, selected: 0 },

  { id: "koc-b-dalkilic", name: "B. Dalkılıç", club: "Kocaelispor", position: "FWD", price: 4.1, points: 0, matches: 0, selected: 0 },
  { id: "koc-flo-aye", name: "F. Ayé", club: "Kocaelispor", position: "FWD", price: 6.5, points: 0, matches: 0, selected: 0 },
  { id: "koc-daniel-agyei", name: "D. Agyei", club: "Kocaelispor", position: "FWD", price: 6.9, points: 0, matches: 0, selected: 0 },
  { id: "koc-bruno-petkovic", name: "Bruno Petković", club: "Kocaelispor", position: "FWD", price: 8.2, points: 0, matches: 0, selected: 0 },
  { id: "koc-goncalo-sousa", name: "Gonçalo Sousa", club: "Kocaelispor", position: "FWD", price: 5.5, points: 0, matches: 0, selected: 0 },
  { id: "koc-a-ozyar", name: "A. Özyar", club: "Kocaelispor", position: "FWD", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "koc-m-altunbas", name: "M. Altunbaş", club: "Kocaelispor", position: "FWD", price: 4.8, points: 0, matches: 0, selected: 0 },
  { id: "koc-b-yildiz", name: "B. Yıldız", club: "Kocaelispor", position: "FWD", price: 4.4, points: 0, matches: 0, selected: 0 },
  { id: "koc-r-rivas", name: "R. Rivas", club: "Kocaelispor", position: "FWD", price: 6.7, points: 0, matches: 0, selected: 0 },
];
