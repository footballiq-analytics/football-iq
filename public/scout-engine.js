/* Transparent heuristic model. Probabilities are model estimates, not calibrated guarantees. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.ScoutEngine=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 const n=(x,f=0)=>x!==null&&x!==''&&Number.isFinite(Number(x))?Number(x):f;
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 const key=x=>String(x||'').toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]/g,'');
 const club=x=>{let k=key(x);return ({istanbulbasaksehir:'istanbulbasaksehirfk',basaksehir:'istanbulbasaksehirfk',gaziantep:'gaziantepfk',erzurumspor:'erzurumsporfk',rizespor:'caykurrizespor',amedspor:'amedsk'})[k]||k;};
 function rates(data,week){
  const history=(data.matches||[]).filter(m=>m.week<week&&m.homeGoals!==null&&m.awayGoals!==null);
  const avg=history.length?history.reduce((s,m)=>s+m.homeGoals+m.awayGoals,0)/(2*history.length):1.25;
  const teams={};for(const m of history)for(const side of ['home','away']){
   const t=teams[club(m[side])]||{games:0,gf:0,ga:0,recent:[]};const own=m[side+'Goals'],opp=m[(side==='home'?'away':'home')+'Goals'];
   t.games++;t.gf+=own;t.ga+=opp;t.recent.push({week:m.week,gf:own,ga:opp});teams[club(m[side])]=t;
  }
  for(const t of Object.values(teams)){
   t.recent.sort((a,b)=>b.week-a.week);const recent=t.recent.slice(0,5);let w=0,gf=0,ga=0;
   recent.forEach((m,i)=>{const a=Math.pow(.8,i);w+=a;gf+=m.gf*a;ga+=m.ga*a;});
   // Shrink small samples to the league mean. No subjective club strength ratings.
   t.attack=.65*(t.gf+avg*5)/(t.games+5)+.35*(gf+avg*3)/(w+3);
   t.defence=.65*(t.ga+avg*5)/(t.games+5)+.35*(ga+avg*3)/(w+3);
  }
  return {teams,avg};
 }
 function forecast(m,r){
  const a=r.teams[club(m.home)]||{attack:r.avg,defence:r.avg,games:0};const b=r.teams[club(m.away)]||{attack:r.avg,defence:r.avg,games:0};
  const home=clamp(a.attack*b.defence/r.avg*1.1,.15,4.5),away=clamp(b.attack*a.defence/r.avg*.9,.15,4.5);
  const poisson=l=>{const p=[Math.exp(-l)];for(let i=1;i<=16;i++)p[i]=p[i-1]*l/i;return p;};
  const hp=poisson(home),ap=poisson(away),scores=[];let h=0,d=0,v=0,total=0,over=0,btts=0;
  hp.forEach((p,i)=>ap.forEach((q,j)=>{const prob=p*q;total+=prob;if(i>j)h+=prob;else if(i===j)d+=prob;else v+=prob;if(i+j>2)over+=prob;if(i>0&&j>0)btts+=prob;scores.push({home:i,away:j,prob});}));
  scores.sort((a,b)=>b.prob-a.prob);return {...m,homeLambda:home,awayLambda:away,homeWin:h/total,draw:d/total,awayWin:v/total,over25:over/total,btts:btts/total,top:scores.slice(0,3).map(s=>({...s,prob:s.prob/total})),confidence:Math.min(a.games,b.games)>=8?'Orta':'Düşük'};
 }
 function prepare(data,week){const r=rates(data,week);return {week,r,fixtures:(data.matches||[]).filter(m=>m.week===week).map(m=>forecast(m,r))};}
 function project(raw,ctx){
  const p={...raw};p.baseStartProb=raw.baseStartProb??raw.startProb;const missing=[];const pos=p.pos;const prior=({GK:[.002,.005],DF:[.055,.04],MF:[.16,.13],FW:[.32,.1]})[pos]||[.1,.1];
  const fixture=ctx?.fixtures.find(m=>club(m.home)===club(p.team)||club(m.away)===club(p.team));
  const isHome=fixture?club(fixture.home)===club(p.team):null;
  p.opponent=fixture?(isHome?fixture.away:fixture.home):'—';p.home=isHome;
  const ownLambda=fixture?(isHome?fixture.homeLambda:fixture.awayLambda):1.25;
  const oppLambda=fixture?(isHome?fixture.awayLambda:fixture.homeLambda):1.25;
  p.fixtureMult=clamp(ownLambda/(ctx?.r.avg||1.25),.4,2);
  p.cleanSheetProb=Math.exp(-oppLambda);
  const matches=Array.isArray(p.lastMatches)?p.lastMatches.filter(m=>Number.isFinite(m.minutes)&&m.minutes>=0).slice(0,5):[];
  const minutes=n(p.min),mp=n(p.mp),sample=minutes/(minutes+450);
  const hasStats=!p.rosterOnly&&minutes>0;
  let gx=hasStats?n(p.xg90,n(p.xg)*90/Math.max(90,minutes)):prior[0],ax=hasStats?n(p.xa90,n(p.xa)*90/Math.max(90,minutes)):prior[1];
  gx=sample*gx+(1-sample)*prior[0];ax=sample*ax+(1-sample)*prior[1];
  if(matches.length){let w=0,g=0,a=0;matches.forEach((m,i)=>{if(m.minutes<=0)return;const weight=Math.pow(.75,i);w+=weight;g+=n(m.xg)*90/m.minutes*weight;a+=n(m.xa)*90/m.minutes*weight;});if(w){const k=Math.min(.4,matches.length*.08);gx=gx*(1-k)+g/w*k;ax=ax*(1-k)+a/w*k;}}
  else missing.push('Son 5 maç ayrıntısı yok');
  if(!hasStats)missing.push('xG/xA için mevki ortalaması kullanıldı');
  const avg=mp?minutes/mp:0;
  const recentStart=matches.length?matches.reduce((s,m)=>s+(m.started===true?1:0),0)/matches.length:null;
  let start=recentStart!==null?.65*recentStart+.35*n(p.baseStartProb,.5):n(p.baseStartProb,avg?clamp(avg/85,.1,.95):.35);
  if(!hasStats&&!matches.length)missing.push('Oynama süresi belirsiz');
  const rest=p.restDays==null?null:n(p.restDays);if(rest!==null&&rest<4)start*=.88;
  if(p.rotationRisk!=null)start*=1-clamp(n(p.rotationRisk),0,.8);
  if(p.doubtful)start*=.6;
  const risk=clamp(n(p.injuryRisk),0,1);start*=1-risk;
  if(p.unavailable||p.suspended)start=0;
  p.startProb=clamp(start,0,1);
  const startMinutes=clamp(n(p.minutesWhenStarting,avg?Math.max(60,avg):75),0,90);
  const sub=p.unavailable||p.suspended?0:(1-p.startProb)*.25*(1-risk)*(p.doubtful?.6:1);
  p.expectedMinutes=p.startProb*startMinutes+sub*18;
  const playing=p.expectedMinutes/90;
  p.goalExpectation=gx*playing*p.fixtureMult;
  p.assistExpectation=ax*playing*p.fixtureMult;
  // Set-piece roles are explanatory only: historic xG/xA already includes their contribution.
  const appearance=p.startProb*(startMinutes>=60?2:1)+sub;
  const goal=p.goalExpectation*({GK:6,DF:6,MF:5,FW:4}[pos]||4),assist=p.assistExpectation*3;
  const clean=({GK:4,DF:4,MF:1,FW:0}[pos]||0)*p.cleanSheetProb*p.startProb*(startMinutes>=60?1:0);
  const conceded=(pos==='GK'||pos==='DF')?oppLambda*playing*.5:0;
  const saves=pos==='GK'&&p.saves90!=null?n(p.saves90)*playing/3:0;
  const cards=p.yellow90!=null?n(p.yellow90)*playing:0;
  if(pos==='GK'&&p.saves90==null)missing.push('Kurtarış verisi yok');
  if(p.yellow90==null)missing.push('Kart oranı yok');
  if(!fixture)missing.push('Haftalık fikstür yok');
  p.components={appearance,goal,assist,clean,saves,conceded,cards};
  p.xp=Math.max(0,appearance+goal+assist+clean+saves-conceded-cards);
  p.goalProb=1-Math.exp(-p.goalExpectation);p.assistProb=1-Math.exp(-p.assistExpectation);
  p.eff=p.xp/Math.max(.1,n(p.price,6));p.score=p.xp;
  p.confidence=hasStats?(matches.length?'Orta':'Sınırlı'):'Düşük';p.missing=missing;
  p.excluded=!!(p.unavailable||p.suspended||!fixture||fixture.homeGoals!==null);
  p.rosterOnly=!hasStats;return p;
 }
 function objective(list,quotas,score){let val=0;const xi=[];for(const [pos,count] of Object.entries(quotas)){const group=list.filter(p=>p.pos===pos).sort((a,b)=>score(b)-score(a));xi.push(...group.slice(0,count));val+=group.slice(count).reduce((s,p)=>s+.25*score(p),0);}return val+xi.reduce((s,p)=>s+score(p),0)+Math.max(0,...xi.map(score));}
 return {key,club,prepare,project,objective,forecast,rates};
});
