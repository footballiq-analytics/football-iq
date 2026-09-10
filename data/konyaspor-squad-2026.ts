import type { Player as StorePlayer } from "@/store/useTeamStore";

/** Konyaspor 2026-27 A takım oyuncu havuzu. Gerçek fantasy puanı/popülerlik canlı sağlayıcı bağlanana kadar 0 tutulur. */
export const KONYASPOR_FANTASY_PLAYERS: StorePlayer[] = [
  { id: "kon-deniz-ertas", name: "Deniz Ertaş", club: "Konyaspor", position: "GK", price: 5.2, points: 0, matches: 0, selected: 0 },
  { id: "kon-bahadir-han-gungordu", name: "Bahadır Han Güngördü", club: "Konyaspor", position: "GK", price: 4.8, points: 0, matches: 0, selected: 0 },
  { id: "kon-emir-aydin", name: "Emir Aydın", club: "Konyaspor", position: "GK", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "kon-emirhan-gundogdu", name: "Emirhan Gündoğdu", club: "Konyaspor", position: "GK", price: 3.8, points: 0, matches: 0, selected: 0 },

  { id: "kon-ahmet-oguz", name: "Ahmet Oğuz", club: "Konyaspor", position: "DEF", price: 5.0, points: 0, matches: 0, selected: 0 },
  { id: "kon-el-hadji-malamine-konate", name: "El Hadji Malamine Konate", club: "Konyaspor", position: "DEF", price: 4.7, points: 0, matches: 0, selected: 0 },
  { id: "kon-arif-bosluk", name: "Arif Boşluk", club: "Konyaspor", position: "DEF", price: 5.1, points: 0, matches: 0, selected: 0 },
  { id: "kon-adil-demirbag", name: "Adil Demirbağ", club: "Konyaspor", position: "DEF", price: 5.8, points: 0, matches: 0, selected: 0 },
  { id: "kon-ugurcan-yazgili", name: "Uğurcan Yazğılı", club: "Konyaspor", position: "DEF", price: 5.4, points: 0, matches: 0, selected: 0 },
  { id: "kon-chidozie-awaziem", name: "Chidozie Awaziem", club: "Konyaspor", position: "DEF", price: 6.2, points: 0, matches: 0, selected: 0 },
  { id: "kon-arda-yanik", name: "Arda Yanık", club: "Konyaspor", position: "DEF", price: 3.8, points: 0, matches: 0, selected: 0 },
  { id: "kon-yhoan-andzouana", name: "Yhoan Andzouana", club: "Konyaspor", position: "DEF", price: 5.7, points: 0, matches: 0, selected: 0 },
  { id: "kon-rayyan-baniya", name: "Rayyan Baniya", club: "Konyaspor", position: "DEF", price: 5.6, points: 0, matches: 0, selected: 0 },
  { id: "kon-arthur-masuaku", name: "Arthur Masuaku", club: "Konyaspor", position: "DEF", price: 6.5, points: 0, matches: 0, selected: 0 },
  { id: "kon-umut-eris", name: "Umut Eriş", club: "Konyaspor", position: "DEF", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "kon-da-mata", name: "Da Mata", club: "Konyaspor", position: "DEF", price: 4.3, points: 0, matches: 0, selected: 0 },

  { id: "kon-diogo-goncalves", name: "Diogo Gonçalves", club: "Konyaspor", position: "MID", price: 7.2, points: 0, matches: 0, selected: 0 },
  { id: "kon-marko-jevtovic", name: "Marko Jevtović", club: "Konyaspor", position: "MID", price: 6.0, points: 0, matches: 0, selected: 0 },
  { id: "kon-enis-bardhi", name: "Enis Bardhi", club: "Konyaspor", position: "MID", price: 7.5, points: 0, matches: 0, selected: 0 },
  { id: "kon-metehan-ibrahimoglu-aut", name: "Metehan İbrahimoğlu", club: "Konyaspor", position: "MID", price: 4.5, points: 0, matches: 0, selected: 0 },
  { id: "kon-oguzhan-cobanoglu", name: "Oğuzhan Çobanoğlu", club: "Konyaspor", position: "MID", price: 4.1, points: 0, matches: 0, selected: 0 },
  { id: "kon-roland-toth", name: "Roland Tóth", club: "Konyaspor", position: "MID", price: 5.2, points: 0, matches: 0, selected: 0 },
  { id: "kon-mucahit-ibrahimoglu", name: "Mücahit İbrahimoğlu", club: "Konyaspor", position: "MID", price: 5.0, points: 0, matches: 0, selected: 0 },
  { id: "kon-burak-ozcelik", name: "Burak Özçelik", club: "Konyaspor", position: "MID", price: 4.1, points: 0, matches: 0, selected: 0 },

  { id: "kon-deniz-turuc", name: "Deniz Türüç", club: "Konyaspor", position: "FWD", price: 7.4, points: 0, matches: 0, selected: 0 },
  { id: "kon-jackson-muleka", name: "Jackson Muleka", club: "Konyaspor", position: "FWD", price: 7.6, points: 0, matches: 0, selected: 0 },
  { id: "kon-ebrima-colley", name: "Ebrima Colley", club: "Konyaspor", position: "FWD", price: 7.0, points: 0, matches: 0, selected: 0 },
  { id: "kon-emir-yagmur", name: "Emir Yağmur", club: "Konyaspor", position: "FWD", price: 4.2, points: 0, matches: 0, selected: 0 },
  { id: "kon-mostafa-mohamed", name: "Mostafa Mohamed", club: "Konyaspor", position: "FWD", price: 8.5, points: 0, matches: 0, selected: 0 },
  { id: "kon-emre-bars", name: "Emre Bars", club: "Konyaspor", position: "FWD", price: 4.5, points: 0, matches: 0, selected: 0 },
  { id: "kon-kaan-akyazi", name: "Kaan Akyazı", club: "Konyaspor", position: "FWD", price: 4.3, points: 0, matches: 0, selected: 0 },
  { id: "kon-jean-luc-dompe", name: "Jean-Luc Dompé", club: "Konyaspor", position: "FWD", price: 7.8, points: 0, matches: 0, selected: 0 },
  { id: "kon-enis-destan", name: "Enis Destan", club: "Konyaspor", position: "FWD", price: 6.8, points: 0, matches: 0, selected: 0 },
  { id: "kon-blaz-kramer", name: "Blaž Kramer", club: "Konyaspor", position: "FWD", price: 7.1, points: 0, matches: 0, selected: 0 },
];
