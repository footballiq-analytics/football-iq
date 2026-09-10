import type { FantasyPlayer, PlayerPosition } from "@/components/fantasy/PlayerCard";

export type BesiktasDetailedPosition = "GK" | "CB" | "LB" | "RB" | "CDM" | "CM" | "CAM" | "RW" | "LW" | "ST";

export type BesiktasFantasyPlayer = FantasyPlayer & {
  detailedPosition: BesiktasDetailedPosition;
  shirtNumber: number;
  footballIQ: number;
  dataStatus: "official-roster";
};

const coarse = (position: BesiktasDetailedPosition): PlayerPosition =>
  position === "GK" ? "GK" : ["CB", "LB", "RB"].includes(position) ? "DEF" : ["CDM", "CM", "CAM"].includes(position) ? "MID" : "FWD";

const p = (id:string,name:string,detailedPosition:BesiktasDetailedPosition,shirtNumber:number,price:number,footballIQ:number):BesiktasFantasyPlayer => ({
  id,
  name,
  club:"Beşiktaş",
  position:coarse(detailedPosition),
  detailedPosition,
  shirtNumber,
  price,
  footballIQ,
  points:0,
  matches:0,
  selected:0,
  dataStatus:"official-roster"
});

// Current Beşiktaş A-team foundation from the club's official A-team roster page.
// Fantasy points/popularity intentionally stay at 0 until the live data provider is connected.
export const BESIKTAS_FANTASY_PLAYERS: BesiktasFantasyPlayer[] = [
  p("bjk-alexander-nubel","Alexander Nübel","GK",1,7.5,84),
  p("bjk-dogan-alemdar","Doğan Alemdar","GK",80,5.0,76),
  p("bjk-emir-yasar","Emir Yaşar","GK",96,3.5,65),

  p("bjk-ridvan-yilmaz","Rıdvan Yılmaz","LB",33,7.0,80),
  p("bjk-emirhan-topcu","Emirhan Topçu","CB",53,6.5,80),
  p("bjk-taylan-bulut","Taylan Bulut","RB",22,6.0,77),
  p("bjk-tiago-djalo","Tiago Djaló","CB",35,7.5,81),
  p("bjk-cumali-gursel","Cumali Gürsel","CB",65,3.5,66),
  p("bjk-yasin-ozcan","Yasin Özcan","CB",58,5.5,76),
  p("bjk-emmanuel-agbadou","Emmanuel Agbadou","CB",12,8.0,83),
  p("bjk-amir-murillo","Amir Murillo","RB",62,6.5,79),
  p("bjk-mustafa-azem-yortac","Mustafa Azem Yortaç","CB",63,3.5,65),
  p("bjk-kassoum-ouattara","Kassoum Ouattara","LB",11,6.5,78),
  p("bjk-umit-akdag","Ümit Akdağ","CB",50,5.0,75),

  p("bjk-kartal-kayra-yilmaz","Kartal Kayra Yılmaz","CDM",8,5.5,80),
  p("bjk-milot-rashica","Milot Rashica","RW",7,7.5,82),
  p("bjk-orkun-kokcu","Orkun Kökçü","CM",10,10.0,92),
  p("bjk-wilfred-ndidi","Wilfred Ndidi","CDM",4,8.0,87),
  p("bjk-vaclav-cerny","Václav Černý","RW",18,8.5,85),
  p("bjk-ozan-sevim","Ozan Sevim","CM",66,3.5,66),
  p("bjk-junior-olaitan","Junior Olaitan","CAM",15,6.5,80),
  p("bjk-ilhan-fakili","İlhan Fakılı","CM",29,3.5,65),
  p("bjk-salih-ozcan","Salih Özcan","CDM",6,7.0,86),
  p("bjk-leandro-trossard","Leandro Trossard","LW",19,9.5,89),
  p("bjk-ernest-poku","Ernest Poku","RW",17,6.5,77),
  p("bjk-fabio-miretti","Fabio Miretti","CM",21,7.5,85),

  p("bjk-semih-kilicsoy","Semih Kılıçsoy","ST",90,7.5,81),
  p("bjk-mustafa-erhan-hekimoglu","Mustafa Erhan Hekimoğlu","ST",23,5.0,74),
  p("bjk-ahmet-sami-bircan","Ahmet Sami Bircan","ST",70,3.5,65),
  p("bjk-hyeongyu-oh","Hyeongyu Oh","ST",9,8.0,82),
  p("bjk-dusan-vlahovic","Dušan Vlahović","ST",28,11.0,89)
];
