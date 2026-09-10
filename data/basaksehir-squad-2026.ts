import type { Player as StorePlayer } from "@/store/useTeamStore";

/** İstanbul Başakşehir FK 2026-27 A takım oyuncu havuzu. Gerçek fantasy puanı/popülerlik canlı sağlayıcı bağlanana kadar 0 tutulur. */
export const BASAKSEHIR_FANTASY_PLAYERS: StorePlayer[] = [
  { id: "ibfk-volkan-babacan", name: "Volkan Babacan", club: "İstanbul Başakşehir FK", position: "GK", price: 4.5, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-muhammed-sengezer", name: "Muhammed Şengezer", club: "İstanbul Başakşehir FK", position: "GK", price: 5.5, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-luca-ekrem-stancic", name: "Luca Ekrem Stančić", club: "İstanbul Başakşehir FK", position: "GK", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-deniz-dilmen", name: "Deniz Dilmen", club: "İstanbul Başakşehir FK", position: "GK", price: 4.0, points: 0, matches: 0, selected: 0 },

  { id: "ibfk-jerome-opoku", name: "Jerome Opoku", club: "İstanbul Başakşehir FK", position: "DEF", price: 5.7, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-onur-bulut", name: "Onur Bulut", club: "İstanbul Başakşehir FK", position: "DEF", price: 5.4, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-hamza-gureler", name: "Hamza Güreler", club: "İstanbul Başakşehir FK", position: "DEF", price: 4.8, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-christopher-operi", name: "Christopher Opéri", club: "İstanbul Başakşehir FK", position: "DEF", price: 5.8, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-emin-bayram", name: "Emin Bayram", club: "İstanbul Başakşehir FK", position: "DEF", price: 6.2, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-ousseynou-ba", name: "Ousseynou Ba", club: "İstanbul Başakşehir FK", position: "DEF", price: 5.6, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-michal-karbownik", name: "Michal Karbownik", club: "İstanbul Başakşehir FK", position: "DEF", price: 5.9, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-saba-kharebashvili", name: "Saba Kharebashvili", club: "İstanbul Başakşehir FK", position: "DEF", price: 4.5, points: 0, matches: 0, selected: 0 },

  { id: "ibfk-onur-ergun", name: "Onur Ergün", club: "İstanbul Başakşehir FK", position: "MID", price: 5.1, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-berat-ozdemir", name: "Berat Özdemir", club: "İstanbul Başakşehir FK", position: "MID", price: 6.4, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-olivier-kemen", name: "Olivier Kemen", club: "İstanbul Başakşehir FK", position: "MID", price: 6.5, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-abbosbek-fayzullaev", name: "Abbosbek Fayzullaev", club: "İstanbul Başakşehir FK", position: "MID", price: 8.4, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-jakub-kaluzinski", name: "Jakub Kałuziński", club: "İstanbul Başakşehir FK", position: "MID", price: 6.7, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-berkay-ozcan", name: "Berkay Özcan", club: "İstanbul Başakşehir FK", position: "MID", price: 6.2, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-umut-gunes", name: "Umut Güneş", club: "İstanbul Başakşehir FK", position: "MID", price: 6.0, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-omer-ali-sahiner", name: "Ömer Ali Şahiner", club: "İstanbul Başakşehir FK", position: "MID", price: 5.4, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-edin-visca", name: "Edin Višća", club: "İstanbul Başakşehir FK", position: "MID", price: 7.3, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-andreas-skov-olsen", name: "Andreas Skov Olsen", club: "İstanbul Başakşehir FK", position: "MID", price: 8.2, points: 0, matches: 0, selected: 0 },

  { id: "ibfk-yusuf-sari", name: "Yusuf Sarı", club: "İstanbul Başakşehir FK", position: "FWD", price: 7.0, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-davie-selke", name: "Davie Selke", club: "İstanbul Başakşehir FK", position: "FWD", price: 7.7, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-eldor-shomurodov", name: "Eldor Shomurodov", club: "İstanbul Başakşehir FK", position: "FWD", price: 8.0, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-umut-bozok", name: "Umut Bozok", club: "İstanbul Başakşehir FK", position: "FWD", price: 6.6, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-ivan-brnic", name: "Ivan Brnić", club: "İstanbul Başakşehir FK", position: "FWD", price: 6.8, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-bertug-yildirim", name: "Bertuğ Yıldırım", club: "İstanbul Başakşehir FK", position: "FWD", price: 7.2, points: 0, matches: 0, selected: 0 },
  { id: "ibfk-emir-tugra-turhan", name: "Emir Tuğra Turhan", club: "İstanbul Başakşehir FK", position: "FWD", price: 4.3, points: 0, matches: 0, selected: 0 },
];
