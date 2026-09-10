import type { FantasyPlayer, PlayerPosition } from "@/components/fantasy/PlayerCard";

export type TrabzonsporDetailedPosition = "GK" | "CB" | "LB" | "RB" | "CDM" | "CM" | "CAM" | "RW" | "LW" | "ST";

export type TrabzonsporFantasyPlayer = FantasyPlayer & {
  id: string;
  detailedPosition: TrabzonsporDetailedPosition;
  nationality: string;
  shirtNumber: number;
  footballIQ: number;
  dataStatus: "uefa-superlig-2026-27";
};

const coarse = (position: TrabzonsporDetailedPosition): PlayerPosition =>
  position === "GK" ? "GK" : ["CB", "LB", "RB"].includes(position) ? "DEF" : ["CDM", "CM", "CAM"].includes(position) ? "MID" : "FWD";

const p = (id:string,name:string,detailedPosition:TrabzonsporDetailedPosition,nationality:string,shirtNumber:number,price:number,footballIQ:number):TrabzonsporFantasyPlayer => ({
  id,
  name,
  club:"Trabzonspor",
  position:coarse(detailedPosition),
  detailedPosition,
  nationality,
  shirtNumber,
  price,
  footballIQ,
  points:0,
  matches:0,
  selected:0,
  dataStatus:"uefa-superlig-2026-27"
});

// UEFA 2026/27 Turkish Super League squad foundation. Fantasy points/popularity stay at 0 until the live provider is connected.
export const TRABZONSPOR_FANTASY_PLAYERS: TrabzonsporFantasyPlayer[] = [
  p("ts-ahmet-dogan-yildirim","Ahmet Doğan Yıldırım","GK","Türkiye",1,4.0,70),
  p("ts-andre-onana","André Onana","GK","Kamerun",24,8.5,88),
  p("ts-onuralp-cevikkan","Onuralp Çevikkan","GK","Türkiye",25,4.0,71),
  p("ts-erol-can-colak","Erol Can Çolak","GK","Türkiye",96,3.5,66),

  p("ts-samet-akaydin","Samet Akaydin","CB","Türkiye",4,6.0,80),
  p("ts-stefan-savic","Stefan Savić","CB","Karadağ",15,7.5,89),
  p("ts-mustafa-eskihellac","Mustafa Eskihellaç","LB","Türkiye",19,6.0,79),
  p("ts-wagner-pina","Wagner Pina","RB","Yeşil Burun Adaları",20,6.5,78),
  p("ts-chibuike-nwaiwu","Chibuike Nwaiwu","CB","Nijerya",27,6.5,78),
  p("ts-cenk-ozkacar","Cenk Özkacar","CB","Türkiye",39,6.5,81),
  p("ts-arsenii-batahov","Arsenii Batahov","CB","Ukrayna",44,6.5,80),
  p("ts-sidny-lopes-cabral","Sidny Lopes Cabral","RB","Yeşil Burun Adaları",55,6.0,77),

  p("ts-goktan-gurpuz","Göktan Gürpüz","CAM","Türkiye",2,5.0,76),
  p("ts-john-lundstram","John Lundstram","CDM","İngiltere",3,6.0,84),
  p("ts-okay-yokuslu","Okay Yokuşlu","CDM","Türkiye",5,7.0,87),
  p("ts-fabinho","Fabinho","CDM","Brezilya",6,8.5,94),
  p("ts-ernest-muci","Ernest Muçi","CAM","Arnavutluk",7,8.0,84),
  p("ts-benjamin-bouchouari","Benjamin Bouchouari","CM","Fas",8,7.0,85),
  p("ts-ozan-tufan","Ozan Tufan","CM","Türkiye",11,7.0,83),
  p("ts-ruslan-malinovskyi","Ruslan Malinovskyi","CAM","Ukrayna",17,8.0,89),
  p("ts-tim-jabol-folcarelli","Tim Jabol-Folcarelli","CM","Fransa",26,6.5,80),
  p("ts-melih-kabasakal","Melih Kabasakal","CDM","Türkiye",57,5.0,77),
  p("ts-aral-simsir","Aral Şimşir","LW","Türkiye",58,7.5,83),

  p("ts-denis-dragus","Denis Drăguş","ST","Romanya",89,7.5,81),
  p("ts-franculino-dju","Franculino Djú","ST","Gine-Bissau",9,8.5,84),
  p("ts-mohamed-salah","Mohamed Salah","RW","Mısır",10,11.5,96),
  p("ts-umut-nayir","Umut Nayir","ST","Türkiye",14,6.0,80),
  p("ts-paul-onuachu","Paul Onuachu","ST","Nijerya",30,9.0,86),
  p("ts-rene-mitongo","René Mitongo","ST","Belçika",49,4.0,69),
  p("ts-noah-saviolo","Noah Saviolo","RW","Portekiz",70,6.5,78),
  p("ts-metehan-mimaroglu","Metehan Mimaroğlu","LW","Türkiye",77,5.5,77),
  p("ts-ali-habesoglu","Ali Habeşoğlu","ST","Türkiye",99,4.0,70)
];
