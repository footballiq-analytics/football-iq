const assert=require('node:assert/strict'),fs=require('fs'),ts=require('typescript'),vm=require('vm');
const box={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/player-injury.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,box);
const {injuryIndex,injuryKey,injuryIsCurrent}=box.exports;
const now=Date.parse('2026-10-02T12:00:00Z');
const row={player:'Uğurcan Çakır',team:'Galatasaray',unavailable:true,injurySource:'https://www.fotmob.com/teams/1/overview',injuryUpdatedAt:'2026-10-02T10:00:00Z'};
const key=injuryKey('Uğurcan Çakir','Galatasaray');
assert(injuryIndex({players:[row]},now)[key]);
assert.equal(injuryKey('Ad','Gaziantep'),injuryKey('Ad','Gaziantep FK'));
assert.notEqual(injuryKey('Ad','Galatasaray'),injuryKey('Ad','Fenerbahçe'));
for(const change of [{unavailable:false},{injurySource:''},{injuryUpdatedAt:null},{injuryUpdatedAt:'2026-10-03T12:00:00Z'}])assert.equal(Object.keys(injuryIndex({players:[{...row,...change}]},now)).length,0);
assert.equal(Object.keys(injuryIndex({players:[row,{...row,unavailable:false}]},now)).length,0);
const old=injuryIndex({players:[{...row,injuryUpdatedAt:'2026-09-20T12:00:00Z'}]},now)[key];
assert(old);assert.equal(injuryIsCurrent(old,now),false);
assert.equal(injuryIsCurrent(injuryIndex({players:[row]},now)[key],now),true);
console.log('PASS: injury source, age, future timestamp, club identity and ambiguous-match safeguards');

const {suspensionIndex}=box.exports;
const warning={name:'Uğurcan Çakır',club:'Galatasaray',kind:'suspended',week:8,kickoff:'2026-10-03T18:00:00Z',checkedAt:'2026-10-02T10:00:00Z',source:'https://www.fotmob.com/matches/test'};
assert(suspensionIndex({playerWarnings:[warning]},now)[key]);
for(const change of [{kind:'injury'},{kickoff:'2026-10-01T18:00:00Z'},{checkedAt:'2026-09-01T10:00:00Z'},{checkedAt:'2026-10-04T10:00:00Z'},{source:'https://example.com'},{week:0}])
 assert.equal(Object.keys(suspensionIndex({playerWarnings:[{...warning,...change}]},now)).length,0);
console.log('PASS: match-specific suspension source, expiry, freshness and week validation');
