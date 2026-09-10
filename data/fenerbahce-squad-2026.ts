import type { FantasyPlayer, PlayerPosition } from "@/components/fantasy/PlayerCard";

export type FenerbahceDetailedPosition = "GK" | "CB" | "LB" | "RB" | "CDM" | "CM" | "CAM" | "RW" | "LW" | "ST";

export type FenerbahceFantasyPlayer = FantasyPlayer & {
  detailedPosition: FenerbahceDetailedPosition;
  nationality: string;
  footballIQ: number;
  dataStatus: "uefa-2026-27";
};

const coarse = (position: FenerbahceDetailedPosition): PlayerPosition =>
  position === "GK" ? "GK" : ["CB", "LB", "RB"].includes(position) ? "DEF" : ["CDM", "CM", "CAM"].includes(position) ? "MID" : "FWD";

const p = (id:string,name:string,detailedPosition:FenerbahceDetailedPosition,nationality:string,price:number,footballIQ:number):FenerbahceFantasyPlayer => ({
  id,
  name,
  club:"Fenerbahçe",
  position:coarse(detailedPosition),
  detailedPosition,
  nationality,
  price,
  footballIQ,
  points:0,
  matches:0,
  selected:0,
  dataStatus:"uefa-2026-27"
});

// UEFA Champions League 2026/27 squad foundation. Live fantasy points/popularity stay at 0 until a provider is connected.
export const FENERBAHCE_FANTASY_PLAYERS: FenerbahceFantasyPlayer[] = [
  p("fb-tarik-cetin","Tarık Çetin","GK","Türkiye",4.0,73),
  p("fb-ederson","Ederson","GK","Brezilya",8.5,91),
  p("fb-mert-gunok","Mert Günok","GK","Türkiye",5.5,84),
  p("fb-kuzey-sapaz","Kuzey Sapaz","GK","Türkiye",3.5,66),
  p("fb-yasir-cakli","Yasir Çaklı","GK","Türkiye",3.5,64),

  p("fb-yigit-efe-demir","Yiğit Efe Demir","CB","Türkiye",4.0,71),
  p("fb-nathan-ake","Nathan Aké","CB","Hollanda",9.0,90),
  p("fb-mert-muldur","Mert Müldür","RB","Türkiye",6.5,81),
  p("fb-kojo-peprah-oppong","Kojo Peprah Oppong","CB","Gana",4.5,72),
  p("fb-nelson-semedo","Nélson Semedo","RB","Portekiz",7.5,83),
  p("fb-milan-skriniar","Milan Škriniar","CB","Slovakya",8.5,89),
  p("fb-ognjen-mimovic","Ognjen Mimović","RB","Sırbistan",5.5,76),
  p("fb-cagan-saridikmen","Çağan Sarıdikmen","CB","Türkiye",3.5,65),
  p("fb-bedirhan-korkmaz","Bedirhan Korkmaz","CB","Türkiye",3.5,64),
  p("fb-gokmen-ozdemir","Gökmen Özdemir","CB","Türkiye",3.5,64),

  p("fb-archie-brown","Archie Brown","LB","İngiltere",6.5,78),
  p("fb-ismail-yuksek","İsmail Yüksek","CDM","Türkiye",7.0,85),
  p("fb-matteo-guendouzi","Mattéo Guendouzi","CM","Fransa",8.5,88),
  p("fb-irfan-can-kahveci","İrfan Can Kahveci","CAM","Türkiye",7.5,87),
  p("fb-levent-mercan","Levent Mercan","LB","Almanya",5.0,76),
  p("fb-bartug-elmaz","Bartuğ Elmaz","CDM","Türkiye",4.5,74),
  p("fb-oguz-aydin","Oğuz Aydın","RW","Türkiye",7.5,82),
  p("fb-adnan-fettahoglu","Adnan Fettahoğlu","CM","Türkiye",3.5,65),
  p("fb-emin-sayar","Emin Sayar","CM","Türkiye",3.5,64),
  p("fb-guner-ekici","Güner Ekici","CAM","Türkiye",3.5,65),
  p("fb-emirhan-ates","Emirhan Ateş","CM","Türkiye",3.5,65),
  p("fb-ngolo-kante","N'Golo Kanté","CDM","Fransa",9.0,96),

  p("fb-kerem-akturkoglu","Kerem Aktürkoğlu","LW","Türkiye",9.5,87),
  p("fb-romelu-lukaku","Romelu Lukaku","ST","Belçika",10.5,90),
  p("fb-marco-asensio","Marco Asensio","CAM","İspanya",9.5,92),
  p("fb-mason-greenwood","Mason Greenwood","RW","İngiltere",10.0,87),
  p("fb-vedat-muriqi","Vedat Muriqi","ST","Kosova",8.5,86),
  p("fb-dorgeles-nene","Dorgeles Nene","RW","Mali",7.0,79),
  p("fb-alaettin-ekici","Alaettin Ekici","ST","Türkiye",3.5,65)
];
