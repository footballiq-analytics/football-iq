import type { FantasyPlayer, PlayerPosition } from "@/components/fantasy/PlayerCard";

export type DetailedPosition = "GK" | "CB" | "LB" | "RB" | "CDM" | "CM" | "CAM" | "RW" | "LW" | "ST";

export type GalatasarayFantasyPlayer = FantasyPlayer & {
  detailedPosition: DetailedPosition;
  nationality: string;
  footballIQ: number;
  dataStatus: "official-roster";
};

const coarse = (position: DetailedPosition): PlayerPosition =>
  position === "GK" ? "GK" : ["CB", "LB", "RB"].includes(position) ? "DEF" : ["CDM", "CM", "CAM"].includes(position) ? "MID" : "FWD";

const p = (id:string,name:string,detailedPosition:DetailedPosition,nationality:string,price:number,footballIQ:number):GalatasarayFantasyPlayer => ({
  id,
  name,
  club:"Galatasaray",
  position:coarse(detailedPosition),
  detailedPosition,
  nationality,
  price,
  footballIQ,
  points:0,
  matches:0,
  selected:0,
  dataStatus:"official-roster"
});

// 2026/27 current squad foundation. Real fantasy points/popularity stay at 0 until the live data provider is connected.
export const GALATASARAY_FANTASY_PLAYERS: GalatasarayFantasyPlayer[] = [
  p("gs-ugurcan-cakir","Uğurcan Çakır","GK","Türkiye",7.5,84),
  p("gs-gunay-guvenc","Günay Güvenç","GK","Türkiye",4.5,78),
  p("gs-jankat-yilmaz","Jankat Yılmaz","GK","Türkiye",4.0,70),
  p("gs-enes-emre-buyuk","Enes Emre Büyük","GK","Türkiye",3.5,66),
  p("gs-abdulkerim-bardakci","Abdülkerim Bardakcı","CB","Türkiye",8.0,86),
  p("gs-davinson-sanchez","Davinson Sánchez","CB","Kolombiya",9.0,85),
  p("gs-el-chadaille-bitshiabu","El-Chadaille Bitshiabu","CB","Fransa",7.0,77),
  p("gs-eren-elmali","Eren Elmalı","LB","Türkiye",6.5,79),
  p("gs-ismail-jakobs","Ismail Jakobs","LB","Senegal",7.0,80),
  p("gs-roland-sallai","Roland Sallai","RW","Macaristan",7.5,82),
  p("gs-wilfried-singo","Wilfried Singo","RB","Fildişi Sahili",9.5,82),
  p("gs-aleksey-batrakov","Aleksey Batrakov","CAM","Rusya",9.0,90),
  p("gs-gabriel-sara","Gabriel Sara","CM","Brezilya",9.0,88),
  p("gs-ilkay-gundogan","İlkay Gündoğan","CM","Almanya",8.5,96),
  p("gs-mario-lemina","Mario Lemina","CDM","Gabon",7.0,87),
  p("gs-lucas-torreira","Lucas Torreira","CDM","Uruguay",9.0,91),
  p("gs-renato-nhaga","Renato Nhaga","CM","Gine-Bissau",5.0,73),
  p("gs-lesley-ugochukwu","Lesley Ugochukwu","CDM","Fransa",7.5,80),
  p("gs-yunus-akgun","Yunus Akgün","RW","Türkiye",9.0,87),
  p("gs-victor-osimhen","Victor Osimhen","ST","Nijerya",12.0,91),
  p("gs-baris-alper-yilmaz","Barış Alper Yılmaz","LW","Türkiye",9.5,84),
  p("gs-rafael-leao","Rafael Leão","LW","Portekiz",11.5,89),
  p("gs-leroy-sane","Leroy Sané","RW","Almanya",10.5,88),
  p("gs-deniz-gul","Deniz Gül","ST","Türkiye",6.5,76)
];
