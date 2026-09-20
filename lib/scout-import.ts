import { FORMATIONS, FORMATION_POSITIONS, type Formation, type Player } from '@/store/useTeamStore';
export function validateScoutImport(raw: unknown, players: Player[]) {
 if(!raw || typeof raw !== 'object')throw new Error('Kadro aktarım dosyası okunamadı.');
 const p=raw as Record<string,unknown>;
 if(p.version!==2)throw new Error('Eski analiz önerisi. Analiz sayfasından yeniden gönder.');
 if(typeof p.formation!=='string'||!FORMATIONS.includes(p.formation as Formation))throw new Error('Geçersiz diziliş.');
 const formation=p.formation as Formation;
 const resolve=(ids:unknown,count:number)=>{
  if(!Array.isArray(ids)||ids.length!==count||ids.some(id=>typeof id!=='string'))throw new Error('11 ilk ve 4 yedek gerekli.');
  return ids.map(id=>{const player=players.find(x=>x.id===id);if(!player)throw new Error('Önerideki oyuncu artık havuzda yok; yeniden analiz et.');return player;});
 };
 const starters=resolve(p.startingIds,11),bench=resolve(p.benchIds,4),all=[...starters,...bench];
 if(new Set(all.map(x=>x.id)).size!==15)throw new Error('Aynı oyuncu iki kez eklenemez.');
 const counts=new Map<string,number>();all.forEach(x=>counts.set(x.club,(counts.get(x.club)||0)+1));
 if([...counts.values()].some(n=>n>3))throw new Error('Kulüp başına 3 oyuncu sınırı aşıldı.');
 const cost=all.reduce((s,x)=>s+x.price,0);
 if(cost>100.0001)throw new Error('Oyun fiyatları değişmiş; 100M için yeniden analiz et.');
 const desired=FORMATION_POSITIONS[formation];
 const ordered=desired.map(pos=>{const i=starters.findIndex(p=>p.position===pos);if(i<0)throw new Error('İlk 11 dizilişe uymuyor.');return starters.splice(i,1)[0].id;});
 const benchIds=(['GK','DEF','MID','FWD'] as const).map(pos=>{const i=bench.findIndex(p=>p.position===pos);if(i<0)throw new Error('Her mevkiden bir yedek gerekli.');return bench.splice(i,1)[0].id;});
 if(typeof p.captain!=='string'||typeof p.viceCaptain!=='string'||p.captain===p.viceCaptain||!ordered.includes(p.captain)||!ordered.includes(p.viceCaptain))throw new Error('Kaptanlar farklı ve ilk 11 içinde olmalı.');
 if(typeof p.createdAt!=='string'||!Number.isFinite(Date.parse(p.createdAt))||Math.abs(Date.now()-Date.parse(p.createdAt))>86400000)throw new Error('Öneri eskimiş; yeniden analiz et.');
 return {formation,startingIds:ordered,benchIds,captain:p.captain,viceCaptain:p.viceCaptain,cost};
}
