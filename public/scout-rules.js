(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.ScoutRules=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 const time=x=>typeof x==='string'?Date.parse(x):NaN;
 const fresh=(x,now,hours=72)=>Number.isFinite(time(x))&&time(x)<=now&&now-time(x)<=hours*3600000;
 const finished=m=>m.status==='finished';
 const started=(m,now)=>finished(m)||m.status==='live'||(Number.isFinite(time(m.kickoff))&&time(m.kickoff)<=now);
 function weeks(data,now=Date.now()){
  const matches=data.matches||[],rounds=[...new Set(matches.map(m=>m.week))].sort((a,b)=>a-b);
  const complete=w=>{const ms=matches.filter(m=>m.week===w);return ms.length===9&&ms.every(finished);};
  const active=rounds.find(w=>!complete(w));
  if(!active)return {recommendation:null,forecast:null,completed:rounds.at(-1)||null,locked:false};
  const begun=matches.some(m=>m.week===active&&started(m,now));
  // A postponed/unfinished match blocks next week's forecasts as requested.
  const recommendation=begun?(rounds.find(w=>w>active)||null):active;
  const datesKnown=matches.filter(m=>m.week===active).every(m=>Number.isFinite(time(m.kickoff)));
  return {recommendation,forecast:active,completed:rounds.filter(w=>w<active&&complete(w)).at(-1)||null,locked:begun,datesKnown};
 }
 function eligibility(p,evidence,week,now=Date.now()){
  const reasons=[];const e=evidence?.players?.[p.id];
  if(p.unavailable)reasons.push('Sakat');if(p.suspended)reasons.push('Cezalı');if(p.doubtful)reasons.push('Oynama durumu şüpheli');
  if(!e||e.week!==week||!e.source||!fresh(e.verifiedAt,now))reasons.push('Bu hafta için güncel oynama bilgisi doğrulanmadı');
  if(e?.availability!=='available')reasons.push('Maç için uygunluğu doğrulanmadı');
  if(!Number.isFinite(e?.startProbability)||e.startProbability<.8||e.startProbability>1)reasons.push('İlk 11 ihtimali %80 altında veya bilinmiyor');
  if(e?.riskFlags?.length)reasons.push(...e.riskFlags);
  if(e?.rotationRisk>0||e?.injuryRisk>0||p.injuryRisk>0)reasons.push('Rotasyon / sakatlık riski');
  const health=workload(e,now);
  if(!health.complete)reasons.push('Tüm organizasyonlardaki maç yükü doğrulanmadı');
  if(health.highRisk)reasons.push('Kısa dinlenme ve yüksek maç yükü');
  return {eligible:reasons.length===0,reasons:[...new Set(reasons)],evidence:e||null,health};
 }
 function workload(e,now=Date.now()){
  const verified=!!(e?.source&&fresh(e?.verifiedAt,now));
  const kickoff=time(e?.nextKickoff);
  const ms=verified&&Array.isArray(e?.recentAppearances)?e.recentAppearances.filter(m=>m.source&&fresh(m.verifiedAt,now)&&Number.isFinite(time(m.kickoff))&&time(m.kickoff)<kickoff&&Number.isFinite(m.minutes)&&m.minutes>=0&&m.minutes<=130):[];
  const last=ms.slice().sort((a,b)=>time(b.kickoff)-time(a.kickoff))[0];
  const rest=last?(kickoff-time(last.kickoff))/3600000:null;
  const minutes7=ms.filter(m=>kickoff-time(m.kickoff)<=7*86400000).reduce((s,m)=>s+m.minutes,0);
  const complete=verified&&e?.allCompetitionsComplete===true&&Number.isFinite(kickoff);
  const highRisk=complete&&((rest!==null&&rest<72&&last.minutes>=60)||(Number.isFinite(e?.travelKm)&&e.travelKm>=1500&&rest!==null&&rest<96&&last.minutes>=60)||minutes7>=240);
  return {restHours:rest,minutes7:complete?minutes7:null,complete,highRisk,travelKm:verified&&Number.isFinite(e?.travelKm)&&e.travelKm>=0?e.travelKm:null,venue:verified&&typeof e?.home==='boolean'?(e.home?'Ev':'Deplasman'):'Bilinmiyor',motivation:verified&&e?.motivationSource&&typeof e?.motivationNote==='string'?e.motivationNote:'Doğrulanmış motivasyon bilgisi yok'};
 }
 function weeklyBest(catalog,evidence,week,formation){
  const feed=evidence?.weeklyScores;
  if(!week||!feed||feed.week!==week||feed.complete!==true||!feed.source||!Array.isArray(feed.players))return {error:'Son tamamlanan haftanın doğrulanmış oyuncu puanları henüz yok. Tahminî xP ile haftanın kadrosu oluşturulmadı.'};
  const seen=new Set(),pool=[];
  for(const row of feed.players){const p=catalog.find(p=>p.id===row.id);if(!p||seen.has(row.id)||!Number.isFinite(row.points))continue;seen.add(row.id);pool.push({...p,actualPoints:row.points});}
  const xi=[],bench=[];
  for(const [pos,need] of Object.entries(formation)){
   const group=pool.filter(p=>p.pos===pos).sort((a,b)=>b.actualPoints-a.actualPoints||String(a.id).localeCompare(String(b.id)));
   if(group.length<need+1)return {error:'Doğrulanmış puanlar 11 + 4 kadroyu tamamlamak için yetersiz.'};
   xi.push(...group.slice(0,need));bench.push(group[need]);
  }
  return {xi,bench,source:feed.source,week,total:xi.reduce((s,p)=>s+p.actualPoints,0)};
 }
 return {weeks,eligibility,workload,weeklyBest,fresh};
});
