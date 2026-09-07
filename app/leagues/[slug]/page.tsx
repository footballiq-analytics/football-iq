import Link from "next/link";
import { notFound } from "next/navigation";
import { dataProvider } from "@/lib/data-provider";
import { TeamMark } from "@/components/ui";

export default async function LeaguePage({params}:{params:Promise<{slug:"super-lig"|"champions-league"}>}){
 const slug=(await params).slug;const league=(await dataProvider.getLeagues()).find(l=>l.id===slug);if(!league)notFound();const standings=await dataProvider.getStandings(slug);
 return <div className="ref-league-page"><section className="league-tabs-top"><Link className={slug==="super-lig"?"active":""} href="/leagues/super-lig">Süper Lig</Link><Link className={slug==="champions-league"?"active":""} href="/leagues/champions-league">Şampiyonlar Ligi</Link><Link href="/leagues/europa-league">Avrupa Ligi</Link></section>
 <section className="league-heading-ref"><div><span className="demo-chip">DEMO VERİ</span><p className="eyebrow">{league.country.toUpperCase()}</p><h1>{league.name}</h1></div><select aria-label="Sezon"><option>{league.season}</option></select></section>
 <section className="league-subtabs"><button className="active">Puan Durumu</button><button>Fikstür</button><button>Gol Krallığı</button></section>
 <section className="standings-card-ref"><div className="standing-head"><span>#</span><span>Takım</span><span>O</span><span>G</span><span>B</span><span>M</span><span>AV</span><span>P</span></div>{standings.map((item,index)=>{const team=item.team;const played=team.stats.played;const wins=Math.max(0,Math.floor(item.points/3));const draws=Math.max(0,item.points-wins*3);const losses=Math.max(0,played-wins-draws);const gd=team.stats.goalsFor-team.stats.goalsAgainst;return <div className="standing-row" key={team.id}><b>{index+1}</b><div className="standing-team"><TeamMark team={team} small/><strong>{team.name}</strong></div><span>{played}</span><span>{wins}</span><span>{draws}</span><span>{losses}</span><span>{gd>0?`+${gd}`:gd}</span><strong>{item.points}</strong></div>})}</section></div>
}
