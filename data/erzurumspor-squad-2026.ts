import type { Player as StorePlayer } from "@/store/useTeamStore";

/**
 * Erzurumspor FK 2026/27 A takım oyuncu havuzu.
 * Kadro; kulübün güncel A takım/transfer duyuruları ve 2026/27 sezon kayıtlarıyla
 * çapraz kontrol edilerek oluşturuldu. Canlı fantasy istatistik sağlayıcısı bağlanana
 * kadar points, matches ve selected alanları 0 tutulur. Fiyatlar FUTBOL IQ editoryal
 * başlangıç değerleridir.
 */
export const ERZURUMSPOR_FANTASY_PLAYERS: StorePlayer[] = [
  { id: "erz-ertugrul-taskiran", name: "Ertuğrul Taşkıran", club: "Erzurumspor FK", position: "GK", price: 5.0, points: 0, matches: 0, selected: 0 },
  { id: "erz-matija-orbanic", name: "Matija Orbanić", club: "Erzurumspor FK", position: "GK", price: 4.6, points: 0, matches: 0, selected: 0 },
  { id: "erz-erkan-anapa", name: "Erkan Anapa", club: "Erzurumspor FK", position: "GK", price: 4.2, points: 0, matches: 0, selected: 0 },

  { id: "erz-nihad-mujakic", name: "Nihad Mujakić", club: "Erzurumspor FK", position: "DEF", price: 5.4, points: 0, matches: 0, selected: 0 },
  { id: "erz-festy-ebosele", name: "Festy Ebosele", club: "Erzurumspor FK", position: "DEF", price: 5.3, points: 0, matches: 0, selected: 0 },
  { id: "erz-guram-giorbelidze", name: "Guram Giorbelidze", club: "Erzurumspor FK", position: "DEF", price: 5.0, points: 0, matches: 0, selected: 0 },
  { id: "erz-yakup-kirtay", name: "Yakup Kırtay", club: "Erzurumspor FK", position: "DEF", price: 4.7, points: 0, matches: 0, selected: 0 },
  { id: "erz-mustafa-yumlu", name: "Mustafa Yumlu", club: "Erzurumspor FK", position: "DEF", price: 4.7, points: 0, matches: 0, selected: 0 },
  { id: "erz-amar-gerxhaliu", name: "Amar Gerxhaliu", club: "Erzurumspor FK", position: "DEF", price: 4.6, points: 0, matches: 0, selected: 0 },
  { id: "erz-cengizhan-bayrak", name: "Cengizhan Bayrak", club: "Erzurumspor FK", position: "DEF", price: 4.5, points: 0, matches: 0, selected: 0 },
  { id: "erz-omer-arda-kara", name: "Ömer Arda Kara", club: "Erzurumspor FK", position: "DEF", price: 4.1, points: 0, matches: 0, selected: 0 },

  { id: "erz-elisha-owusu", name: "Elisha Owusu", club: "Erzurumspor FK", position: "MID", price: 6.2, points: 0, matches: 0, selected: 0 },
  { id: "erz-miguel-cardoso", name: "Miguel Cardoso", club: "Erzurumspor FK", position: "MID", price: 6.4, points: 0, matches: 0, selected: 0 },
  { id: "erz-brandon-baiye", name: "Brandon Baiye", club: "Erzurumspor FK", position: "MID", price: 5.3, points: 0, matches: 0, selected: 0 },
  { id: "erz-lawrence-agyekum", name: "Lawrence Agyekum", club: "Erzurumspor FK", position: "MID", price: 5.4, points: 0, matches: 0, selected: 0 },
  { id: "erz-martin-rodriguez", name: "Martín Rodríguez", club: "Erzurumspor FK", position: "MID", price: 5.7, points: 0, matches: 0, selected: 0 },
  { id: "erz-sefa-akgun", name: "Sefa Akgün", club: "Erzurumspor FK", position: "MID", price: 5.0, points: 0, matches: 0, selected: 0 },
  { id: "erz-emirhan-acar", name: "Emirhan Acar", club: "Erzurumspor FK", position: "MID", price: 4.6, points: 0, matches: 0, selected: 0 },
  { id: "erz-furkan-ozhan", name: "Furkan Özhan", club: "Erzurumspor FK", position: "MID", price: 4.8, points: 0, matches: 0, selected: 0 },

  { id: "erz-gyrano-kerk", name: "Gyrano Kerk", club: "Erzurumspor FK", position: "FWD", price: 6.8, points: 0, matches: 0, selected: 0 },
  { id: "erz-nariman-akhundzada", name: "Nariman Akhundzada", club: "Erzurumspor FK", position: "FWD", price: 6.2, points: 0, matches: 0, selected: 0 },
  { id: "erz-ibrahim-diabate", name: "Ibrahim Diabate", club: "Erzurumspor FK", position: "FWD", price: 6.1, points: 0, matches: 0, selected: 0 },
  { id: "erz-eren-tozlu", name: "Eren Tozlu", club: "Erzurumspor FK", position: "FWD", price: 5.8, points: 0, matches: 0, selected: 0 },
  { id: "erz-mustafa-fettahoglu", name: "Mustafa Fettahoğlu", club: "Erzurumspor FK", position: "FWD", price: 5.3, points: 0, matches: 0, selected: 0 },
  { id: "erz-fernando-andrade", name: "Fernando Andrade", club: "Erzurumspor FK", position: "FWD", price: 5.5, points: 0, matches: 0, selected: 0 },
];
