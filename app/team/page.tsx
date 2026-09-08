"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SUPER_LIG_CLUBS_2026_27, SUPER_LIG_DATA_META } from "@/data/superlig-2026";

type Position = "GK" | "DEF" | "MID" | "FWD";
type Formation = "4-3-3" | "3-4-3" | "3-5-2" | "5-3-2";
type Player = { id:number; name:string; club:string; position:Position; price:number; points:number; selected:number; };

const BUDGET = 100;
const STORAGE_KEY = "futbol-iq-fantasy-squad-v3";
const FORMATIONS:Formation[]=["4-3-3","3-4-3","3-5-2","5-3-2"];

const players:Player[]=[
{id:1,name:"Victor Osimhen",club:"Galatasaray",position:"FWD",price:11.5,points:78,selected:64},
{id:2,name:"Vlahović",club:"Beşiktaş",position:"FWD",price:11,points:71,selected:52},
{id:3,name:"En-Nesyri",club:"Fenerbahçe",position:"FWD",price:9.2,points:67,selected:47},
{id:4,name:"Rafa Silva",club:"Beşiktaş",position:"MID",price:8.6,points:63,selected:43},
{id:5,name:"Talisca",club:"Fenerbahçe",position:"MID",price:9,points:61,selected:41},
{id:6,name:"Torreira",club:"Galatasaray",position:"MID",price:7.4,points:58,selected:38},
{id:7,name:"Gedson",club:"Beşiktaş",position:"MID",price:7.2,points:56,selected:36},
{id:8,name:"Fred",club:"Fenerbahçe",position:"MID",price:7.8,points:55,selected:35},
{id:9,name:"Davinson Sánchez",club:"Galatasaray",position:"DEF",price:7.1,points:52,selected:34},
{id:10,name:"Svensson",club:"Beşiktaş",position:"DEF",price:5.9,points:49,selected:29},
{id:11,name:"Mert Müldür",club:"Fenerbahçe",position:"DEF",price:5.2,points:46,selected:26},
{id:12,name:"Abdülkerim Bardakcı",club:"Galatasaray",position:"DEF",price:6.5,points:50,selected:31},
{id:13,name:"Uğurcan Çakır",club:"Galatasaray",position:"GK",price:6.3,points:48,selected:33},
{id:14,name:"Mert Günok",club:"Beşiktaş",position:"GK",price:5.8,points:45,selected:28},
{id:15,name:"İrfan Can",club:"Fenerbahçe",position:"GK",price:5.2,points:42,selected:22},
{id:16,name:"Semih",club:"Beşiktaş",position:"FWD",price:6,points:44,selected:24},
{id:17,name:"Muçi",club:"Beşiktaş",position:"MID",price:6.2,points:43,selected:23},
{id:18,name:"Eren",club:"Trabzonspor",position:"DEF",price:4.8,points:41,selected:19},
{id:19,name:"Okay",club:"Trabzonspor",position:"MID",price:5.4,points:39,selected:18},
{id:20,name:"Onuachu",club:"Trabzonspor",position:"FWD",price:8.1,points:54,selected:27},
{id:21,name:"Muhammet",club:"Trabzonspor",position:"GK",price:5,points:36,selected:14},
{id:22,name:"Ali",club:"Konyaspor",position:"DEF",price:4.2,points:34,selected:12},
{id:23,name:"Burak",club:"Göztepe",position:"GK",price:4,points:33,selected:11},
{id:24,name:"Yusuf",club:"Samsunspor",position:"DEF",price:4.1,points:35,selected:13},
{id:25,name:"Kerem",club:"İstanbul Başakşehir FK",position:"MID",price:4.3,points:37,selected:15},
{id:26,name:"Deniz",club:"Kasımpaşa",position:"FWD",price:4.5,points:38,selected:16},
];

const formationRows:Record<Formation,number[]>={
  "4-3-3":[3,3,4,1],
  "3-4-3":[3,4,3,1],
  "3-5-2":[2,5,3,1],
  "5-3-2":[2,3,5,1],
};
const initialLineup:(number|null)[]=[1,2,3,4,6,8,9,10,18,22,21];
const initialBench:(number|null)[]=[23,24,25,26];

export default function TeamBuilderPage(){
 const [formation,setFormation]=useState<Formation>("4-3-3");
 const [formationOpen,setFormationOpen]=useState(false);
 const [lineup,setLineup]=useState<(number|null)[]>(initialLineup);
 const [bench,setBench]=useState<(number|null)[]>(initialBench);
 const [captain,setCaptain]=useState<number|null>(1);
 const [vice,setVice]=useState<number|null>(2);
 const [query,setQuery]=useState("");
 const [filter,setFilter]=useState<"ALL"|Position>("ALL");
 const [clubFilter,setClubFilter]=useState("ALL");
 const [message,setMessage]=useState("2026-27 Süper Lig kulüp listesi güncel. Oyuncu fiyat/puanları fantasy demo verisidir.");
 const [hydrated,setHydrated]=useState(false);

 useEffect(()=>{try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){const saved=JSON.parse(raw);setFormation(saved.formation??"4-3-3");setLineup(saved.lineup??initialLineup);setBench(saved.bench??initialBench);setCaptain(saved.captain??1);setVice(saved.vice??2)}}finally{setHydrated(true)}},[]);
 useEffect(()=>{if(hydrated)localStorage.setItem(STORAGE_KEY,JSON.stringify({formation,lineup,bench,captain,vice}))},[hydrated,formation,lineup,bench,captain,vice]);

 const selected=[...lineup,...bench].filter((id):id is number=>id!==null);
 const selectedPlayers=selected.map(id=>players.find(p=>p.id===id)!).filter(Boolean);
 const spent=selectedPlayers.reduce((s,p)=>s+p.price,0);
 const remaining=BUDGET-spent;
 const filtered=useMemo(()=>players.filter(p=>(filter==="ALL"||p.position===filter)&&(clubFilter==="ALL"||p.club===clubFilter)&&`${p.name} ${p.club}`.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr"))),[filter,clubFilter,query]);
 const clubCount=(club:string)=>selectedPlayers.filter(p=>p.club===club).length;

 function remove(id:number){setLineup(v=>v.map(x=>x===id?null:x));setBench(v=>v.map(x=>x===id?null:x));if(captain===id)setCaptain(null);if(vice===id)setVice(null);setMessage(`${players.find(p=>p.id===id)?.name} çıkarıldı; saha pozisyonu korunuyor.`)}
 function add(player:Player){
  if(selected.includes(player.id))return remove(player.id);
  if(clubCount(player.club)>=3)return setMessage(`${player.club} için 3 oyuncu sınırına ulaştın.`);
  if(remaining<player.price)return setMessage("Bu oyuncu için kalan bütçe yeterli değil.");
  const lineSlot=lineup.findIndex(x=>x===null);if(lineSlot>=0){setLineup(v=>v.map((x,i)=>i===lineSlot?player.id:x));return setMessage(`${player.name} ilk 11'e eklendi.`)}
  const benchSlot=bench.findIndex(x=>x===null);if(benchSlot>=0){setBench(v=>v.map((x,i)=>i===benchSlot?player.id:x));return setMessage(`${player.name} yedek kulübesine eklendi.`)}
  setMessage("Kadro dolu. Önce bir oyuncu çıkarmalısın.");
 }
 function role(id:number){if(captain!==id){setCaptain(id);if(vice===id)setVice(null);setMessage(`${players.find(p=>p.id===id)?.name} kaptan seçildi · x2`)}else{setCaptain(null);setVice(id);setMessage(`${players.find(p=>p.id===id)?.name} ikinci kaptan seçildi.`)}}
 function save(){const empty=lineup.filter(x=>x===null).length+bench.filter(x=>x===null).length;if(empty)return setMessage(`Kadroyu kaydetmeden önce ${empty} boş yeri tamamla.`);if(!captain||!vice)return setMessage("Kaptan ve ikinci kaptan seçmelisin.");setMessage("Kadro bu cihazın tarayıcısına kaydedildi.")}
 function pickFormation(f:Formation){setFormation(f);setFormationOpen(false);setMessage(`${f} dizilişi seçildi.`)}

 const rows=formationRows[formation];let cursor=0;
 return <div className="fantasy-page pro-team-page target-team-layout">
  <section className="team-command-bar target-command-bar"><div><p className="eyebrow">KADROM / SAHA İÇİ</p><h1>Takımını Kur</h1><p>Hayalindeki kadroyu oluştur, puanları topla, zirveye çık!</p></div><div className="command-kpis"><div><small>Toplam bütçe</small><strong>100 M₺</strong></div><div><small>Kalan bütçe</small><strong className="money-text">{remaining.toFixed(1)} M₺</strong></div><div><small>Asil</small><strong>{lineup.filter(Boolean).length}/11</strong></div><div><small>Toplam</small><strong>{selected.length}/15</strong></div></div></section>
  <section className="target-builder-shell">
   <aside className="team-side-rail" aria-label="Kadro menüsü">
    <nav>
      <Link className="active" href="/team">Kadrom</Link>
      <Link href="/transfers">Transfer</Link>
      <Link href="/leagues/super-lig">Ligler</Link>
      <Link href="/today">Fikstür</Link>
      <Link href="/statistics">İstatistikler</Link>
      <Link href="/leaderboard">Ödüller</Link>
    </nav>
    <div className="invite-card"><strong>FUTBOL IQ</strong><p>Daha eğlenceli bir lig için arkadaşlarını davet et.</p><button onClick={()=>navigator.share?.({title:"FUTBOL IQ Fantasy",url:window.location.origin})}>Siteyi Arkadaşına Öner</button></div>
   </aside>
   <div className="pro-builder-grid target-grid">
    <div className="squad-column">
     <div className="squad-toolbar target-squad-toolbar">
      <div className="formation-dropdown-wrap">
       <span className="formation-label">Diziliş Seç</span>
       <button className="formation-trigger" onClick={()=>setFormationOpen(v=>!v)} aria-expanded={formationOpen}>{formation}<span>⌄</span></button>
       {formationOpen&&<div className="formation-menu">{FORMATIONS.map(f=><button key={f} className={formation===f?"active":""} onClick={()=>pickFormation(f)}>{f}</button>)}</div>}
      </div>
      <button className="ghost-action" onClick={()=>setMessage("Otomatik kur özelliği oyuncu puan motoruna bağlandığında aktif olacak.")}>Otomatik Kur</button>
     </div>
     <div className="stadium-pitch-wrap"><div className="floodlight left"/><div className="floodlight right"/><div className="pro-pitch"><div className="pitch-markings"/>{rows.map((count,rowIndex)=>{const ids=lineup.slice(cursor,cursor+count);cursor+=count;return <div className={`pitch-row row-${rowIndex}`} style={{gridTemplateColumns:`repeat(${count}, minmax(0, 1fr))`}} key={`${formation}-${rowIndex}`}>{ids.map((id,i)=>id?<PlayerCard key={id} id={id} captain={captain===id} vice={vice===id} onRole={()=>role(id)} onRemove={()=>remove(id)}/>:<EmptySlot key={`slot-${rowIndex}-${i}`} label={rowIndex===3?"GK":rowIndex===2?"DEF":rowIndex===1?"MID":"FWD"}/>)}</div>})}</div></div>
     <div className="bench-zone"><div className="bench-title"><div><p className="eyebrow">YEDEK KULÜBESİ</p><h2>1 Kaleci + 3 Saha Oyuncusu</h2></div><span>{bench.filter(Boolean).length}/4</span></div><div className="pro-bench-grid">{bench.map((id,i)=>id?<BenchPlayer key={id} id={id} order={i+1} onRemove={()=>remove(id)}/>:<div className="bench-empty" key={i}>Yedek {i+1}</div>)}</div></div>
     <div className="save-row"><div className="status-message">{message}</div><button className="save-squad" onClick={save}>Kadroyu Kaydet</button></div>
    </div>
    <aside className="player-market-pro"><div className="market-heading"><div><p className="eyebrow">OYUNCULAR</p><h2>Oyuncu Listesi</h2></div><span>{SUPER_LIG_DATA_META.clubCount} KULÜP · {SUPER_LIG_DATA_META.season}</span></div><input className="pro-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Oyuncu ara..."/><select className="club-select" value={clubFilter} onChange={e=>setClubFilter(e.target.value)} aria-label="Kulüp filtresi"><option value="ALL">Tüm takımlar</option>{SUPER_LIG_CLUBS_2026_27.map(club=><option value={club} key={club}>{club}</option>)}</select><div className="position-tabs">{(["ALL","GK","DEF","MID","FWD"] as const).map(p=><button className={filter===p?"active":""} onClick={()=>setFilter(p)} key={p}>{p==="ALL"?"Tümü":p}</button>)}</div><div className="market-label-row"><span>Oyuncu</span><span>Fiyat</span><span>Puan</span><span/></div><div className="pro-market-list">{filtered.length?filtered.map(p=><div className={`pro-market-row ${selected.includes(p.id)?"selected":""}`} key={p.id}><div className="market-identity"><Portrait name={p.name}/><div><strong>{p.name}</strong><small>{p.club} · %{p.selected} seçilme</small></div></div><b>{p.price.toFixed(1)}M</b><span>{p.points}</span><button onClick={()=>add(p)} aria-label={`${p.name} ${selected.includes(p.id)?"çıkar":"ekle"}`}>{selected.includes(p.id)?"−":"+"}</button></div>):<div className="roster-pending">Bu kulübün oyuncu kadrosu henüz doğrulanmış veri sağlayıcısından senkronize edilmedi. Sahte oyuncu eklemiyoruz.</div>}</div><div className="formation-analysis"><strong>Diziliş Analizi</strong><span>Forvet <b>{rows[0]}/{rows[0]}</b></span><span>Orta Saha <b>{rows[1]}/{rows[1]}</b></span><span>Defans <b>{rows[2]}/{rows[2]}</b></span><span>Kaleci <b>1/1</b></span></div></aside>
   </div>
  </section>
 </div>
}

function Portrait({name}:{name:string}){return <div className="portrait"><span className="head"/><span className="torso"/><b>{name.slice(0,1)}</b></div>}
function PlayerCard({id,captain,vice,onRole,onRemove}:{id:number;captain:boolean;vice:boolean;onRole:()=>void;onRemove:()=>void}){const p=players.find(x=>x.id===id)!;return <motion.article whileHover={{y:-6,scale:1.035}} transition={{duration:.18}} className={`pro-player-card ${captain?"is-captain":""}`}><button className={`role-button ${captain?"captain-badge":""}`} onClick={onRole}>{captain?"C":vice?"VC":p.position}</button><button className="remove-mini" onClick={onRemove} aria-label={`${p.name} çıkar`}>×</button><Portrait name={p.name}/><strong>{p.name}</strong><small>{p.club}</small><div className="card-stats"><b>{p.price.toFixed(1)}M</b><span>{p.points} P</span><em>%{p.selected}</em></div></motion.article>}
function EmptySlot({label}:{label:string}){return <div className="empty-player-slot"><span>{label}</span><i/><small>Boş Pozisyon</small></div>}
function BenchPlayer({id,order,onRemove}:{id:number;order:number;onRemove:()=>void}){const p=players.find(x=>x.id===id)!;return <div className="pro-bench-card"><span className="bench-order">{order}</span><Portrait name={p.name}/><div><strong>{p.name}</strong><small>{p.club} · {p.position}</small></div><b>{p.price.toFixed(1)}M</b><button onClick={onRemove}>×</button></div>}
