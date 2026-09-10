import type { Player as StorePlayer } from "@/store/useTeamStore";

/**
 * Çorum FK 2026/27 A takım oyuncu havuzu.
 * Güncel kadro; kulüp/lig kayıtları ve son transfer duyuruları çapraz kontrol edilerek oluşturuldu.
 * Canlı fantasy sağlayıcısı bağlanana kadar points, matches ve selected alanları 0 tutulur.
 * Fiyatlar FUTBOL IQ editoryal başlangıç değerleridir.
 */
export const CORUM_FANTASY_PLAYERS: StorePlayer[] = [
  { id: "cor-marcos-felipe", name: "Marcos Felipe", club: "Çorum FK", position: "GK", price: 4.8, points: 0, matches: 0, selected: 0 },
  { id: "cor-erhan-erenturk", name: "Erhan Erentürk", club: "Çorum FK", position: "GK", price: 4.2, points: 0, matches: 0, selected: 0 },
  { id: "cor-arif-simsir", name: "Arif Şimşir", club: "Çorum FK", position: "GK", price: 3.8, points: 0, matches: 0, selected: 0 },

  { id: "cor-andrei-borza", name: "Andrei Borza", club: "Çorum FK", position: "DEF", price: 5.4, points: 0, matches: 0, selected: 0 },
  { id: "cor-alexandre-penetra", name: "Alexandre Penetra", club: "Çorum FK", position: "DEF", price: 5.3, points: 0, matches: 0, selected: 0 },
  { id: "cor-berkay-ari", name: "Berkay Arı", club: "Çorum FK", position: "DEF", price: 4.2, points: 0, matches: 0, selected: 0 },
  { id: "cor-gokhan-sazdagi", name: "Gökhan Sazdağı", club: "Çorum FK", position: "DEF", price: 5.1, points: 0, matches: 0, selected: 0 },
  { id: "cor-hrvoje-smolcic", name: "Hrvoje Smolčić", club: "Çorum FK", position: "DEF", price: 5.5, points: 0, matches: 0, selected: 0 },
  { id: "cor-serdar-saatci", name: "Serdar Saatçı", club: "Çorum FK", position: "DEF", price: 5.0, points: 0, matches: 0, selected: 0 },
  { id: "cor-taha-ibrahim-rencber", name: "Taha İbrahim Rençber", club: "Çorum FK", position: "DEF", price: 3.9, points: 0, matches: 0, selected: 0 },
  { id: "cor-arda-sengul", name: "Arda Şengül", club: "Çorum FK", position: "DEF", price: 4.6, points: 0, matches: 0, selected: 0 },
  { id: "cor-cemali-sertel", name: "Cemali Sertel", club: "Çorum FK", position: "DEF", price: 4.8, points: 0, matches: 0, selected: 0 },
  { id: "cor-joseph-attamah", name: "Joseph Attamah", club: "Çorum FK", position: "DEF", price: 5.0, points: 0, matches: 0, selected: 0 },
  { id: "cor-sinan-osmanoglu", name: "Sinan Osmanoğlu", club: "Çorum FK", position: "DEF", price: 4.5, points: 0, matches: 0, selected: 0 },
  { id: "cor-caglar-soyuncu", name: "Çağlar Söyüncü", club: "Çorum FK", position: "DEF", price: 6.2, points: 0, matches: 0, selected: 0 },

  { id: "cor-berat-ozdemir", name: "Berat Özdemir", club: "Çorum FK", position: "MID", price: 6.1, points: 0, matches: 0, selected: 0 },
  { id: "cor-hasan-abdulkareem-sayyid", name: "Hasan Abdulkareem Sayyid", club: "Çorum FK", position: "MID", price: 5.0, points: 0, matches: 0, selected: 0 },
  { id: "cor-kenan-fakili", name: "Kenan Fakılı", club: "Çorum FK", position: "MID", price: 4.6, points: 0, matches: 0, selected: 0 },
  { id: "cor-markus-karlsbakk", name: "Markus Karlsbakk", club: "Çorum FK", position: "MID", price: 5.6, points: 0, matches: 0, selected: 0 },
  { id: "cor-ylber-ramadani", name: "Ylber Ramadani", club: "Çorum FK", position: "MID", price: 6.5, points: 0, matches: 0, selected: 0 },
  { id: "cor-pedrinho", name: "Pedrinho", club: "Çorum FK", position: "MID", price: 6.2, points: 0, matches: 0, selected: 0 },
  { id: "cor-fredy", name: "Fredy", club: "Çorum FK", position: "MID", price: 5.4, points: 0, matches: 0, selected: 0 },
  { id: "cor-ferhat-yazgan", name: "Ferhat Yazgan", club: "Çorum FK", position: "MID", price: 4.6, points: 0, matches: 0, selected: 0 },
  { id: "cor-ahmed-ildiz", name: "Ahmed Ildız", club: "Çorum FK", position: "MID", price: 5.3, points: 0, matches: 0, selected: 0 },
  { id: "cor-atakan-akkaynak", name: "Atakan Akkaynak", club: "Çorum FK", position: "MID", price: 5.1, points: 0, matches: 0, selected: 0 },
  { id: "cor-danijel-aleksic", name: "Danijel Aleksić", club: "Çorum FK", position: "MID", price: 6.6, points: 0, matches: 0, selected: 0 },
  { id: "cor-atakan-cangoz", name: "Atakan Cangöz", club: "Çorum FK", position: "MID", price: 4.7, points: 0, matches: 0, selected: 0 },
  { id: "cor-eren-karadag", name: "Eren Karadağ", club: "Çorum FK", position: "MID", price: 5.0, points: 0, matches: 0, selected: 0 },
  { id: "cor-mohamed-diomande", name: "Mohamed Diomande", club: "Çorum FK", position: "MID", price: 7.2, points: 0, matches: 0, selected: 0 },
  { id: "cor-cengiz-under", name: "Cengiz Ünder", club: "Çorum FK", position: "MID", price: 7.5, points: 0, matches: 0, selected: 0 },
  { id: "cor-alexandros-kyziridis", name: "Alexandros Kyziridis", club: "Çorum FK", position: "MID", price: 6.4, points: 0, matches: 0, selected: 0 },

  { id: "cor-emircan-gurluk", name: "Emircan Gürlük", club: "Çorum FK", position: "FWD", price: 5.4, points: 0, matches: 0, selected: 0 },
  { id: "cor-hasan-ege-akdogan", name: "Hasan Ege Akdoğan", club: "Çorum FK", position: "FWD", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "cor-huseyin-bulut", name: "Hüseyin Bulut", club: "Çorum FK", position: "FWD", price: 4.9, points: 0, matches: 0, selected: 0 },
  { id: "cor-jesus-ramirez", name: "Jesús Ramírez", club: "Çorum FK", position: "FWD", price: 6.0, points: 0, matches: 0, selected: 0 },
  { id: "cor-polat-abay", name: "Polat Abay", club: "Çorum FK", position: "FWD", price: 4.3, points: 0, matches: 0, selected: 0 },
  { id: "cor-semih-akyildiz", name: "Semih Akyıldız", club: "Çorum FK", position: "FWD", price: 4.6, points: 0, matches: 0, selected: 0 },
  { id: "cor-mame-thiam", name: "Mame Thiam", club: "Çorum FK", position: "FWD", price: 7.4, points: 0, matches: 0, selected: 0 },
  { id: "cor-geraldo", name: "Geraldo", club: "Çorum FK", position: "FWD", price: 5.8, points: 0, matches: 0, selected: 0 },
  { id: "cor-burak-coban", name: "Burak Çoban", club: "Çorum FK", position: "FWD", price: 5.0, points: 0, matches: 0, selected: 0 },
  { id: "cor-youssoufa-moukoko", name: "Youssoufa Moukoko", club: "Çorum FK", position: "FWD", price: 8.2, points: 0, matches: 0, selected: 0 },
];
