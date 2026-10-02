"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { injuryIndex, injuryIsCurrent, injuryKey, type InjuryRecord } from '@/lib/player-injury';

const Injuries = createContext<{ records: Record<string, InjuryRecord>; now: number }>({ records: {}, now: 0 });
export function InjuryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({ records: {} as Record<string, InjuryRecord>, now: 0 });
  useEffect(() => {
    const controller = new AbortController();
    let inFlight = false, lastCheck = 0;
    const refresh = async () => {
      const now = Date.now();
      setState(previous => ({ ...previous, now }));
      if (inFlight || now - lastCheck < 15 * 60000) return;
      inFlight = true;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/data/tff-scout.json`, { cache: 'no-store', signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        if (!Array.isArray(data.players) || !data.players.length) return;
        if (!controller.signal.aborted) { setState({ records: injuryIndex(data), now: Date.now() }); lastCheck = Date.now(); }
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
  const { records, now } = useContext(Injuries);
  const record = records[injuryKey(name, club)];
  if (!record) return null;
  const current = injuryIsCurrent(record, now);
  const label = current ? 'Sakatlık kaydı' : 'Eski sakatlık kaydı · yeniden kontrol edilmeli';
  const description = `${name}: ${label}. Son kontrol: ${new Date(record.checkedAt).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}. Kaynak: ${record.source}`;
  return <span className={`fiq-injury-badge${onCard ? ' fiq-injury-on-card' : ''}`} data-stale={!current} role="img" aria-label={description} title={description}>
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m12 3 10 18H2Z"/><path d="M12 9v5m0 3v1"/></svg>
    <span>{current ? 'Sakat' : 'Kontrol gerekli'}</span>
  </span>;
}
