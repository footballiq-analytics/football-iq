"use client";
import {useEffect,useState} from "react";
import {selectTrainingNews,trainingNewsStale,type TrainingNews} from "@/lib/training-news";
const labels={team:"Takım haberi",individual:"Takımdan ayrı çalışma",full:"Takımla çalışma",partial:"Kısmi katılım",absent:"Antrenmana katılmadı"};
export default function PlayerTrainingNews({playerId,club}:{playerId:string;club:string}){
 const [state,setState]=useState<{key:string;rows:TrainingNews[];error?:boolean}>({key:"",rows:[]});
 const key=playerId+"|"+club;
 useEffect(()=>{
  const controller=new AbortController();
  fetch(`${process.env.NEXT_PUBLIC_BASE_PATH??""}/data/training-news.json`,{cache:"no-store",signal:controller.signal})
   .then(r=>{if(!r.ok)throw Error();return r.json()})
   .then(data=>{if(data.schemaVersion!==1||!Array.isArray(data.records))throw Error();if(!controller.signal.aborted)setState({key,rows:selectTrainingNews(data,playerId,club)})})
   .catch(()=>{if(!controller.signal.aborted)setState({key,rows:[],error:true})});
  return()=>controller.abort();
 },[playerId,club,key]);
 const rows=state.key===key?state.rows:[],personal=rows.filter(r=>r.playerId),team=rows.filter(r=>!r.playerId).slice(0,1);
 return <section className="fiq-training-news" aria-label="Antrenman haberleri"><h3>Antrenman haberleri</h3>
 <p>Kaynak kontrolü: 5 Ekim 2026 · Haberlerden elle derlenmiştir; otomatik haber takibi değildir.</p>
 {state.key!==key?<p role="status">Haberler yükleniyor…</p>:state.error?<p role="status">Haber kaydına ulaşılamadı.</p>:<>
 {!personal.length?<p>Bu oyuncu için doğrulanmış bireysel antrenman haberi bulunmuyor.</p>:null}
 {[...personal,...team].map(r=><article key={r.id}><strong>{labels[r.status]}</strong><small>{r.reportDate.split("-").reverse().join(".")} · {r.publisher}</small><p>{r.summary}</p>{trainingNewsStale(r)?<small className="fiq-news-age">72 saatten eski kayıt · güncel durum teyit edilmeli</small>:null}<a href={r.source} target="_blank" rel="noopener noreferrer">Haberi oku ↗</a></article>)}
 {!rows.length?<p>Bu takım için de henüz kontrol edilmiş bir haber eklenmedi.</p>:null}
 </>}
 <p>Takım haberi, bu oyuncunun katıldığını kanıtlamaz. Kayıtlar maç öncesindeki son antrenman garantisi veya performans puanı değildir; tek başına kadro önerisini değiştirmez.</p>
 </section>;
}
