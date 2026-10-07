"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { injuryIndex, injuryIsCurrent, injuryKey, suspensionIndex, type SuspensionRecord, type InjuryRecord } from '@/lib/player-injury';

const Injuries = createContext<{ records: Record<string, InjuryRecord>; suspensions: Record<string, SuspensionRecord>; now: number }>({ records: {}, suspensions: {}, now: 0 });
export function InjuryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({ records: {} as Record<string, InjuryRecord>, suspensions: {} as Record<string, SuspensionRecord>, now: 0 });
  useEffect(() => {
    const controller = new AbortController();
    let inFlight = false, lastCheck = 0;
    const refresh = async () => {
      const now = Date.now();
      setState(previous => ({ ...previous, now }));
      if (inFlight || now - lastCheck < 15 * 60000) return;
      inFlight = true;
      try {
        const results = await Promise.allSettled(['tff-scout.json','match-enrichment.json'].map(async file => {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/data/${file}`, {cache:'no-store',signal:controller.signal});
          if (!response.ok) throw new Error('Status feed unavailable');
          return response.json();
        }));
        if (!controller.signal.aborted) {
          setState(previous => ({records:results[0].status==='fulfilled' ? injuryIndex(results[0].value) : previous.records,
            suspensions:results[1].status==='fulfilled' ? suspensionIndex(results[1].value) : previous.suspensions, now:Date.now()}));
          lastCheck=Date.now();
        }
      } catch { /* Retain the last sourced warning; never mark a player fit on failure. */ }
      finally { inFlight = false; }
    };
    void refresh();
    const timer = window.setInterval(() => { void refresh(); }, 60000);
    window.addEventListener('focus', refresh);
    return () => { controller.abort(); window.clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, []);
  return <Injuries.Provider value={state}>{children}</Injuries.Provider>;
}
export default function InjuryBadge({ name, club, onCard = false }: { name: string; club: string; onCard?: boolean }) {
  const { records, suspensions, now } = useContext(Injuries);
  const key=injuryKey(name,club), injury=records[key], suspension=suspensions[key];
  const warnings: {record:InjuryRecord;kind:string;label:string;detail:string}[]=[];
  if(injury) warnings.push({record:injury,kind:'injury',label:injuryIsCurrent(injury,now)?'Sakat':'Kontrol gerekli',detail:'Sakatlık kaydı'});
  if(suspension && Date.parse(suspension.kickoff)>now && injuryIsCurrent(suspension,now)) warnings.push({record:suspension,kind:'suspended',label:'Kart cezalısı',detail:`${suspension.week}. hafta · Maça özel kart cezası`});
  if(!warnings.length)return null;
  return <span className="fiq-player-warnings" data-on-card={onCard}>{warnings.map(({record,kind,label,detail})=>{
   const description=`${name}: ${detail}. Son kontrol: ${new Date(record.checkedAt).toLocaleString('tr-TR',{timeZone:'Europe/Istanbul'})}. Kaynak: ${record.source}`;
   return <span key={kind} className="fiq-injury-badge" data-kind={kind} data-stale={!injuryIsCurrent(record,now)} role="img" aria-label={description} title={description}>
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2">{kind==='suspended'?<rect x="6" y="3" width="12" height="18" rx="2"/>:<><path d="m12 3 10 18H2Z"/><path d="M12 9v5m0 3v1"/></>}</svg><span>{label}</span>
   </span>;
  })}</span>;
}
