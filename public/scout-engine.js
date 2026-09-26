/* Transparent heuristic model. Probabilities are model estimates, not calibrated guarantees. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.ScoutEngine=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 const n=(x,f=0)=>x!==null&&x!==''&&Number.isFinite(Number(x))?Number(x):f;
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 const key=x=>String(x||'').toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]/g,'');
 const club=x=>{let k=key(x);return ({istanbulbasaksehir:'istanbulbasaksehirfk',basaksehir:'istanbulbasaksehirfk',gaziantep:'gaziantepfk',erzurumspor:'erzurumsporfk',rizespor:'caykurrizespor',amedspor:'amedsk'})[k]||k;};
 const finite=x=>typeof x==='number'&&Number.isFinite(x);
 const score=x=>Number.isInteger(x)&&x>=0&&x<=30;
 const date=x=>typeof x==='string'?Date.parse(x):NaN;
 function cutoffFor(data,week){
  const dates=(data.matches||[]).filter(m=>m.week===week).map(m=>date(m.kickoff)).filter(Number.isFinite);
  return dates.length?Math.min(Date.now(),...dates):Date.now();
 }
 function rates(data,week,options={}){
  const cutoff=options.cutoff??cutoffFor(data,week),seen=new Set();
  const history=(data.matches||[]).filter(m=>{
   const id=m.id??[m.week,club(m.home),club(m.away)].join('|');
   if(seen.has(id)||!Number.isInteger(m.week)||m.week>=week||m.status!=='finished'||!score(m.homeGoals)||!score(m.awayGoals)||!club(m.home)||club(m.home)===club(m.away))return false;
   if(Number.isFinite(date(m.kickoff))&&date(m.kickoff)+3*3600000>=cutoff)return false;
   if(Number.isFinite(date(m.finishedAt))&&date(m.finishedAt)>=cutoff)return false;
   seen.add(id);return true;
  });
  let xgCount=0;
  const rows=history.map(m=>{
   const x=data.matchStats?.[m.id];
   const use=!!(!options.resultsOnly&&x?.source&&date(x.availableAt)<=cutoff&&finite(x.homeXg)&&finite(x.awayXg)&&x.homeXg>=0&&x.awayXg>=0&&x.homeXg<=15&&x.awayXg<=15);
   if(use)xgCount++;
   return {...m,h:use?.65*x.homeXg+.35*m.homeGoals:m.homeGoals,a:use?.65*x.awayXg+.35*m.awayGoals:m.awayGoals,w:Math.pow(.85,Math.max(0,week-m.week-1))};
  });
  const weight=rows.reduce((v,m)=>v+m.w,0);
  const homeAvg=(rows.reduce((v,m)=>v+m.w*m.h,0)+13.5)/(weight+10);
  const awayAvg=(rows.reduce((v,m)=>v+m.w*m.a,0)+11.5)/(weight+10),avg=(homeAvg+awayAvg)/2;
  const teams={};for(const m of rows)for(const side of ['home','away']){
   const k=club(m[side]);if(!teams[k])teams[k]={games:0,attack:avg,defence:avg,af:1,df:1,homeGames:0,awayGames:0};
   teams[k].games++;teams[k][side+'Games']++;
  }
  // Three regularized opponent-adjustment passes; weights/priors are explicit heuristics.
  for(let pass=0;pass<3;pass++){
   const next={};for(const k of Object.keys(teams)){
    let gf=5,ga=5,w=5;
    for(const m of rows){const isHome=club(m.home)===k;if(!isHome&&club(m.away)!==k)continue;
     const opp=teams[club(isHome?m.away:m.home)];const ownBase=isHome?homeAvg:awayAvg,oppBase=isHome?awayAvg:homeAvg;
     gf+=m.w*(isHome?m.h:m.a)/Math.max(.15,ownBase*opp.df);
     ga+=m.w*(isHome?m.a:m.h)/Math.max(.15,oppBase*opp.af);w+=m.w;
    }next[k]={af:clamp(gf/w,.4,2.5),df:clamp(ga/w,.4,2.5)};
   }
   for(const k of Object.keys(teams))Object.assign(teams[k],next[k]);
  }
  for(const [k,t] of Object.entries(teams)){
   t.attack=t.af*avg;t.defence=t.df*avg;t.venue={};
   for(const side of ['home','away']){
    let gf=6,ga=6,w=6;for(const m of rows){if(club(m[side])!==k)continue;const h=side==='home';const opp=teams[club(h?m.away:m.home)];
     gf+=m.w*(h?m.h:m.a)/Math.max(.15,(h?homeAvg:awayAvg)*t.af*opp.df);
     ga+=m.w*(h?m.a:m.h)/Math.max(.15,(h?awayAvg:homeAvg)*t.df*opp.af);w+=m.w;
    }t.venue[side]={attack:clamp(gf/w,.75,1.25),defence:clamp(ga/w,.75,1.25)};
   }
  }
  return {teams,avg,homeAvg,awayAvg,historyCount:history.length,xgCount,undatedCount:history.filter(m=>!Number.isFinite(date(m.kickoff))).length};
 }
 function distribution(home,away){
  const poisson=l=>{const p=[Math.exp(-l)];for(let i=1;i<=20;i++)p[i]=p[i-1]*l/i;return p;};
  const hp=poisson(home),ap=poisson(away),scores=[];let h=0,d=0,v=0,total=0,over=0,btts=0;
  hp.forEach((p,i)=>ap.forEach((q,j)=>{const prob=p*q;total+=prob;if(i>j)h+=prob;else if(i===j)d+=prob;else v+=prob;if(i+j>2)over+=prob;if(i>0&&j>0)btts+=prob;scores.push({home:i,away:j,prob});}));
  scores.sort((a,b)=>b.prob-a.prob);
  return {homeLambda:home,awayLambda:away,homeWin:h/total,draw:d/total,awayWin:v/total,over25:over/total,btts:btts/total,homeCleanSheet:Math.exp(-away),awayCleanSheet:Math.exp(-home),top:scores.slice(0,3).map(s=>({...s,prob:s.prob/total}))};
 }
 function forecast(m,r){
  const prior={af:1,df:1,games:0,venue:{home:{attack:1,defence:1},away:{attack:1,defence:1}}};
  const a=r.teams[club(m.home)]||prior,b=r.teams[club(m.away)]||prior;
  const home=clamp(r.homeAvg*a.af*b.df*a.venue.home.attack*b.venue.away.defence,.15,4.5);
  const away=clamp(r.awayAvg*b.af*a.df*b.venue.away.attack*a.venue.home.defence,.15,4.5);
  return {...m,...distribution(home,away),confidence:'Düşük',sample:Math.min(a.games,b.games),reasons:[
   'Rakibe göre düzeltilmiş hücum / savunma: '+a.af.toFixed(2)+' / '+a.df.toFixed(2)+' ve '+b.af.toFixed(2)+' / '+b.df.toFixed(2),
   'Ev/deplasman ayrımı; son maçlara daha fazla ağırlık; '+a.games+' ve '+b.games+' geçmiş maç',
   r.xgCount?'Kaynak ve zamanı doğrulanmış '+r.xgCount+' maçta xG kullanıldı':'xG kaynağı yok: gerçek gol sonuçlarıyla sınırlı model'
  ],missing:['Güncel kadro eksiklerinin sayısal etkisi doğrulanmadı','Hava, zemin ve taktik etkisi için doğrulanmış katsayı yok']};
 }
 function prepare(data,week){const r=rates(data,week);return {week,r,fixtures:(data.matches||[]).filter(m=>m.week===week).map(m=>forecast(m,r))};}
 function backtest(data){
  const records=[],weeks=[...new Set((data.matches||[]).filter(m=>m.status==='finished').map(m=>m.week))].sort((a,b)=>a-b);
  const bins=Array.from({length:5},()=>({n:0,p:0,hit:0}));
  for(const week of weeks){if(week<3)continue;const r=rates(data,week,{resultsOnly:true});if(r.historyCount<18)continue;
   const prior=distribution(r.homeAvg,r.awayAvg),seen=new Set();
   for(const m of data.matches.filter(m=>m.week===week&&m.status==='finished'&&score(m.homeGoals)&&score(m.awayGoals))){
    const id=m.id??[week,m.home,m.away].join('|');if(seen.has(id))continue;seen.add(id);
    const f=forecast(m,r),ps=[f.homeWin,f.draw,f.awayWin],base=[prior.homeWin,prior.draw,prior.awayWin];
    const actual=m.homeGoals>m.awayGoals?0:m.homeGoals===m.awayGoals?1:2,choice=ps.indexOf(Math.max(...ps)),hit=choice===actual?1:0;
    const brier=p=>p.reduce((s,p,i)=>s+(p-(i===actual?1:0))**2,0);
    const bin=bins[Math.min(4,Math.floor(ps[choice]*5))];bin.n++;bin.p+=ps[choice];bin.hit+=hit;
    records.push({week,id,home:m.home,away:m.away,homeGoals:m.homeGoals,awayGoals:m.awayGoals,top:f.top[0],hit,exact:f.top[0].home===m.homeGoals&&f.top[0].away===m.awayGoals?1:0,brier:brier(ps),baselineBrier:brier(base),logLoss:-Math.log(Math.max(1e-12,ps[actual]))});
   }
  }
  const mean=k=>records.length?records.reduce((s,r)=>s+r[k],0)/records.length:null;
  return {count:records.length,brier:mean('brier'),baselineBrier:mean('baselineBrier'),accuracy:mean('hit'),exact:mean('exact'),logLoss:mean('logLoss'),bins:bins.filter(b=>b.n).map(b=>({count:b.n,predicted:b.p/b.n,observed:b.hit/b.n})),records,method:'Geriye dönük, hafta sıralı sonuç modeli testi. Gerçek zamanlı tahmin arşivi değildir; sonradan düzeltilen sonuçlar ve tarihsiz maçlar sınırlılık yaratır. xG ve bugünkü kadro bilgileri teste katılmaz.'};
 }
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
  if(finite(p.verifiedStartProbability)&&p.verifiedStartProbability>=0&&p.verifiedStartProbability<=1&&!p.unavailable&&!p.suspended)start=p.verifiedStartProbability;
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
  p.roleNotes=Array.isArray(p.verifiedRoles)?p.verifiedRoles:[];
  p.xp=Math.max(0,appearance+goal+assist+clean+saves-conceded-cards);
  p.goalProb=1-Math.exp(-p.goalExpectation);p.assistProb=1-Math.exp(-p.assistExpectation);
  p.eff=p.xp/Math.max(.1,n(p.price,6));p.score=p.xp;
  p.confidence=hasStats?(matches.length?'Orta':'Sınırlı'):'Düşük';p.missing=missing;
  p.excluded=!!(p.unavailable||p.suspended||!fixture||fixture.homeGoals!==null);
  p.rosterOnly=!hasStats;return p;
 }
 function objective(list,quotas,score){let val=0;const xi=[];for(const [pos,count] of Object.entries(quotas)){const group=list.filter(p=>p.pos===pos).sort((a,b)=>score(b)-score(a));xi.push(...group.slice(0,count));val+=group.slice(count).reduce((s,p)=>s+.25*score(p),0);}return val+xi.reduce((s,p)=>s+score(p),0)+Math.max(0,...xi.map(score));}
 return {key,club,prepare,project,objective,forecast,rates,backtest,distribution};
});
