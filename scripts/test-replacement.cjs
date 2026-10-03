const assert=require('node:assert/strict'),fs=require('fs'),ts=require('typescript'),vm=require('vm');
function load(path){const box={exports:{},require:id=>id==='@/lib/fantasy-price'?{formatFantasyPrice:n=>String(n)}:require(id)};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,box);return box.exports}
const {assessReplacementTransfer:A}=load('lib/direct-transfer.ts');const {buildTransferReplacement:B}=load('lib/replace-transfer.ts');
const outgoing={id:'old',name:'Old',position:'DEF',club:'A',price:5};
const base={alreadySelected:false,squadSize:15,clubCount:3,availableSlots:0,remainingBudget:1,price:6,outgoing,candidatePosition:'DEF',candidateClub:'A'};
assert.equal(A(base).eligible,true);assert.equal(A({...base,price:6.01}).eligible,false);assert.equal(A({...base,candidateClub:'B'}).eligible,false);assert.equal(A({...base,alreadySelected:true}).eligible,false);assert.equal(A({...base,candidatePosition:'MID'}).eligible,false);
const others=Array.from({length:14},(_,i)=>({id:'p'+i,name:'P'+i,position:'DEF',club:i<2?'A':'C'+i,price:i===13?3:7})); // 94M retained, total 99M
const state={players:Object.fromEntries([outgoing,...others].map(p=>[p.id,p])),startingSlots:[outgoing,...others.slice(0,10)].map((p,i)=>({id:'s'+i,position:'DEF',playerId:p.id})),benchSlots:others.slice(10).map((p,i)=>({id:'b'+i,position:'DEF',playerId:p.id}))};
const incoming={id:'new',name:'New',position:'DEF',club:'A',price:6};
const result=B(state,incoming,'s0','old');assert.equal(result.success,true);assert.equal(result.update.startingSlots[0].playerId,'new');assert.equal(state.startingSlots[0].playerId,'old');assert.equal(result.update.startingSlots.length+result.update.benchSlots.length,15);
assert.equal(B(state,{...incoming,price:6.01},'s0','old').success,false);assert.equal(B(state,incoming,'s0','stale').success,false);assert.equal(B(state,{...incoming,id:'p2'},'s0','old').success,false);assert.equal(B(state,{...incoming,position:'MID'},'s0','old').success,false);
const bench=state.benchSlots[0];assert.equal(B(state,{...incoming,price:3,club:'Z'},bench.id,bench.playerId).success,true);
console.log('PASS: full squad replacement, refund, club limit, exact budget, duplicate, stale target and bench; original state preserved');
