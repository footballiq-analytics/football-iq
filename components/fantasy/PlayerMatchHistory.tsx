"use client";
import {useEffect,useState} from "react";

// 3 October 2026, 00:00 in Istanbul: the user's requested starting date.
const SINCE=Date.parse("2026-10-03T00:00:00+03:00");
type Appearance={fixtureId:string;kickoff:string;minutes:number;week:number;home:string;away:string;homeGoals:number;awayGoals:number;rating?:number;goals?:number;assists?:number;source:string;verifiedAt:string;status:string};
const valid=(m:Appearance)=>m&&m.status==="finished"&&Number.isFinite(Date.parse(m.kickoff))&&Date.parse(m.kickoff)>=SINCE&&Date.parse(m.kickoff)<Date.now()&&Number.isFinite(m.minutes)&&m.minutes>=0&&m.minutes<=130&&Number.isInteger(m.homeGoals)&&Number.isInteger(m.awayGoals)&&typeof m.home==="string"&&typeof m.away==="string"&&/^https:\/\/www\.fotmob\.com\//.test(m.source);
const metric=(n:number|undefined,max:number)=>typeof n==="number"&&Number.isFinite(n)&&n>=0&&n<=max?n.toLocaleString('tr-TR',{maximumFractionDigits:2}):"—";
export default function PlayerMatchHistory({playerId}:{playerId:string}){
 const[state,setState]=useState<{id:string;rows:Appearance[];updated?:string;error?:boolean}>({id:"",rows:[]});
 useEffect(()=>{const controller=new AbortController();
  void fetch(`${process.env.NEXT_PUBLIC_BASE_PATH??""}/data/match-enrichment.json`,{cache:"no-store",signal:controller.signal}).then(async r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{
   if(data.schemaVersion!==2||!data.playerMatches)throw Error();
   const seen=new Set<string>();const rows=(Array.isArray(data.playerMatches[playerId])?data.playerMatches[playerId]:[]).filter((m:Appearance)=>{if(!valid(m)||seen.has(m.fixtureId))return false;seen.add(m.fixtureId);return true}).sort((a:Appearance,b:Appearance)=>Date.parse(b.kickoff)-Date.parse(a.kickoff));
   if(!controller.signal.aborted)setState({id:playerId,rows,updated:data.updatedAt});
  }).catch(()=>{if(!controller.signal.aborted)setState({id:playerId,rows:[],error:true})});return()=>controller.abort();
 },[playerId]);
 const loading=state.id!==playerId;
 return <section className="fiq-player-history" aria-label="Oyuncunun maç geçmişi"><h3>Maç geçmişi</h3><p>3 Ekim 2026’dan itibaren · Süper Lig · tamamlanan maçlar</p>
 {loading?<p role="status">Maç bilgileri yükleniyor…</p>:state.error?<p role="status">Maç verisine ulaşılamadı. Oyuncu bilgilerini yeniden açarak deneyebilirsin.</p>:<>
 {state.updated&&Number.isFinite(Date.parse(state.updated))?<p>Son kontrol: {new Date(state.updated).toLocaleString('tr-TR',{timeZone:'Europe/Istanbul'})}</p>:null}
 {!state.rows.length?<p>Bu tarihten sonra oyuncuyla eşleşen tamamlanmış maç kaydı henüz yok. Bu, oyuncunun puanının sıfır olduğu anlamına gelmez.</p>:state.rows.map(m=><article key={m.fixtureId}><strong>{m.home} {m.homeGoals}–{m.awayGoals} {m.away}</strong><small>{new Date(m.kickoff).toLocaleDateString('tr-TR',{timeZone:'Europe/Istanbul'})} · {m.week}. hafta</small><dl><div><dt>Dakika</dt><dd>{metric(m.minutes,130)}</dd></div><div><dt>Gol</dt><dd>{metric(m.goals,30)}</dd></div><div><dt>Asist</dt><dd>{metric(m.assists,30)}</dd></div><div><dt>FotMob notu / 10</dt><dd>{metric(m.rating,10)}</dd></div></dl><p>Fantezi puanı: veri bekleniyor</p><a href={m.source} target="_blank" rel="noopener noreferrer">Maç kaynağını aç ↗</a></article>)}
 <p>FotMob notu performans değerlendirmesidir. Resmî fantezi puanı kaynağı henüz bağlı değil. Veriler yaklaşık 3 saatte bir kontrol edilir; canlı maç takibi değildir.</p>
 </>}
 </section>;
}
