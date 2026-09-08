import Link from "next/link";
import { notFound } from "next/navigation";

const superLig=[
  ["Galatasaray",5,4,1,0,8,13,"#f2b51d","#a51c36"],["Fenerbahçe",5,4,1,0,7,13,"#ffdc19","#183c82"],["Beşiktaş",5,3,1,1,4,10,"#111827","#f7f7f7"],["Trabzonspor",5,2,2,1,2,8,"#7b233d","#64b5d7"],["Başakşehir",5,2,1,2,1,7,"#f47a20","#163557"],["Samsunspor",5,2,1,2,0,7,"#d9222a","#ffffff"],["Göztepe",5,1,2,2,-1,5,"#f4d116","#d3232a"],["Konyaspor",5,1,1,3,-3,4,"#137a3d","#ffffff"]
] as const;
const champions=[
  ["Real Madrid",5,4,1,0,9,13,"#ffffff","#caa53d"],["Manchester City",5,4,0,1,7,12,"#6cabdd","#ffffff"],["Bayern Münih",5,3,1,1,6,10,"#d71920","#ffffff"],["Inter",5,3,1,1,5,10,"#1555a1","#111111"],["Barcelona",5,3,0,2,4,9,"#a50044","#004d98"],["PSG",5,2,1,2,2,7,"#0b2a55","#d71920"]
] as const;

export function generateStaticParams(){return [{slug:"super-lig"},{slug:"champions-league"}];}

export default async function LeaguePage({params}:{params:Promise<{slug:string}>}){
 const slug=(await params).slug;if(slug!=="super-lig"&&slug!=="champions-league")notFound();const isSuper=slug==="super-lig";const rows=isSuper?superLig:champions;const title=isSuper?"Trendyol Süper Lig":"UEFA Şampiyonlar Ligi";const country=isSuper?"TÜRKİYE":"AVRUPA";
 return <div className="ref-league-page"><section className="league-tabs-top"><Link className={isSuper?"active":""} href="/leagues/super-lig">Süper Lig</Link><Link className={!isSuper?"active":""} href="/leagues/champions-league">Şampiyonlar Ligi</Link><Link href="/leagues/europa-league">Avrupa Ligi</Link></section><section className="league-heading-ref"><div><span className="demo-chip">DEMO VERİ</span><p className="eyebrow">{country}</p><h1>{title}</h1></div><select aria-label="Sezon"><option>2026/27</option></select></section><section className="league-subtabs"><button className="active">Puan Durumu</button><button>Fikstür</button><button>Gol Krallığı</button></section><section className="standings-card-ref"><div className="standing-head"><span>#</span><span>Takım</span><span>O</span><span>G</span><span>B</span><span>M</span><span>AV</span><span>P</span></div>{rows.map((r,i)=><div className="standing-row" key={r[0]}><b>{i+1}</b><div className="standing-team"><span className="team-mark small" style={{background:`linear-gradient(135deg,${r[7]} 50%,${r[8]} 50%)`}}>{String(r[0]).slice(0,1)}</span><strong>{r[0]}</strong></div><span>{r[1]}</span><span>{r[2]}</span><span>{r[3]}</span><span>{r[4]}</span><span>{Number(r[5])>0?`+${r[5]}`:r[5]}</span><strong>{r[6]}</strong></div>)}</section></div>
}
