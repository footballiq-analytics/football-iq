import Link from "next/link";
import { notFound } from "next/navigation";
import { dataProvider } from "@/lib/data-provider";
import { FormDots, TeamMark } from "@/components/ui";

export function generateStaticParams(){return [{musabaka:"fenerbahce-galatasaray"},{musabaka:"besiktas-trabzonspor"},{musabaka:"real-madrid-manchester-city"}];}

export default async function MatchPage({params}:{params:Promise<{musabaka:string}>}){
 const match=await dataProvider.getMatch((await params).musabaka);if(!match)notFound();const p=match.prediction;
 return <div className="ref-match-page"><div className="match-topbar"><Link href="/today">←</Link><h1>Maç Detayı</h1><span className="demo-chip">DEMO VERİ</span></div>
 <section className="match-score-hero"><p>{match.leagueId==="super-lig"?"Trendyol Süper Lig":"UEFA Şampiyonlar Ligi"} · 5. Hafta</p><div className="match-score-row"><div><TeamMark team={match.home}/><strong>{match.home.name}</strong></div><section><span>{match.kickoff}</span><b>VS</b><small>{match.dateLabel}</small></section><div><TeamMark team={match.away}/><strong>{match.away.name}</strong></div></div></section>
 <section className="match-tabs-ref"><button className="active">Genel</button><button>İstatistik</button><button>Kadrolar</button><button>Analiz</button></section>
 <section className="match-analysis-grid"><article className="analysis-card-ref wide"><div className="ref-section-heading"><div><p className="eyebrow">MAÇ ÖNCESİ ANALİZ</p><h2>1 - X - 2 Olasılıkları</h2></div><span>Tahmin, kesin sonuç değildir</span></div><Probability label={match.home.shortName} value={p.probabilities.home}/><Probability label="Beraberlik" value={p.probabilities.draw}/><Probability label={match.away.shortName} value={p.probabilities.away}/></article>
 <article className="analysis-card-ref score-pred"><p className="eyebrow">TAHMİNİ SKOR</p><strong>{p.predictedScore}</strong><span>Model güveni %{p.confidence.score}</span></article>
 <article className="analysis-card-ref metric-ref"><p>KG Var</p><strong>%{p.probabilities.btts}</strong><span>olasılık</span></article><article className="analysis-card-ref metric-ref"><p>2.5 Üst</p><strong>%{p.probabilities.over25}</strong><span>olasılık</span></article>
 <article className="analysis-card-ref form-ref"><p className="eyebrow">SON 5 MAÇ</p><div className="form-team"><span>{match.home.name}</span><FormDots team={match.home}/></div><div className="form-team"><span>{match.away.name}</span><FormDots team={match.away}/></div></article></section></div>
}
function Probability({label,value}:{label:string;value:number}){return <div className="prob-ref"><div><span>{label}</span><b>%{value}</b></div><i><span style={{width:`${value}%`}}/></i></div>}
