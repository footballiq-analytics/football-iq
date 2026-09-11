"use client";

import { assessDirectTransfer, type TransferAssessment } from "@/lib/direct-transfer";
import { useDraggable } from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";
import type { FantasyCoach } from "@/data/superlig-coaches-2026";
import type { FantasyPlayer, PlayerPosition } from "./PlayerCard";

export type TransferPanelProps = {
  players: FantasyPlayer[];
  coaches: FantasyCoach[];
  clubs: readonly string[];
  selectedIds: (string | number)[];
  selectedCoachId?: string | null;
  availableSlots: Record<PlayerPosition, number>;
  onQuickAdd: (player: FantasyPlayer) => void;
  onSelectCoach: (coach: FantasyCoach) => void;
  onPlayerClick?: (player: FantasyPlayer) => void;
};

type FilterTab = "ALL" | PlayerPosition | "COACH";
type SortMode = "POINTS" | "PRICE_ASC" | "PRICE_DESC" | "POPULAR";

const tabLabel: Record<FilterTab, string> = { ALL:"TÜMÜ", GK:"KL", DEF:"DEF", MID:"ORT", FWD:"FOR", COACH:"TD" };
const BUDGET = 100;

export default function TransferPanel({players,coaches,clubs,selectedIds,selectedCoachId,availableSlots,onQuickAdd,onSelectCoach,onPlayerClick}:TransferPanelProps){
 const[query,setQuery]=useState("");
 const[debouncedQuery,setDebouncedQuery]=useState("");
 const[selectedClubs,setSelectedClubs]=useState<string[]>([]);
 const[clubMenuOpen,setClubMenuOpen]=useState(false);
 const[position,setPosition]=useState<FilterTab>("ALL");
 const[sort,setSort]=useState<SortMode>("PRICE_DESC");
 const[smartOnly,setSmartOnly]=useState(false);
 const showingCoaches=position==="COACH";
 useEffect(()=>{const id=window.setTimeout(()=>setDebouncedQuery(query),300);return()=>window.clearTimeout(id)},[query]);

 const sortedClubs=useMemo(()=>[...clubs].sort((a,b)=>a.localeCompare(b,"tr",{sensitivity:"base"})),[clubs]);
 const selectedSet=useMemo(()=>new Set(selectedIds.map(String)),[selectedIds]);
 const selectedPlayers=useMemo(()=>players.filter(p=>selectedSet.has(String(p.id))),[players,selectedSet]);
 const spent=useMemo(()=>selectedPlayers.reduce((sum,p)=>sum+p.price,0),[selectedPlayers]);
 const remainingBudget=BUDGET-spent;
 const selectedClubCounts=useMemo(()=>{const counts=new Map<string,number>();for(const p of selectedPlayers)counts.set(p.club,(counts.get(p.club)??0)+1);return counts},[selectedPlayers]);
 const clubCounts=useMemo(()=>{const counts=new Map<string,number>();for(const p of players)counts.set(p.club,(counts.get(p.club)??0)+1);return counts},[players]);
 const clubMatch=(club:string)=>selectedClubs.length===0||selectedClubs.includes(club);
 const scopePlayers=useMemo(()=>selectedClubs.length===0?players:players.filter(p=>selectedClubs.includes(p.club)),[players,selectedClubs]);
 const positionCounts=useMemo(()=>{const counts:Record<PlayerPosition,number>={GK:0,DEF:0,MID:0,FWD:0};for(const p of scopePlayers)counts[p.position]++;return counts},[scopePlayers]);

 const transferAssessments=useMemo(()=>new Map(players.map(candidate=>[
  String(candidate.id),
  assessDirectTransfer({
   alreadySelected:selectedSet.has(String(candidate.id)),
   squadSize:selectedIds.length,
   clubCount:selectedClubCounts.get(candidate.club)??0,
   availableSlots:availableSlots[candidate.position]??0,
   price:candidate.price,
   remainingBudget,
  }),
 ])),[players,availableSlots,remainingBudget,selectedClubCounts,selectedIds.length,selectedSet]);

 const filteredPlayers=useMemo(()=>{
  if(showingCoaches)return[];
  const n=debouncedQuery.toLocaleLowerCase("tr");
  const list=players.filter(p=>`${p.name} ${p.club}`.toLocaleLowerCase("tr").includes(n)&&clubMatch(p.club)&&(position==="ALL"||p.position===position)&&(!smartOnly||transferAssessments.get(String(p.id))?.eligible));
  return [...list].sort((a,b)=>sort==="PRICE_ASC"?a.price-b.price:sort==="PRICE_DESC"?b.price-a.price:sort==="POPULAR"?(b.selected??0)-(a.selected??0):b.points-a.points);
 },[debouncedQuery,players,position,selectedClubs,showingCoaches,smartOnly,sort,transferAssessments]);
 const filteredCoaches=useMemo(()=>{if(!showingCoaches)return[];const n=debouncedQuery.toLocaleLowerCase("tr");return coaches.filter(c=>`${c.name} ${c.club} ${c.country}`.toLocaleLowerCase("tr").includes(n)&&clubMatch(c.club))},[coaches,debouncedQuery,selectedClubs,showingCoaches]);
 const resultCount=showingCoaches?filteredCoaches.length:filteredPlayers.length;
 const hasActiveFilters=selectedClubs.length>0||position!=="ALL"||query.trim().length>0||smartOnly;
 const clearFilters=()=>{setSelectedClubs([]);setPosition("ALL");setQuery("");setDebouncedQuery("");setSmartOnly(false);setClubMenuOpen(false)};
 const toggleClub=(club:string)=>setSelectedClubs(current=>current.includes(club)?current.filter(x=>x!==club):[...current,club]);
 const clubSummary=selectedClubs.length===0?`Tüm takımlar (${players.length})`:selectedClubs.length<=2?selectedClubs.join(" + "):`${selectedClubs.length} takım seçili`;
 const activeFilterLabels=[selectedClubs.length?`${selectedClubs.length} TAKIM`:null,position!=="ALL"?tabLabel[position]:null,query.trim()?`“${query.trim()}”`:null,smartOnly?"UYGUN":null].filter((x):x is string=>Boolean(x));

 return <aside className="fiq-transfer-panel sticky top-3 flex h-[calc(100dvh-24px)] min-h-0 min-w-0 flex-col overflow-hidden rounded-[24px] border border-[#f3ca40]/25 bg-[linear-gradient(180deg,rgba(5,17,28,.985),rgba(2,10,17,.995))] shadow-[0_28px_80px_rgba(0,0,0,.55)] backdrop-blur-2xl max-[980px]:static max-[980px]:h-[68dvh] max-[980px]:min-h-[460px]">
  <div className="fiq-transfer-controls relative shrink-0 border-b border-white/[.06] p-2.5">
   <div className="fiq-transfer-heading mb-2 flex items-end justify-between gap-2"><div><span className="text-[8px] font-black tracking-[.15em] text-[#f3ca40]">{showingCoaches?"TEKNİK DİREKTÖR HAVUZU":"TRANSFER MERKEZİ"}</span><p className="text-[9px] font-bold text-white/45">{resultCount} {showingCoaches?"teknik direktör":"oyuncu"} listeleniyor</p></div><div className="fiq-transfer-budget flex gap-1.5"><Status label="BÜTÇE" value="100.0M"/><Status label="KALAN" value={`${remainingBudget.toFixed(1)}M`}/></div></div>

   <div className="fiq-club-filter relative">
    <button type="button" aria-expanded={clubMenuOpen} aria-controls="fiq-club-menu" onClick={()=>setClubMenuOpen(v=>!v)} className={`flex h-10 w-full items-center justify-between rounded-lg border-2 bg-black px-3 text-left text-[13px] font-black text-white shadow-[0_6px_16px_rgba(0,0,0,.25)] ${clubMenuOpen?"border-[#ffe778]":"border-[#f3ca40]/70"}`}><span className="truncate">{clubSummary}</span><span className="ml-2 text-[#ffe778]">{clubMenuOpen?"▲":"▼"}</span></button>
    {clubMenuOpen?<div id="fiq-club-menu" className="absolute left-0 right-0 top-[44px] z-[90] max-h-[300px] overflow-y-auto rounded-xl border-2 border-[#f3ca40]/70 bg-[#050a0f] p-2 shadow-[0_22px_48px_rgba(0,0,0,.7)]"><div className="mb-2 flex items-center justify-between"><b className="text-[9px] text-[#ffe778]">TAKIM FİLTRESİ</b><button type="button" onClick={()=>setSelectedClubs([])} className="rounded-md border border-[#f3ca40]/60 bg-black px-2 py-1 text-[8px] font-black text-[#ffe778]">TÜMÜ</button></div>{sortedClubs.map(item=>{const active=selectedClubs.includes(item);return <button type="button" key={item} onClick={()=>toggleClub(item)} className={`mb-1 flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-left text-[11px] font-bold ${active?"border-[#ffe778] bg-[#f3ca40]/10 text-white":"border-white/10 bg-black/60 text-white/75"}`}><span>{item}</span><span className={active?"text-emerald-300":"text-white/25"}>{active?"✓":"○"} <small className="ml-1 text-[8px]">{clubCounts.get(item)??0}</small></span></button>})}<button type="button" onClick={()=>setClubMenuOpen(false)} className="sticky bottom-0 mt-1 h-9 w-full rounded-lg border-2 border-[#f3ca40]/70 bg-black text-[10px] font-black text-[#ffe778]">TAMAM</button></div>:null}
   </div>

   <div className="fiq-player-search relative mt-2"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg font-black text-[#f3ca40]">⌕</span><input aria-label={showingCoaches?"Teknik direktör ara":"Oyuncu ara"} value={query} onChange={e=>setQuery(e.target.value)} placeholder={showingCoaches?"Teknik direktör ara...":"Oyuncu ara..."} className="h-10 w-full rounded-lg border-2 border-[#f3ca40]/65 bg-[#050a0f] pl-9 pr-9 text-[13px] font-bold text-white outline-none placeholder:text-white/45 focus:border-[#ffe778]"/>{query?<button type="button" onClick={()=>setQuery("")} className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 rounded-md border border-[#f3ca40]/60 bg-black text-lg font-black text-[#ffe778]">×</button>:null}</div>

   {hasActiveFilters?<div className="fiq-active-filters mt-1.5 flex items-center gap-1 overflow-x-auto"><span className="shrink-0 text-[7px] font-black text-white/35">AKTİF</span>{activeFilterLabels.map(x=><span key={x} className="shrink-0 rounded-full border border-[#f3ca40]/35 bg-black px-2 py-1 text-[8px] font-black text-[#f7e7a2]">{x}</span>)}<button type="button" onClick={clearFilters} className="ml-auto shrink-0 rounded-md border border-[#f3ca40]/65 bg-black px-2 py-1 text-[8px] font-black text-[#ffe778]">TEMİZLE</button></div>:null}

   <div className="fiq-position-tabs mt-2 grid grid-cols-6 gap-1 rounded-lg border-2 border-[#f3ca40]/55 bg-black/60 p-1">{(["ALL","GK","DEF","MID","FWD","COACH"] as const).map(item=><button type="button" key={item} onClick={()=>{setPosition(item);setQuery("")}} className={`min-h-10 rounded-md border text-[9px] font-black leading-tight ${position===item?"border-[#ffe778] bg-[#f3ca40]/12 text-[#ffe778] shadow-[0_0_12px_rgba(243,202,64,.22)]":"border-[#f3ca40]/35 bg-black text-white/85"}`}><span>{tabLabel[item]}</span>{item!=="ALL"&&item!=="COACH"?<small className="mt-0.5 block text-[8px] text-white/55">{positionCounts[item]}</small>:null}</button>)}</div>

   {!showingCoaches?<div className="fiq-transfer-sort mt-2 grid grid-cols-[minmax(0,1fr)_86px] gap-1.5"><button type="button" onClick={()=>setSmartOnly(v=>!v)} className={`min-h-10 rounded-lg border-2 bg-black px-2.5 py-1.5 text-left font-black ${smartOnly?"border-emerald-300/70 text-emerald-300":"border-[#f3ca40]/70 text-[#ffe778]"}`}><span className="block text-[10px]">UYGUN TRANSFERLER {smartOnly?"✓":""}</span><small className="block text-[7px] font-semibold text-white/45">Mevcut bütçe · boş mevki · en fazla 3 oyuncu</small></button><select value={sort} onChange={e=>setSort(e.target.value as SortMode)} aria-label="Sıralama" className="h-10 rounded-lg border-2 border-[#f3ca40]/65 bg-black px-2 text-[10px] font-black text-[#ffe778] outline-none"><option value="POINTS">PUAN</option><option value="PRICE_ASC">Fiyat: Artan</option><option value="PRICE_DESC">Fiyat: Azalan</option><option value="POPULAR">Popülerlik</option></select></div>:null}
  </div>

  <div aria-label="Transfer sonuçları" tabIndex={0} className="fiq-transfer-results relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-8 pt-1.5 touch-pan-y [-webkit-overflow-scrolling:touch]">{showingCoaches?filteredCoaches.map(c=><CoachRow key={c.id} coach={c} selected={c.id===selectedCoachId} onSelectCoach={onSelectCoach}/>):filteredPlayers.map(player=><TransferDraggable key={String(player.id)} player={player} selected={selectedSet.has(String(player.id))} assessment={transferAssessments.get(String(player.id))??{eligible:false,reason:null}} onQuickAdd={onQuickAdd} onPlayerClick={onPlayerClick}/>)}{!resultCount?<div className="grid min-h-36 place-items-center px-4 text-center text-[10px] font-bold text-white/35">{smartOnly?"Kadro kurallarına uyan transfer bulunamadı.":"Bu filtrelerle eşleşen kayıt bulunamadı."}</div>:null}</div>
 </aside>
}

function Status({label,value,ok=false}:{label:string;value:string;ok?:boolean}){return <div className="rounded-md border border-[#f3ca40]/35 bg-black px-2 py-1 text-right"><small className="block text-[6px] font-black text-white/35">{label}</small><b className={`text-[10px] font-black ${ok?"text-emerald-300":"text-[#ffe778]"}`}>{value}</b></div>}
function CoachRow({coach,selected,onSelectCoach}:{coach:FantasyCoach;selected:boolean;onSelectCoach:(c:FantasyCoach)=>void}){return <div className="mb-1.5 grid grid-cols-[1fr_44px] items-center gap-2 rounded-lg border border-white/10 bg-[#101b29] px-2.5 py-2"><div><strong className="block truncate text-[12px] font-black">{coach.name}</strong><small className="text-[8px] text-white/45">{coach.club}</small></div><button type="button" onClick={()=>onSelectCoach(coach)} className="h-9 w-9 rounded-full border-2 border-[#f3ca40]/70 bg-black text-[#ffe778]">{selected?"✓":"+"}</button></div>}
function TransferDraggable({player,selected,assessment,onQuickAdd,onPlayerClick}:{player:FantasyPlayer;selected:boolean;assessment:TransferAssessment;onQuickAdd:(p:FantasyPlayer)=>void;onPlayerClick?:(p:FantasyPlayer)=>void}){const d=useDraggable({id:`transfer:${player.id}`,disabled:selected,data:{sourceSlotId:"transfer",playerId:String(player.id),sourceType:"transfer"}});return <div ref={d.setNodeRef} data-fiq-dnd="true" className={`mb-1.5 select-none rounded-lg border px-2.5 py-2 transition-all ${d.isDragging?"border-cyan-300/60 bg-cyan-400/10 opacity-35":selected?"border-emerald-300/45 bg-emerald-300/[.07]":assessment.eligible?"border-emerald-300/20 bg-[#0b1e2a]":"border-white/10 bg-[#0b1e2a]"}`}><div className="grid grid-cols-[40px_minmax(0,1fr)_54px_40px] items-center gap-2"><button ref={d.setActivatorNodeRef} type="button" disabled={selected} {...d.listeners}{...d.attributes} aria-label={`${player.name} oyuncusunu sürükle`} className={`grid h-10 w-9 place-items-center rounded-md border-2 text-[14px] ${selected?"border-emerald-300/20 bg-black text-emerald-300/45":"cursor-grab touch-none border-[#f3ca40]/65 bg-black text-[#ffe778]"}`}>{selected?"✓":"⋮⋮"}</button><button type="button" onClick={()=>onPlayerClick?.(player)} className="min-w-0 text-left"><div className="flex min-w-0 items-center gap-1"><strong className="truncate text-[13px] font-black text-white">{player.name}</strong>{selected?<span className="shrink-0 rounded-full border border-emerald-300/35 px-1.5 py-0.5 text-[6px] font-black text-emerald-200">KADRODA</span>:null}</div><small className="block text-[8px] font-semibold text-white/50">{player.club} · {player.position}</small>{!selected?<span className={`mt-1 inline-block rounded-full border px-1.5 py-0.5 text-[6px] font-black ${assessment.eligible?"border-emerald-300/35 bg-emerald-300/10 text-emerald-200":"border-rose-300/25 bg-rose-300/[.06] text-rose-200"}`}>{assessment.eligible?"UYGUN":assessment.reason??"UYGUN DEĞİL"}</span>:null}</button><span className="text-right"><b className="block text-[10px]">{player.price.toFixed(1)}M</b><small className="text-[8px] text-[#ffe45f]">{player.points} P</small></span><button type="button" disabled={selected||!assessment.eligible} aria-label={`${player.name} kadroya ekle`} title={assessment.reason??"Kadroya ekle"} onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();onQuickAdd(player)}} className="h-9 w-9 rounded-full border-2 border-[#f3ca40]/70 bg-black text-lg font-black text-[#ffe778] disabled:border-emerald-300/20 disabled:text-emerald-300/50">{selected?"✓":"+"}</button></div></div>}
