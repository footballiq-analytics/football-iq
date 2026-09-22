"use client";
import PlayerPortrait from "./PlayerPortrait";
import { resolveFantasyMedia } from "@/lib/fantasy-media";
import { getClubFixture } from "@/data/weekly-fixtures";
import { formatFantasyPrice } from "@/lib/fantasy-price";


import { assessDirectTransfer, type TransferAssessment } from "@/lib/direct-transfer";
import { useDraggable } from "@dnd-kit/core";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FantasyCoach } from "@/data/superlig-coaches-2026";
import type { FantasyPlayer, PlayerPosition } from "./PlayerCard";

export type TransferPanelProps = {
  onClose: () => void;
  coachRequest?: number;
  target?: { id: string; position: PlayerPosition; label: string };
  onClearTarget?: () => void;
  players: FantasyPlayer[];
  coaches: FantasyCoach[];
  clubs: readonly string[];
  selectedIds: (string | number)[];
  selectedCoachId?: string | null;
  availableSlots: Record<PlayerPosition, number>;
  onQuickAdd: (player: FantasyPlayer) => void;
  onRemovePlayer: (player: FantasyPlayer) => void;
  onClearSquad: () => void;
  onSelectCoach: (coach: FantasyCoach) => void;
  onPlayerClick?: (player: FantasyPlayer) => void;
};

type FilterTab = "ALL" | PlayerPosition | "COACH";
type SortMode = "POINTS" | "PRICE_ASC" | "PRICE_DESC" | "POPULAR";

const tabLabel: Record<FilterTab, string> = { ALL:"Tümü", GK:"KL", DEF:"DEF", MID:"ORT", FWD:"FOR", COACH:"TD" };
const BUDGET = 100;

export default function TransferPanel({onClose,coachRequest,target,onClearTarget,players,coaches,clubs,selectedIds,selectedCoachId,availableSlots,onQuickAdd,onRemovePlayer,onSelectCoach,onPlayerClick}:TransferPanelProps){
 const[query,setQuery]=useState("");
 const[debouncedQuery,setDebouncedQuery]=useState("");
 const[selectedClubs,setSelectedClubs]=useState<string[]>([]);
 const[clubMenuOpen,setClubMenuOpen]=useState(false);
 const clubFilter=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!clubMenuOpen)return;const outside=(e:PointerEvent)=>{if(e.target instanceof Node&&!clubFilter.current?.contains(e.target))setClubMenuOpen(false)};const key=(e:KeyboardEvent)=>{if(e.key==="Escape")setClubMenuOpen(false)};document.addEventListener("pointerdown",outside);document.addEventListener("keydown",key);return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",key)}},[clubMenuOpen]);
 const[position,setPosition]=useState<FilterTab>("ALL");
 const[sort,setSort]=useState<SortMode>("PRICE_DESC");
 const[smartOnly,setSmartOnly]=useState(false);
 const effectivePosition=target?.position??position;
 const showingCoaches=effectivePosition==="COACH";
 const previousSlots=useRef({position:effectivePosition,available:availableSlots,targetId:target?.id});
 useEffect(()=>{
  const previous=previousSlots.current;
  previousSlots.current={position:effectivePosition,available:availableSlots,targetId:target?.id};
  const pos=previous.position;
  if(target||pos==="ALL"||pos==="COACH")return;
  if(previous.available[pos]>0&&availableSlots[pos]===0&&(effectivePosition===pos||previous.targetId)){
   const next=(["GK","DEF","MID","FWD"] as const).find(p=>availableSlots[p]>0);
   if(next){setPosition(next);setQuery("");setDebouncedQuery("")}
  }
 },[availableSlots,effectivePosition,target]);

 useEffect(()=>{if(target?.id){setQuery("");setDebouncedQuery("");setSelectedClubs([]);setClubMenuOpen(false)}},[target?.id]);
 useEffect(()=>{const id=window.setTimeout(()=>setDebouncedQuery(query),300);return()=>window.clearTimeout(id)},[query]);

 const sortedClubs=useMemo(()=>[...clubs].sort((a,b)=>a.localeCompare(b,"tr",{sensitivity:"base"})),[clubs]);
 const selectedSet=useMemo(()=>new Set(selectedIds.map(String)),[selectedIds]);
 const selectedPlayers=useMemo(()=>players.filter(p=>selectedSet.has(String(p.id))),[players,selectedSet]);
 const spent=useMemo(()=>selectedPlayers.reduce((sum,p)=>sum+p.price,0),[selectedPlayers]);
 const remainingBudget=BUDGET-spent;
 const selectedClubCounts=useMemo(()=>{const counts=new Map<string,number>();for(const p of selectedPlayers)counts.set(p.club,(counts.get(p.club)??0)+1);return counts},[selectedPlayers]);
 const clubCounts=useMemo(()=>{const counts=new Map<string,number>();for(const p of players)counts.set(p.club,(counts.get(p.club)??0)+1);return counts},[players]);
 const clubMatch=(club:string)=>selectedClubs.length===0||selectedClubs.includes(club);

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
  const list=players.filter(p=>`${p.name} ${p.club}`.toLocaleLowerCase("tr").includes(n)&&clubMatch(p.club)&&(effectivePosition==="ALL"||p.position===effectivePosition)&&(!(smartOnly||target)||transferAssessments.get(String(p.id))?.eligible));
  return [...list].sort((a,b)=>sort==="PRICE_ASC"?a.price-b.price:sort==="PRICE_DESC"?b.price-a.price:sort==="POPULAR"?(b.selected??0)-(a.selected??0):b.points-a.points);
 },[debouncedQuery,players,effectivePosition,target,selectedClubs,showingCoaches,smartOnly,sort,transferAssessments]);
 const filteredCoaches=useMemo(()=>{if(!showingCoaches)return[];const n=debouncedQuery.toLocaleLowerCase("tr");return coaches.filter(c=>`${c.name} ${c.club} ${c.country}`.toLocaleLowerCase("tr").includes(n)&&clubMatch(c.club))},[coaches,debouncedQuery,selectedClubs,showingCoaches]);
 const resultCount=showingCoaches?filteredCoaches.length:filteredPlayers.length;
 const hasActiveFilters=selectedClubs.length>0||position!=="ALL"||query.trim().length>0||smartOnly;
 const clearFilters=()=>{setSelectedClubs([]);setPosition("ALL");setQuery("");setDebouncedQuery("");setSmartOnly(false);setClubMenuOpen(false)};
 useEffect(()=>{if(!coachRequest)return;setPosition("COACH");setQuery("");setDebouncedQuery("");setSelectedClubs([]);setClubMenuOpen(false)},[coachRequest]);
 const toggleClub=(club:string)=>setSelectedClubs(current=>current.includes(club)?current.filter(x=>x!==club):[...current,club]);
 const clubSummary=selectedClubs.length===0?"Tüm takımlar":selectedClubs.length<=2?selectedClubs.join(" + "):`${selectedClubs.length} takım seçili`;


 return <aside className="fiq-transfer-panel fiq-transfer-panel-v28">
  <div className="fiq-transfer-controls">
   <div className="fiq-transfer-heading"><div><h2>{showingCoaches?"Teknik Direktörler":"Transfer Merkezi"}</h2><p>{showingCoaches?"Teknik direktörünü seç.":"Listeyi kaydır · sürüklemek için görsele basılı tut."}</p></div><button type="button" className="fiq-transfer-close" aria-label="Transfer panelini kapat" onClick={onClose}><svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>

   {target?<div className="fiq-transfer-target" role="status"><strong>HEDEF: {target.label}</strong><button type="button" onClick={onClearTarget} aria-label="Hedef seçimini kaldır">×</button></div>:null}
   <div className="fiq-player-search relative mt-2"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg font-black text-[#f3ca40]">⌕</span><input aria-label={showingCoaches?"Teknik direktör ara":"Oyuncu ara"} value={query} onChange={e=>setQuery(e.target.value)} placeholder={showingCoaches?"Teknik direktör ara...":"Oyuncu ara..."} className="h-10 w-full rounded-lg border-2 border-[#f3ca40]/65 bg-[#050a0f] pl-9 pr-9 text-[13px] font-bold text-white outline-none placeholder:text-white/45 focus:border-[#ffe778]"/>{query?<button type="button" onClick={()=>setQuery("")} aria-label="Aramayı temizle" className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 rounded-md border border-[#f3ca40]/60 bg-black text-lg font-black text-[#ffe778]">×</button>:null}</div>
   <div className="fiq-transfer-filter-pair">
   <div ref={clubFilter} className="fiq-club-filter relative">
    <button type="button" aria-expanded={clubMenuOpen} aria-controls="fiq-club-menu" onClick={()=>setClubMenuOpen(v=>!v)} className={`flex h-10 w-full items-center justify-between rounded-lg border-2 bg-black px-3 text-left text-[13px] font-black text-white shadow-[0_6px_16px_rgba(0,0,0,.25)] ${clubMenuOpen?"border-[#ffe778]":"border-[#f3ca40]/70"}`}><span className="truncate">{clubSummary}</span><span className="ml-2 text-[#ffe778]">{clubMenuOpen?"▲":"▼"}</span></button>
    {clubMenuOpen?<div id="fiq-club-menu" className="absolute left-0 right-0 top-[44px] z-[90] max-h-[300px] overflow-y-auto rounded-xl border-2 border-[#f3ca40]/70 bg-[#050a0f] p-2 shadow-[0_22px_48px_rgba(0,0,0,.7)]"><div className="mb-2 flex items-center justify-between"><b className="text-[9px] text-[#ffe778]">TAKIM FİLTRESİ</b><button type="button" onClick={()=>setSelectedClubs([])} className="rounded-md border border-[#f3ca40]/60 bg-black px-2 py-1 text-[8px] font-black text-[#ffe778]">TÜMÜ</button></div>{sortedClubs.map(item=>{const active=selectedClubs.includes(item);const fixture=getClubFixture(item);const clubLimitReached=(selectedClubCounts.get(item)??0)>=3;return <button type="button" key={item} onClick={()=>toggleClub(item)} className={`mb-1 flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-left text-[11px] font-bold ${active?"border-[#ffe778] bg-[#f3ca40]/10 text-white":"border-white/10 bg-black/60 text-white/75"}`}><span className="fiq-club-label"><span className="fiq-club-name">{item}{clubLimitReached?<span className="fiq-eligibility-badge fiq-club-limit" data-reason="3 OYUNCU SINIRI">3 OYUNCU SINIRI</span>:null}</span><small className="fiq-club-fixture">{fixture?<><b>{fixture.venue}</b> · {fixture.opponent}</>:"Ev/D · Fikstür bekleniyor"}</small></span><span className={active?"text-emerald-300":"text-white/25"}>{active?"✓":"○"} <small className="ml-1 text-[8px]">{clubCounts.get(item)??0}</small></span></button>})}<button type="button" onClick={()=>setClubMenuOpen(false)} className="sticky bottom-0 mt-1 h-9 w-full rounded-lg border-2 border-[#f3ca40]/70 bg-black text-[10px] font-black text-[#ffe778]">TAMAM</button></div>:null}
   </div>


    <select value={sort} onChange={e=>setSort(e.target.value as SortMode)} aria-label="Sıralama"><option value="PRICE_DESC">Fiyat ↓</option><option value="PRICE_ASC">Fiyat ↑</option><option value="POINTS">Puan</option><option value="POPULAR">Popülerlik</option></select>
   </div>
   <div className="fiq-position-tabs mt-2 grid grid-cols-6 gap-1 rounded-lg border-2 border-[#f3ca40]/55 bg-black/60 p-1">{(["ALL","GK","DEF","MID","FWD","COACH"] as const).map(item=><button type="button" key={item} aria-pressed={effectivePosition===item} disabled={!!target&&item!==target.position} onClick={()=>{setPosition(item);setQuery("")}} className={`min-h-10 rounded-md border text-[9px] font-black leading-tight ${effectivePosition===item?"border-[#ffe778] bg-[#f3ca40]/12 text-[#ffe778] shadow-[0_0_12px_rgba(243,202,64,.22)]":"border-[#f3ca40]/35 bg-black text-white/85"}`}><span>{tabLabel[item]}</span></button>)}</div>

   <div className="fiq-transfer-options"><label className="fiq-transfer-eligible"><input type="checkbox" checked={smartOnly||!!target} disabled={!!target||showingCoaches} onChange={e=>setSmartOnly(e.target.checked)}/><span>Yalnızca uygun oyuncular</span></label>{hasActiveFilters?<button type="button" className="fiq-transfer-reset" onClick={clearFilters}>Filtreleri temizle</button>:null}</div>
   <span className="sr-only" role="status">{resultCount} {showingCoaches?"teknik direktör":"oyuncu"} listeleniyor</span>
  </div>

  <div aria-label="Transfer sonuçları" tabIndex={0} className="fiq-transfer-results relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-8 pt-1.5 touch-pan-y [-webkit-overflow-scrolling:touch]">{showingCoaches?filteredCoaches.map(c=><CoachRow key={c.id} coach={c} selected={c.id===selectedCoachId} onSelectCoach={onSelectCoach}/>):filteredPlayers.map(player=><TransferDraggable key={String(player.id)} player={player} selected={selectedSet.has(String(player.id))} assessment={transferAssessments.get(String(player.id))??{eligible:false,reason:null}} onQuickAdd={onQuickAdd} onRemovePlayer={onRemovePlayer} onPlayerClick={onPlayerClick}/>)}{!resultCount?<div className="fiq-transfer-empty grid min-h-36 place-items-center px-4 text-center text-sm">{smartOnly||target?"Kadro kurallarına uyan transfer bulunamadı.":"Bu filtrelerle eşleşen kayıt bulunamadı."}</div>:null}</div>
 </aside>
}

function CoachRow({coach,selected,onSelectCoach}:{coach:FantasyCoach;selected:boolean;onSelectCoach:(c:FantasyCoach)=>void}){
 return <div className="fiq-coach-transfer-row"><div><strong>{coach.name}</strong><small>{coach.club} · TD</small></div><button type="button" disabled={selected} aria-label={`${coach.name} ${selected?"seçili":"teknik direktör seç"}`} onClick={()=>onSelectCoach(coach)}>{selected?"Seçili":"Seç"}</button></div>;
}
function TransferDraggable({player,selected,assessment,onQuickAdd,onRemovePlayer,onPlayerClick}:{player:FantasyPlayer;selected:boolean;assessment:TransferAssessment;onQuickAdd:(p:FantasyPlayer)=>void;onRemovePlayer:(p:FantasyPlayer)=>void;onPlayerClick?:(p:FantasyPlayer)=>void}){
 const d=useDraggable({id:`transfer:${player.id}`,disabled:selected,data:{sourceSlotId:"transfer",playerId:String(player.id),sourceType:"transfer"}});
 const photo=resolveFantasyMedia(player.photo,player.photoMedia);
 return <div ref={d.setNodeRef} data-fiq-dnd="true" data-selected={selected} className={`fiq-transfer-row${d.isDragging?" is-dragging":""}`}>
  <div>
   <button type="button" disabled={selected} ref={d.setActivatorNodeRef} {...d.listeners} {...d.attributes} title="Basılı tut ve sürükle" aria-label={`${player.name} oyuncusunu sürükle`} className="fiq-transfer-avatar"><span className="fiq-drag-grip" aria-hidden="true">⠿</span>
    <PlayerPortrait key={`${player.id}:${photo??""}`} name={player.name} club={player.club} src={photo}/>
   </button>
   <button type="button" onClick={()=>selected?onRemovePlayer(player):onPlayerClick?.(player)} aria-label={`${player.name} ${selected?"kadrodan çıkar":"oyuncu bilgileri"}`} className="fiq-transfer-player-info">
    <strong title={player.name}>{player.name}</strong><small>{player.club} · {tabLabel[player.position]}</small>
   </button>
   <b className="fiq-transfer-price">{formatFantasyPrice(player.price)}M</b>
   {selected?<button type="button" className="fiq-transfer-owned" aria-label={`${player.name} kadrodan çıkar`} title="Tek tıkla kadrodan çıkar" onMouseDown={e=>e.stopPropagation()} onTouchStart={e=>e.stopPropagation()} onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();onRemovePlayer(player)}}>Kadroda</button>:<button type="button" className="fiq-transfer-add" disabled={!assessment.eligible} aria-label={`${player.name} kadroya ekle`} title={assessment.reason??"Kadroya ekle"} onMouseDown={e=>e.stopPropagation()} onTouchStart={e=>e.stopPropagation()} onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();onQuickAdd(player)}}>+</button>}
  </div>
 </div>;
}
