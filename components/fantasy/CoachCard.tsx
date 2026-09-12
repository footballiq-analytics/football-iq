"use client";
import { useEffect, useRef, useState } from "react";
import type { FantasyCoach } from "@/data/superlig-coaches-2026";
import { useLongPress } from "@/components/interaction/useLongPress";

export default function CoachCard({coach,onRemove,onSelect}:{coach?:FantasyCoach|null;onRemove?:()=>void;onSelect?:()=>void}) {
 const [mode,setMode]=useState<"actions"|"detail"|null>(null);
 const dialog=useRef<HTMLDialogElement>(null);
 const long=useLongPress(()=>{if(coach)setMode("detail")},{delay:500,moveTolerance:4});
 useEffect(()=>{if(mode&&!dialog.current?.open)dialog.current?.showModal();},[mode]);
 const close=()=>{dialog.current?.close();setMode(null)};
 return <div className="fiq-coach-card">
  <button type="button" className="fiq-coach-face" {...long} onClick={()=>coach?setMode("actions"):onSelect?.()} aria-label={coach?`${coach.name} teknik direktör kartı`:"Teknik direktör seç"}>
   <span className="fiq-coach-position">TD</span>
   <span className="fiq-coach-emblem" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><path d="M16 46C5 34 10 15 22 9M48 46C59 34 54 15 42 9M13 30l9 4M12 21l9 5M51 30l-9 4M52 21l-9 5" stroke="currentColor" strokeWidth="3"/><circle cx="32" cy="23" r="9" fill="currentColor"/><path d="M19 48V42c0-11 26-11 26 0v6L32 55Z" fill="currentColor"/><path d="m28 36 4 6 4-6M32 42v10" stroke="#fff3d5" strokeWidth="2"/></svg></span>
   <strong className="fiq-coach-name">{coach?.name??"TD SEÇ"}</strong><small className="fiq-coach-caption">TEKNİK DİREKTÖR</small>
  </button>
  {coach?<button type="button" data-card-remove="true" className="fiq-card-remove fiq-coach-remove" aria-label={`${coach.name} teknik direktörü çıkar`} onClick={onRemove}>×</button>:null}
  <dialog ref={dialog} className="fiq-coach-dialog" onClose={()=>setMode(null)} aria-label={mode==="detail"?"Teknik direktör bilgileri":"Teknik direktör aksiyonları"}>
   <button type="button" className="fiq-dialog-close" onClick={close} aria-label="Teknik direktör penceresini kapat">×</button>
   <small>TEKNİK DİREKTÖR</small><h2>{coach?.name}</h2><p>{coach?.club}</p>
   {mode==="detail"?<><dl><dt>Ülke</dt><dd>{coach?.country}</dd><dt>Kadro</dt><dd>15 futbolcudan ayrı</dd><dt>Bütçe</dt><dd>Futbolcu bütçesine dahil değil</dd><dt>Haftalık performans</dt><dd>VERİ BEKLENİYOR</dd></dl><button type="button" onClick={()=>setMode("actions")}>AKSİYONLARA DÖN</button></>:<><button type="button" onClick={()=>setMode("detail")}>TEKNİK DİREKTÖR BİLGİLERİ</button><button type="button" onClick={()=>{close();onSelect?.()}}>TEKNİK DİREKTÖR DEĞİŞTİR</button><button type="button" onClick={()=>{close();onRemove?.()}}>KADRODAN ÇIKAR</button></>}
  </dialog>
 </div>;
}
