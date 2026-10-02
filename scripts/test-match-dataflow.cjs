const fs=require('fs'),assert=require('node:assert/strict');
const E=require('../public/scout-engine.js'),R=require('../public/scout-rules.js');
const d=JSON.parse(fs.readFileSync('public/data/analysis-context.json'));
const x=JSON.parse(fs.readFileSync('out/data/match-enrichment.json'));
assert.equal(x.season,d.season);assert(R.fresh(x.updatedAt,Date.now()));
assert(x.report.fetched>0);assert.equal(x.report.xgMatches,Object.keys(x.matchStats).length);
for(const [id,s] of Object.entries(x.matchStats)){
 const match=d.matches.find(m=>m.id===id);assert(match&&match.status==='finished');
 assert(Number.isFinite(s.homeXg)&&Number.isFinite(s.awayXg));assert(s.source.startsWith('https://www.fotmob.com/'));
}
for(const m of d.matches)if(!m.kickoff&&x.matchDetails[m.id])m.kickoff=x.matchDetails[m.id].kickoff;
const week=R.weeks(d).forecast;
const withXg=E.prepare({...d,matchStats:x.matchStats},week),without=E.prepare({...d,matchStats:{}},week);
if(Object.keys(x.matchStats).length){assert(withXg.r.xgCount>0);assert(withXg.fixtures.some((m,i)=>m.homeLambda!==without.fixtures[i].homeLambda||m.awayLambda!==without.fixtures[i].awayLambda));}
for(const [id,p] of Object.entries(x.players)){
 assert.equal(p.allCompetitionsComplete,false);
 assert.equal(R.eligibility({id},x,p.week).eligible,false);
 assert.equal(R.draftAllowed({id},x,p.week),false);
}
for(const m of withXg.fixtures)assert(Math.abs(m.homeWin+m.draw+m.awayWin-1)<1e-9);
console.log(JSON.stringify({matched:x.report.matchedFixtures,downloaded:x.report.fetched,xgUsed:withXg.r.xgCount,forecastCount:withXg.fixtures.length,riskyPlayersExcluded:Object.keys(x.players).length,minutes:x.report.playerMinuteRecords,verified:true}));
