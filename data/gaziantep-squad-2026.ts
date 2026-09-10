import type { Player as StorePlayer } from "@/store/useTeamStore";

/** Gaziantep FK 2026-27 A takım oyuncu havuzu. Canlı fantasy puanı/popülerlik sağlayıcı bağlanana kadar 0 tutulur. */
export const GAZIANTEP_FANTASY_PLAYERS: StorePlayer[] = [
  { id: "gaz-ibrahim-alkis", name: "İbrahim Alkış", club: "Gaziantep FK", position: "GK", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "gaz-kacper-tobiasz", name: "Kacper Tobiasz", club: "Gaziantep FK", position: "GK", price: 5.2, points: 0, matches: 0, selected: 0 },
  { id: "gaz-abdulsamed-dadakdeniz", name: "Abdulsamed Dadakdeniz", club: "Gaziantep FK", position: "GK", price: 4.8, points: 0, matches: 0, selected: 0 },
  { id: "gaz-cagan-aslan", name: "Çağan Aslan", club: "Gaziantep FK", position: "GK", price: 4.0, points: 0, matches: 0, selected: 0 },

  { id: "gaz-luis-perez", name: "Luis Pérez", club: "Gaziantep FK", position: "DEF", price: 5.8, points: 0, matches: 0, selected: 0 },
  { id: "gaz-ardakiz-kizildag", name: "Arda Kızıldağ", club: "Gaziantep FK", position: "DEF", price: 5.3, points: 0, matches: 0, selected: 0 },
  { id: "gaz-emir-sarikaya", name: "Emir Sarıkaya", club: "Gaziantep FK", position: "DEF", price: 4.3, points: 0, matches: 0, selected: 0 },
  { id: "gaz-myenty-abena", name: "Myenty Abena", club: "Gaziantep FK", position: "DEF", price: 5.5, points: 0, matches: 0, selected: 0 },
  { id: "gaz-deian-sorescu", name: "Deian Sorescu", club: "Gaziantep FK", position: "DEF", price: 6.1, points: 0, matches: 0, selected: 0 },
  { id: "gaz-abakar-sylla", name: "Abakar Sylla", club: "Gaziantep FK", position: "DEF", price: 5.7, points: 0, matches: 0, selected: 0 },
  { id: "gaz-kerim-calhanoglu", name: "Kerim Çalhanoğlu", club: "Gaziantep FK", position: "DEF", price: 5.0, points: 0, matches: 0, selected: 0 },
  { id: "gaz-nazim-sangare", name: "Nazım Sangaré", club: "Gaziantep FK", position: "DEF", price: 5.6, points: 0, matches: 0, selected: 0 },
  { id: "gaz-salih-destici", name: "Salih Destici", club: "Gaziantep FK", position: "DEF", price: 4.5, points: 0, matches: 0, selected: 0 },
  { id: "gaz-muhammed-mujdeci", name: "Muhammed Müjdeci", club: "Gaziantep FK", position: "DEF", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "gaz-florin-stefan", name: "Florin Ștefan", club: "Gaziantep FK", position: "DEF", price: 5.6, points: 0, matches: 0, selected: 0 },

  { id: "gaz-m-gunes", name: "M. Güneş", club: "Gaziantep FK", position: "MID", price: 4.2, points: 0, matches: 0, selected: 0 },
  { id: "gaz-b-yikici", name: "B. Yıkıcı", club: "Gaziantep FK", position: "MID", price: 4.2, points: 0, matches: 0, selected: 0 },
  { id: "gaz-ogun-ozcicek", name: "Oğün Özçiçek", club: "Gaziantep FK", position: "MID", price: 5.8, points: 0, matches: 0, selected: 0 },
  { id: "gaz-d-camara", name: "D. Camara", club: "Gaziantep FK", position: "MID", price: 5.5, points: 0, matches: 0, selected: 0 },
  { id: "gaz-u-meleke", name: "U. Meleke", club: "Gaziantep FK", position: "MID", price: 5.6, points: 0, matches: 0, selected: 0 },
  { id: "gaz-juninho-bacuna", name: "Juninho Bacuna", club: "Gaziantep FK", position: "MID", price: 6.8, points: 0, matches: 0, selected: 0 },
  { id: "gaz-v-gidado", name: "V. Gidado", club: "Gaziantep FK", position: "MID", price: 5.0, points: 0, matches: 0, selected: 0 },
  { id: "gaz-kacper-kozlowski", name: "Kacper Kozłowski", club: "Gaziantep FK", position: "MID", price: 7.2, points: 0, matches: 0, selected: 0 },
  { id: "gaz-m-cihan", name: "M. Cihan", club: "Gaziantep FK", position: "MID", price: 5.2, points: 0, matches: 0, selected: 0 },
  { id: "gaz-k-gassama", name: "K. Gassama", club: "Gaziantep FK", position: "MID", price: 4.8, points: 0, matches: 0, selected: 0 },
  { id: "gaz-alexandru-maxim", name: "Alexandru Maxim", club: "Gaziantep FK", position: "MID", price: 7.4, points: 0, matches: 0, selected: 0 },

  { id: "gaz-m-akmelek", name: "M. Akmelek", club: "Gaziantep FK", position: "FWD", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "gaz-t-stewart", name: "T. Stewart", club: "Gaziantep FK", position: "FWD", price: 6.5, points: 0, matches: 0, selected: 0 },
  { id: "gaz-serdar-dursun", name: "Serdar Dursun", club: "Gaziantep FK", position: "FWD", price: 6.9, points: 0, matches: 0, selected: 0 },
  { id: "gaz-sontje-hansen", name: "Sontje Hansen", club: "Gaziantep FK", position: "FWD", price: 6.7, points: 0, matches: 0, selected: 0 },
  { id: "gaz-e-kulasin", name: "E. Kulašin", club: "Gaziantep FK", position: "FWD", price: 6.1, points: 0, matches: 0, selected: 0 },
  { id: "gaz-halil-dervisoglu", name: "Halil Dervişoğlu", club: "Gaziantep FK", position: "FWD", price: 6.6, points: 0, matches: 0, selected: 0 },
  { id: "gaz-a-kalin", name: "A. Kalın", club: "Gaziantep FK", position: "FWD", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "gaz-fuat-bavuk", name: "Fuat Bavuk", club: "Gaziantep FK", position: "FWD", price: 5.7, points: 0, matches: 0, selected: 0 },
];
