import type { Player as StorePlayer } from "@/store/useTeamStore";

/** Göztepe 2026-27 A takım oyuncu havuzu. Kulüp resmi A takım sayfası ve güncel UEFA Süper Lig kadrosu esas alınmıştır. Gerçek fantasy puanı/popülerlik canlı sağlayıcı bağlanana kadar 0 tutulur. */
export const GOZTEPE_FANTASY_PLAYERS: StorePlayer[] = [
  { id: "goz-arda-ozcimen", name: "Arda Özçimen", club: "Göztepe", position: "GK", price: 5.0, points: 0, matches: 0, selected: 0 },
  { id: "goz-luka-gugeshashvili", name: "Luka Gugeshashvili", club: "Göztepe", position: "GK", price: 5.4, points: 0, matches: 0, selected: 0 },
  { id: "goz-mehmet-samil-ozturk", name: "Mehmet Şamil Öztürk", club: "Göztepe", position: "GK", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "goz-nevzat-tan-uzel", name: "Nevzat Tan Üzel", club: "Göztepe", position: "GK", price: 3.8, points: 0, matches: 0, selected: 0 },

  { id: "goz-allan-godoi", name: "Allan Godoi", club: "Göztepe", position: "DEF", price: 5.6, points: 0, matches: 0, selected: 0 },
  { id: "goz-amin-cherni", name: "Amin Cherni", club: "Göztepe", position: "DEF", price: 5.5, points: 0, matches: 0, selected: 0 },
  { id: "goz-arda-okan-kurtulan", name: "Arda Okan Kurtulan", club: "Göztepe", position: "DEF", price: 5.0, points: 0, matches: 0, selected: 0 },
  { id: "goz-ege-yildirim", name: "Ege Yıldırım", club: "Göztepe", position: "DEF", price: 4.1, points: 0, matches: 0, selected: 0 },
  { id: "goz-furkan-bayir", name: "Furkan Bayır", club: "Göztepe", position: "DEF", price: 5.2, points: 0, matches: 0, selected: 0 },
  { id: "goz-malcom-bokele", name: "Malcom Bokele", club: "Göztepe", position: "DEF", price: 5.8, points: 0, matches: 0, selected: 0 },
  { id: "goz-noah-sonko-sundberg", name: "Noah Sonko Sundberg", club: "Göztepe", position: "DEF", price: 5.7, points: 0, matches: 0, selected: 0 },
  { id: "goz-ogun-bayrak", name: "Ogün Bayrak", club: "Göztepe", position: "DEF", price: 5.1, points: 0, matches: 0, selected: 0 },
  { id: "goz-taha-altikardes", name: "Taha Altıkardeş", club: "Göztepe", position: "DEF", price: 5.5, points: 0, matches: 0, selected: 0 },
  { id: "goz-richard-akonnor", name: "Richard Akonnor", club: "Göztepe", position: "DEF", price: 4.8, points: 0, matches: 0, selected: 0 },
  { id: "goz-gokdeniz-bayrakdar", name: "Gökdeniz Bayrakdar", club: "Göztepe", position: "DEF", price: 5.2, points: 0, matches: 0, selected: 0 },

  { id: "goz-alex-matos", name: "Alex Matos", club: "Göztepe", position: "MID", price: 6.3, points: 0, matches: 0, selected: 0 },
  { id: "goz-alexis-antunes", name: "Alexis Antunes", club: "Göztepe", position: "MID", price: 6.5, points: 0, matches: 0, selected: 0 },
  { id: "goz-anthony-dennis", name: "Anthony Dennis", club: "Göztepe", position: "MID", price: 5.6, points: 0, matches: 0, selected: 0 },
  { id: "goz-efkan-bekiroglu", name: "Efkan Bekiroğlu", club: "Göztepe", position: "MID", price: 7.0, points: 0, matches: 0, selected: 0 },
  { id: "goz-musah-mohammed", name: "Musah Mohammed", club: "Göztepe", position: "MID", price: 5.4, points: 0, matches: 0, selected: 0 },
  { id: "goz-novatus-miroshi", name: "Novatus Miroshi", club: "Göztepe", position: "MID", price: 6.0, points: 0, matches: 0, selected: 0 },
  { id: "goz-rhaldney", name: "Rhaldney", club: "Göztepe", position: "MID", price: 6.4, points: 0, matches: 0, selected: 0 },
  { id: "goz-tino-anjorin", name: "Tino Anjorin", club: "Göztepe", position: "MID", price: 6.8, points: 0, matches: 0, selected: 0 },

  { id: "goz-andre-henrique", name: "Andre Henrique", club: "Göztepe", position: "FWD", price: 6.7, points: 0, matches: 0, selected: 0 },
  { id: "goz-guilherme-luiz", name: "Guilherme Luiz", club: "Göztepe", position: "FWD", price: 5.5, points: 0, matches: 0, selected: 0 },
  { id: "goz-ibrahim-sabra", name: "Ibrahim Sabra", club: "Göztepe", position: "FWD", price: 5.7, points: 0, matches: 0, selected: 0 },
  { id: "goz-janderson-costa", name: "Janderson Costa", club: "Göztepe", position: "FWD", price: 7.4, points: 0, matches: 0, selected: 0 },
  { id: "goz-juan", name: "Juan", club: "Göztepe", position: "FWD", price: 7.2, points: 0, matches: 0, selected: 0 },
  { id: "goz-sinclair-armstrong", name: "Sinclair Armstrong", club: "Göztepe", position: "FWD", price: 7.1, points: 0, matches: 0, selected: 0 },
  { id: "goz-turhan-boke", name: "Turhan Böke", club: "Göztepe", position: "FWD", price: 4.8, points: 0, matches: 0, selected: 0 },
];
