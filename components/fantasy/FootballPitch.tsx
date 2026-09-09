"use client";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { useState } from "react";
import type { FantasyCoach } from "@/data/superlig-coaches-2026";
import PlayerCard,{FantasyPlayer,PlayerPosition}from"./PlayerCard";

export type PitchSlot={id:string;index:number;position:PlayerPosition;player?:FantasyPlayer|null;invalidPosition?:boolean};
export type BenchPitchSlot={id:string;position:PlayerPosition;player?:FantasyPlayer|null};
type Props={formationLabel:string;formations:readonly string[];slots:PitchSlot[];benchSlots:BenchPitchSlot[];coach?:FantasyCoach|null;captainId?:string|number|null;tripleCaptainId?:string|number|null;draggingPlayer?:FantasyPlayer|null;onFormationChange:(f:string)=>void;onPlayerClick?:(p:FantasyPlayer)=>void;onBenchPlayerClick?:(p:FantasyPlayer)=>void};
const order:PlayerPosition[]=["FWD","MID","DEF","GK"];
const label:Record<PlayerPosition,string>={FWD:"FORVET",MID:"ORTA SAHA",DEF:"DEFANS",GK:"KALECİ"};
const code:Record<PlayerPosition,string>={GK:"KL",DEF:"DEF",MID:"ORT",FWD:"FOR"};
const base=process.env.NEXT_PUBLIC_BASE_PATH??"";
const asset=(n:string)=>`${base}/game-ui/${n}`;

type RailPanel="fixtures"|"standings"|null;
const fixtureDemo=[
  ["Galatasaray","Beşiktaş","20:00"],
  ["Fenerbahçe","Trabzonspor","20:00"],
  ["Alanyaspor","Göztepe","17:00"],
  ["Samsunspor","Konyaspor","17:00"],
];
const standingsDemo=[
  ["1","Galatasaray","15"],
  ["2","Fenerbahçe","13"],
  ["3","Beşiktaş","12"],
  ["4","Trabzonspor","10"],
  ["5","Samsunspor","9"],
];

export default function FootballPitch(p:Props){
  const[railPanel,setRailPanel]=useState<RailPanel>(null);
  return <>
    <section className="relative mx-auto w-full max-w-[920px] overflow-visible rounded-[30px] border border-cyan-300/15 bg-[#080d1a] p-2 shadow-[0_36px_110px_rgba(0,0,0,.70)] sm:p-2.5">
      <div className="absolute -left-[76px] top-24 z-50 hidden w-[62px] flex-col gap-2 xl:flex">
        <RailButton label="FİKSTÜR" icon="calendar" active={railPanel==="fixtures"} onClick={()=>setRailPanel("fixtures")}/>
        <RailButton label="PUAN" icon="table" active={railPanel==="standings"} onClick={()=>setRailPanel("standings")}/>
      </div>
      <div className="mb-2 flex gap-2 xl:hidden">
        <RailButton compact label="FİKSTÜR" icon="calendar" active={railPanel==="fixtures"} onClick={()=>setRailPanel("fixtures")}/>
        <RailButton compact label="PUAN DURUMU" icon="table" active={railPanel==="standings"} onClick={()=>setRailPanel("standings")}/>
      </div>

      <div className="relative h-[610px] overflow-hidden rounded-[24px] border border-[#dfffe9]/25 bg-[#155d29] shadow-[inset_0_0_120px_rgba(0,20,5,.60),0_24px_48px_rgba(0,0,0,.42)] sm:h-[630px] lg:h-[650px]">
        <img src={asset("pitch-texture.svg")} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover"/>
        <img src={asset("stadium-lights.svg")} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-screen"/>
        <Markings/>
        <div className="absolute left-[4%] top-[3%] z-40"><select value={p.formationLabel} onChange={e=>p.onFormationChange(e.target.value)} className="h-10 min-w-[116px] rounded-full border border-[#f3ca40]/85 bg-[#071017]/95 px-4 text-[13px] font-black text-white">{p.formations.map(f=><option key={f}>{f}</option>)}</select></div>
        <div className="absolute right-[4%] top-[3%] z-30 text-right"><b className="text-[12px] font-black text-[#f3ca40]">FUTBOL IQ</b></div>
        <div className="absolute left-1/2 top-16 flex h-[calc(100%-84px)] w-[94%] -translate-x-1/2 flex-col pb-5"><div className="flex flex-1 flex-col justify-evenly">{order.map(pos=>{const a=p.slots.filter(s=>s.position===pos);return a.length?<motion.div layout="position" key={pos} className="grid h-[112px] items-center justify-items-center gap-1" style={{gridTemplateColumns:`repeat(${a.length},minmax(0,1fr))`}}>{a.map(s=><Field key={s.id} s={s} p={p}/>)}</motion.div>:null})}</div></div>
        <div className="absolute bottom-[4.5%] right-[4%] z-30 grid h-[88px] w-[76px] place-items-center rounded-2xl border-2 border-dashed border-[#f3ca40]/85 bg-black/30 text-center text-[9px] font-black text-[#f3ca40]"><span>★</span><span>JOKER</span></div>
      </div>

      <div className="relative mt-2 overflow-hidden rounded-[26px] border border-white/18 bg-[#07151c] p-3"><img src={asset("dugout-glass.svg")} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-fill opacity-90"/><div className="relative mb-2 flex justify-between"><b className="text-[9px] tracking-[.12em]">YEDEK KULÜBESİ</b><small>{p.benchSlots.filter(s=>s.player).length}/4</small></div><div className="relative grid grid-cols-[74px_repeat(4,minmax(0,1fr))] items-end gap-1.5 sm:gap-3"><Coach coach={p.coach}/>{p.benchSlots.map(s=><Bench key={s.id}s={s}p={p}/>)}</div></div>
    </section>

    {railPanel ? <div className="fixed inset-0 z-[130] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={()=>setRailPanel(null)}><div className="w-full max-w-[520px] overflow-hidden rounded-[26px] border border-cyan-200/15 bg-[linear-gradient(180deg,#0a1e2a,#06131d)] shadow-[0_30px_90px_rgba(0,0,0,.7)]" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between border-b border-white/[.07] px-5 py-4"><div><span className="text-[8px] font-black tracking-[.18em] text-[#00e6a0]">FUTBOL IQ</span><h3 className="mt-1 text-xl font-black text-white">{railPanel==="fixtures"?"Fikstür":"Puan Durumu"}</h3></div><button type="button" onClick={()=>setRailPanel(null)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-xl text-white/65">×</button></div>
      <div className="p-4"><div className="mb-3 rounded-lg border border-amber-300/15 bg-amber-300/[.05] px-3 py-2 text-[8px] font-bold text-amber-100/55">DEMO VERİ · canlı veri bağlantısı geldiğinde otomatik güncellenecek</div>{railPanel==="fixtures"?<FixturePanel/>:<StandingsPanel/>}</div>
    </div></div>:null}
  </>;
}

function RailButton({label,icon,active,onClick,compact=false}:{label:string;icon:"calendar"|"table";active:boolean;onClick:()=>void;compact?:boolean}){return <button type="button" onClick={onClick} className={[compact?"h-10 flex-1 flex-row":"min-h-[108px] w-[62px] flex-col","group flex items-center justify-center gap-2 rounded-2xl border px-2 py-2 text-[8px] font-black tracking-[.08em] transition",active?"border-[#f3ca40]/70 bg-[linear-gradient(180deg,#3a2e0b,#15120a)] text-[#ffe47a] shadow-[0_0_22px_rgba(243,202,64,.16)]":"border-cyan-200/15 bg-[linear-gradient(180deg,#0b1f2b,#07131d)] text-white/62 hover:border-cyan-200/30 hover:text-white"].join(" ")}><span className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-black/20">{icon==="calendar"?<CalendarIcon/>:<TableIcon/>}</span><span className={compact?"":"[writing-mode:vertical-rl] rotate-180"}>{label}</span></button>}
function CalendarIcon(){return <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>}
function TableIcon(){return <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8"><path d="M5 5h14v14H5zM5 10h14M10 5v14M15 5v14"/></svg>}
function FixturePanel(){return <div className="space-y-2">{fixtureDemo.map(([home,away,time])=><div key={`${home}-${away}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-white/[.07] bg-white/[.025] px-3 py-3"><strong className="truncate text-right text-[11px] text-white">{home}</strong><span className="rounded-lg border border-[#00e6a0]/20 bg-[#00e6a0]/10 px-2.5 py-1 text-[9px] font-black text-[#7dffd2]">{time}</span><strong className="truncate text-[11px] text-white">{away}</strong></div>)}</div>}
function StandingsPanel(){return <div className="overflow-hidden rounded-xl border border-white/[.07]"><div className="grid grid-cols-[34px_1fr_54px] bg-white/[.04] px-3 py-2 text-[8px] font-black text-white/35"><span>#</span><span>TAKIM</span><span className="text-right">PUAN</span></div>{standingsDemo.map(([rank,club,pts])=><div key={club} className="grid grid-cols-[34px_1fr_54px] border-t border-white/[.06] px-3 py-3 text-[10px]"><b className="text-[#00e6a0]">{rank}</b><strong className="text-white">{club}</strong><b className="text-right text-[#f3ca40]">{pts}</b></div>)}</div>}
function Field({s,p}:{s:PitchSlot;p:Props}){const ok=!p.draggingPlayer||p.draggingPlayer.position===s.position;const{setNodeRef}=useDroppable({id:s.id,disabled:!ok});return <div ref={setNodeRef} className={`relative grid h-[112px] place-items-center rounded-2xl ${s.invalidPosition?"bg-rose-500/10 ring-1 ring-rose-400/30":""}`}>{s.player?<Drag player={s.player}slot={s.id} captain={s.player.id===p.captainId} invalid={!!s.invalidPosition} click={()=>p.onPlayerClick?.(s.player!)}/>:<Empty pos={s.position}/>}</div>}
function Bench({s,p}:{s:BenchPitchSlot;p:Props}){const ok=!p.draggingPlayer||p.draggingPlayer.position===s.position;const{setNodeRef}=useDroppable({id:s.id,disabled:!ok});return <div ref={setNodeRef} className="relative grid h-[118px] place-items-center overflow-visible rounded-xl border border-white/[.07] bg-[#080d1a]/16">{s.player?<Drag player={s.player}slot={s.id} sub click={()=>p.onBenchPlayerClick?.(s.player!)}/>:<Empty pos={s.position}/>}</div>}
function Drag({player,slot,captain=false,sub=false,invalid=false,click}:{player:FantasyPlayer;slot:string;captain?:boolean;sub?:boolean;invalid?:boolean;click?:()=>void}){const d=useDraggable({id:`player:${player.id}`,data:{sourceSlotId:slot}});const style=d.transform?{transform:`translate3d(${d.transform.x}px,${d.transform.y}px,0)`,touchAction:"none" as const}:{touchAction:"none" as const};return <div ref={d.setNodeRef} style={style}{...d.listeners}{...d.attributes} className={d.isDragging?"relative z-20 opacity-25":"relative z-20"}><PlayerCard compact player={player} captain={captain} substitute={sub} invalidPosition={invalid} onClick={click}/></div>}
function Empty({pos}:{pos:PlayerPosition}){return <div className="grid h-[100px] w-full max-w-[82px] place-items-center rounded-2xl border border-dashed border-white/16 bg-black/10"><span className="rounded-md border border-[#ffe88a]/30 bg-[#07111d]/95 px-2 py-1 text-[9px] font-black tracking-[.05em] text-[#fff0a2]">{code[pos]}</span></div>}
function Coach({coach}:{coach?:FantasyCoach|null}){return <div className="relative mx-auto h-[92px] w-[66px] overflow-hidden rounded-[15px] border border-violet-300/50 bg-[#17142f]"><span className="absolute left-1 top-1 text-[7px] font-black text-cyan-200">TD</span><div className="absolute left-1/2 top-4 h-12 w-10 -translate-x-1/2 rounded-t-full bg-[#20334f]"/><b className="absolute inset-x-1 bottom-1 truncate bg-[#080d1a]/90 p-1 text-center text-[6px]">{coach?.name??"TEKNİK DİREKTÖR"}</b></div>}
function Markings(){return <><div className="absolute inset-[2.8%] border-2 border-white/65"/><div className="absolute left-[2.8%] right-[2.8%] top-1/2 border-t-2 border-white/60"/><div className="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60"/><div className="absolute left-1/2 top-[2.8%] h-[82px] w-[220px] -translate-x-1/2 border-x-2 border-b-2 border-white/55"/><div className="absolute bottom-[2.8%] left-1/2 h-[82px] w-[220px] -translate-x-1/2 border-x-2 border-t-2 border-white/55"/></>}
