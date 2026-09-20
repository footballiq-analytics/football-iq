const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const E=require('../public/scout-engine.js');
const data=JSON.parse(fs.readFileSync('public/data/analysis-context.json'));
const ctx=E.prepare(data,data.recommendedWeek);
assert.equal(ctx.fixtures.length,9);
for(const f of ctx.fixtures){assert(Math.abs(f.homeWin+f.draw+f.awayWin-1)<1e-9);assert(f.top[0].prob>0&&f.top[0].prob<1);}
const sample={team:ctx.fixtures[0].home,pos:'FW',min:900,mp:10,xg90:.6,xa90:.2,price:8,startProb:.9};
const high=E.project(sample,ctx),low=E.project({...sample,startProb:.1},ctx);
assert(low.xp<high.xp);assert(low.goalExpectation<high.goalExpectation);
assert.equal(E.project({...sample,suspended:true},ctx).xp,0);
assert.equal(E.project({...sample,unavailable:true},ctx).xp,0);
const doubtful=E.project({...sample,doubtful:true},ctx);assert.equal(E.project(doubtful,ctx).xp,doubtful.xp);
assert.equal(E.project({...sample,penalty:true,corner:true},ctx).xp,high.xp);
assert.equal(E.project({...sample,rosterOnly:true},ctx).confidence,'Düşük');
// Later results must not leak into earlier match forecasts.
const changed=JSON.parse(JSON.stringify(data));changed.matches.filter(m=>m.week>=data.recommendedWeek).forEach(m=>{m.homeGoals=9;m.awayGoals=8});
assert.deepEqual(E.rates(changed,data.recommendedWeek),E.rates(data,data.recommendedWeek));
const elements=new Map();const el=id=>{if(!elements.has(id))elements.set(id,{value:id==='formation'?'433':'balanced',addEventListener(){},classList:{add(){},remove(){},toggle(){},contains(){return true}},style:{}});return elements.get(id)};
const html=fs.readFileSync('public/tff-scout.html','utf8');const source=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).find(x=>x.includes('function calc'));
const sandbox={console,ScoutEngine:E,document:{getElementById:el,addEventListener(){}},data,raw:JSON.parse(fs.readFileSync('public/data/tff-scout.json')).players,catalog:JSON.parse(fs.readFileSync('out/analysis-catalog.json')).players};vm.createContext(sandbox);
vm.runInContext(source.replace(/\(function init\(\)\{[\s\S]*?\}\)\(\);/,''),sandbox);
vm.runInContext(`analysisData=data;selectedWeek=data.recommendedWeek;analysisContext=ScoutEngine.prepare(data,selectedWeek);const indexed=new Map(raw.map(p=>[ScoutEngine.club(p.team)+'|'+ScoutEngine.key(p.player),p]));players=catalog.map(p=>norm({...indexed.get(ScoutEngine.club(p.club)+'|'+ScoutEngine.key(p.name)),id:p.id,player:p.name,team:p.club,pos:({DEF:'DF',MID:'MF',FWD:'FW'})[p.position]||p.position,price:p.price}));`,sandbox);
for(const formation of ['433','442','343','352','532'])for(const mode of ['balanced','safe','differential']){
 el('formation').value=formation;el('strategy').value=mode;
 const result=vm.runInContext(`squad=generateSquadFor('${mode}');if(!squad)throw Error('No squad');chooseStartingXI();({valid:validFullSquad(squad),ids:squad.map(p=>p.id),cost:totalCost(squad),bench:bench.map(p=>p.pos),first:starters.length,cap:captain.id,vice:viceCaptain.id})`,sandbox);
 assert(result.valid);assert.equal(new Set(result.ids).size,15);assert.equal(result.first,11);assert.deepEqual([...result.bench],['GK','DF','MF','FW']);assert.notEqual(result.cap,result.vice);assert(result.cost<=100.0001);
}
console.log('PASS: score probabilities, injury/minutes, no future leakage, idempotence, 15 formation/strategy combinations and exact bench quotas');
const ts=require('typescript');
const storeSource=fs.readFileSync('store/useTeamStore.ts','utf8');
const constants=storeSource.match(/export const FORMATIONS[^;]+;/)[0]+storeSource.match(/export const FORMATION_POSITIONS[^;]+;/)[0];
const constantsBox={exports:{}};vm.runInNewContext(ts.transpileModule(constants,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,constantsBox);
const importBox={exports:{},require:()=>constantsBox.exports};vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/scout-import.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,importBox);
const payload=vm.runInContext(`({version:2,createdAt:new Date().toISOString(),formation:scoutFormationLabel(),startingIds:starters.map(p=>p.id),benchIds:bench.map(p=>p.id),captain:captain.id,viceCaptain:viceCaptain.id})`,sandbox);
const catalog=sandbox.catalog;const validate=importBox.exports.validateScoutImport;
const imported=validate(payload,catalog);
assert.deepEqual(new Set([...imported.startingIds,...imported.benchIds]),new Set([...payload.startingIds,...payload.benchIds]));
assert.equal(imported.captain,payload.captain);
assert.throws(()=>validate({...payload,benchIds:[...payload.benchIds.slice(0,3),payload.startingIds[0]]},catalog));
assert.throws(()=>validate({...payload,captain:payload.viceCaptain},catalog));
assert.throws(()=>validate({...payload,createdAt:'2020-01-01'},catalog));
assert.throws(()=>validate(payload,catalog.map(p=>({...p,price:100}))));
assert.throws(()=>validate({...payload,version:1},catalog));
console.log('PASS: exact 15-player import, captains, duplicate/budget/age/version rejection');
