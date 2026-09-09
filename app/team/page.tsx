"use client";

import { DragEvent, useEffect, useMemo, useState } from "react";
import { SUPER_LIG_CLUBS_2026_27, SUPER_LIG_DATA_META } from "@/data/superlig-2026";

type Position = "GK" | "DEF" | "MID" | "FWD";
type Formation = "4-3-3" | "4-4-2" | "3-4-3" | "3-5-2" | "5-3-2";
type Player = { id:number; name:string; club:string; position:Position; price:number; points:number; selected:number; };
type DragPayload = { playerId:number; fromIndex?:number };

const BUDGET = 100;
const STORAGE_KEY = "futbol-iq-fantasy-squad-v4";
const FORMATIONS: Formation[] = ["4-3-3","4-4-2","3-4-3","3-5-2","5-3-2"];

const players: Player[] = [
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

const formationSlots: Record<Formation, Position[]> = {
 "4-3-3":["FWD","FWD","FWD","MID","MID","MID","DEF","DEF","DEF","DEF","GK"],
 "4-4-2":["FWD","FWD","MID","MID","MID","MID","DEF","DEF","DEF","DEF","GK"],
 "3-4-3":["FWD","FWD","FWD","MID","MID","MID","MID","DEF","DEF","DEF","GK"],
 "3-5-2":["FWD","FWD","MID","MID","MID","MID","MID","DEF","DEF","DEF","GK"],
 "5-3-2":["FWD","FWD","MID","MID","MID","DEF","DEF","DEF","DEF","DEF","GK"],
};

const initialLineup:(number|null)[]=[1,2,3,4,6,8,9,10,18,22,21];
const initialBench:(number|null)[]=[23,24,25,26];

export default function TeamBuilderPage(){
 const [formation,setFormation]=useState<Formation>("4-3-3");
 const [lineup,setLineup]=useState<(number|null)[]>(initialLineup);
 const [bench,setBench]=useState<(number|null)[]>(initialBench);
 const [query,setQuery]=useState("");
 const [filter,setFilter]=useState<"ALL"|Position>("ALL");
 const [clubFilter,setClubFilter]=useState("ALL");
 const [message,setMessage]=useState("Oyuncuyu sağdaki listeden tutup uygun mevki alanına sürükle.");
 const [dragging,setDragging]=useState<number|null>(null);
 const [hydrated,setHydrated]=useState(false);

 useEffect(()=>{try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){const saved=JSON.parse(raw);setFormation(saved.formation??"4-3-3");setLineup(saved.lineup??initialLineup);setBench(saved.bench??initialBench)}}finally{setHydrated(true)}},[]);
 useEffect(()=>{if(hydrated)localStorage.setItem(STORAGE_KEY,JSON.stringify({formation,lineup,bench}))},[hydrated,formation,lineup,bench]);

 const slots=formationSlots[formation];
 const selected=[...lineup,...bench].filter((id):id is number=>id!==null);
 const selectedPlayers=selected.map(id=>players.find(p=>p.id===id)!).filter(Boolean);
 const spent=selectedPlayers.reduce((s,p)=>s+p.price,0);
 const remaining=BUDGET-spent;
 const filtered=useMemo(()=>players.filter(p=>(filter==="ALL"||p.position===filter)&&(clubFilter==="ALL"||p.club===clubFilter)&&`${p.name} ${p.club}`.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr"))),[filter,clubFilter,query]);
 const clubCount=(club:string)=>selectedPlayers.filter(p=>p.club===club).length;

 function positionName(pos:Position){return pos==="FWD"?"Forvet":pos==="MID"?"Orta saha":pos==="DEF"?"Defans":"Kaleci"}
 function getPlayer(id:number){return players.find(p=>p.id===id)!}
 function remove(id:number){setLineup(v=>v.map(x=>x===id?null:x));setBench(v=>v.map(x=>x===id?null:x));setMessage(`${getPlayer(id).name} kadrodan çıkarıldı.`)}
 function canAdd(player:Player){if(selected.includes(player.id))return true;if(clubCount(player.club)>=3){setMessage(`${player.club} için 3 oyuncu sınırına ulaştın.`);return false}if(remaining<player.price){setMessage("Bu oyuncu için kalan bütçe yeterli değil.");return false}return true}

 function reflowFormation(next:Formation){
  const nextSlots=formationSlots[next];
  const current=lineup.filter((id):id is number=>id!==null).map(getPlayer);
  const rebuilt:(number|null)[]=nextSlots.map(()=>null);
  current.forEach(p=>{const i=nextSlots.findIndex((pos,index)=>pos===p.position&&rebuilt[index]===null);if(i>=0)rebuilt[i]=p.id});
  setFormation(next);setLineup(rebuilt);setMessage(`${next} dizilişi uygulandı. Oyuncular yalnızca kendi mevki hatlarına yerleştirildi.`)
 }
 function startDrag(e:DragEvent, playerId:number, fromIndex?:number){const payload:DragPayload={playerId,fromIndex};e.dataTransfer.setData("application/json",JSON.stringify(payload));e.dataTransfer.effectAllowed="move";setDragging(playerId)}
 function readDrag(e:DragEvent):DragPayload|null{try{return JSON.parse(e.dataTransfer.getData("application/json")) as DragPayload}catch{return dragging?{playerId:dragging}:null}}
 function dropOnSlot(e:DragEvent,index:number){
  e.preventDefault();const payload=readDrag(e);setDragging(null);if(!payload)return;
  const player=getPlayer(payload.playerId);const required=slots[index];
  if(player.position!==required){setMessage(`${player.name} ${positionName(player.position)} oyuncusu. ${positionName(required)} hattına yerleştirilemez.`);return}
  if(!canAdd(player))return;
  setLineup(prev=>{const next=[...prev];const existingIndex=next.findIndex(x=>x===player.id);const targetPlayer=next[index];if(existingIndex>=0){next[existingIndex]=targetPlayer??null;next[index]=player.id;return next}if(payload.fromIndex!==undefined&&payload.fromIndex>=0&&payload.fromIndex<next.length){next[payload.fromIndex]=targetPlayer??null}next[index]=player.id;return next});
  setBench(prev=>prev.map(x=>x===player.id?null:x));setMessage(`${player.name} ${positionName(required)} hattına yerleştirildi.`)
 }
 function quickAdd(player:Player){if(selected.includes(player.id)){remove(player.id);return}if(!canAdd(player))return;const i=slots.findIndex((pos,index)=>pos===player.position&&lineup[index]===null);if(i<0){setMessage(`${positionName(player.position)} hattında boş yer yok. Oyuncuyu değiştirmek için sürükleyip mevcut kartın üzerine bırak.`);return}setLineup(v=>v.map((x,index)=>index===i?player.id:x));setMessage(`${player.name} ${positionName(player.position)} hattına eklendi.`)}
 function save(){const empty=lineup.filter(x=>x===null).length;if(empty)return setMessage(`İlk 11'de ${empty} boş pozisyon var.`);setMessage("Kadro bu cihazın tarayıcısına kaydedildi.")}

 const lines:Position[]=["FWD","MID","DEF","GK"];
 return <div className="fantasy-page pro-team-page target-team-layout dnd-team-page">
  <section className="team-command-bar dnd-command-bar"><div><p className="eyebrow">KADROM / SAHA İÇİ</p><h1>Takımını Kur</h1><p>Oyuncuları sağdan sahaya sürükle. Her futbolcu yalnızca kendi mevki hattına bırakılabilir.</p></div><div className="command-kpis"><div><small>Toplam bütçe</small><strong>100 M₺</strong></div><div><small>Kalan bütçe</small><strong className="money-text">{remaining.toFixed(1)} M₺</strong></div><div><small>İlk 11</small><strong>{lineup.filter(Boolean).length}/11</strong></div><div><small>Toplam</small><strong>{selected.length}/15</strong></div></div></section>
  <section className="dnd-workspace">
   <div className="dnd-pitch-panel">
    <div className="dnd-toolbar"><div><span>Diziliş</span><select value={formation} onChange={e=>reflowFormation(e.target.value as Formation)}>{FORMATIONS.map(f=><option key={f} value={f}>{f}</option>)}</select></div><div className="position-legend"><span><i className="fwd"/>Forvet</span><span><i className="mid"/>Orta saha</span><span><i className="def"/>Defans</span><span><i className="gk"/>Kaleci</span></div></div>
    <div className="stadium-pitch-wrap dnd-stadium"><div className="pro-pitch dnd-pitch"><div className="pitch-markings"/>{lines.map(pos=>{const indices=slots.map((p,i)=>p===pos?i:-1).filter(i=>i>=0);return <div className={`dnd-line line-${pos.toLowerCase()}`} key={pos}>{indices.map(index=>{const id=lineup[index];return <div className={`drop-slot ${dragging&&getPlayer(dragging).position===pos?"can-drop":""}`} key={index} onDragOver={e=>e.preventDefault()} onDrop={e=>dropOnSlot(e,index)}>{id?<DraggableCard player={getPlayer(id)} onDragStart={e=>startDrag(e,id,index)} onRemove={()=>remove(id)}/>:<EmptyDropSlot position={pos}/>}</div>})}</div>})}</div></div>
    <div className="bench-zone dnd-bench"><div className="bench-title"><div><p className="eyebrow">YEDEK KULÜBESİ</p><h2>Yedekler</h2></div><span>{bench.filter(Boolean).length}/4</span></div><div className="pro-bench-grid">{bench.map((id,i)=>id?<div className="pro-bench-card" key={id} draggable onDragStart={e=>startDrag(e,id)}><span className="bench-order">{i+1}</span><Portrait name={getPlayer(id).name}/><div><strong>{getPlayer(id).name}</strong><small>{getPlayer(id).club} · {getPlayer(id).position}</small></div><b>{getPlayer(id).price.toFixed(1)}M</b><button onClick={()=>remove(id)}>×</button></div>:<div className="bench-empty" key={i}>Yedek {i+1}</div>)}</div></div>
    <div className="save-row"><div className="status-message">{message}</div><button className="save-squad" onClick={save}>Kadroyu Kaydet</button></div>
   </div>
   <aside className="player-market-pro dnd-market"><div className="market-heading"><div><p className="eyebrow">TAKIMLAR / OYUNCU BUL</p><h2>Oyuncu Bul</h2></div><span>{SUPER_LIG_DATA_META.clubCount} KULÜP · {SUPER_LIG_DATA_META.season}</span></div>
    <input className="pro-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Oyuncu ara..."/>
    <select className="club-select" value={clubFilter} onChange={e=>setClubFilter(e.target.value)} aria-label="Kulüp filtresi"><option value="ALL">Tüm takımlar</option>{SUPER_LIG_CLUBS_2026_27.map(club=><option value={club} key={club}>{club}</option>)}</select>
    <div className="position-tabs">{(["ALL","GK","DEF","MID","FWD"] as const).map(p=><button className={filter===p?"active":""} onClick={()=>setFilter(p)} key={p}>{p==="ALL"?"Tümü":positionName(p)}</button>)}</div>
    <div className="drag-hint">Kartı tutup soldaki uygun mevki alanına sürükle.</div>
    <div className="pro-market-list">{filtered.map(p=><div className={`pro-market-row dnd-market-row ${selected.includes(p.id)?"selected":""}`} key={p.id} draggable onDragStart={e=>startDrag(e,p.id)} onDragEnd={()=>setDragging(null)}><div className="market-identity"><Portrait name={p.name}/><div><strong>{p.name}</strong><small>{p.club} · {positionName(p.position)}</small></div></div><b>{p.price.toFixed(1)}M</b><span>{p.points} P</span><button onClick={()=>quickAdd(p)} aria-label={`${p.name} ekle`}>{selected.includes(p.id)?"−":"+"}</button></div>)}</div>
   </aside>
  </section>
 </div>
}

function Portrait({name}:{name:string}){return <div className="portrait"><span className="head"/><span className="torso"/><b>{name.slice(0,1)}</b></div>}
function DraggableCard({player,onDragStart,onRemove}:{player:Player;onDragStart:(e:DragEvent)=>void;onRemove:()=>void}){return <article className="pro-player-card dnd-card" draggable onDragStart={onDragStart}><button className="remove-mini" onClick={onRemove} aria-label={`${player.name} çıkar`}>×</button><Portrait name={player.name}/><strong>{player.name}</strong><small>{player.club}</small><div className="card-stats"><b>{player.price.toFixed(1)}M</b><span>{player.points} P</span><em>{player.position}</em></div></article>}
function EmptyDropSlot({position}:{position:Position}){const label=position==="FWD"?"FORVET":position==="MID"?"ORTA SAHA":position==="DEF"?"DEFANS":"KALECİ";return <div className="empty-player-slot dnd-empty"><span>{label}</span><i/><small>Buraya bırak</small></div>}
