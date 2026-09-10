import { create } from "zustand";

export type PlayerPosition = "GK" | "DEF" | "MID" | "FWD";
export type Formation = "4-3-3" | "4-4-2" | "3-4-3" | "3-5-2" | "5-3-2";
export type JokerKey = "tripleCaptain" | "benchBoost" | "wildcard" | "goldenBench";
export type Player = { id:string; name:string; club:string; position:PlayerPosition; price:number; points:number; matches?:number; selected?:number; photo?:string; clubLogo?:string; };
export type StartingSlot={id:string;position:PlayerPosition;playerId:string|null};
export type BenchSlot={id:string;position:PlayerPosition;playerId:string|null};

type TeamStore={
 formation:Formation;players:Record<string,Player>;startingSlots:StartingSlot[];benchSlots:BenchSlot[];toast:string|null;
 captainId:string|null;viceCaptainId:string|null;jokers:Record<JokerKey,boolean>;
 hydrateTeam:(players:Player[],formation:Formation,startingIds:(string|null)[],benchIds:(string|null)[])=>void;
 setFormation:(formation:Formation)=>boolean;setToast:(message:string|null)=>void;setCaptain:(id:string|null)=>void;setViceCaptain:(id:string|null)=>void;
 activateJoker:(joker:JokerKey)=>boolean;clearSquad:()=>void;
 autoArrangeSquad:(candidates:Player[],budget:number)=>boolean;swapStartingAndBench:(startingPlayerId:string,benchPlayerId:string)=>boolean;swapFieldPositions:(player1Id:string,player2Id:string)=>boolean;swapBenchPlayers:(player1Id:string,player2Id:string)=>boolean;movePlayerToEmptySlot:(playerId:string,sourceSlotId:string,targetSlotId:string)=>boolean;addPlayerFromTransfer:(player:Player,targetSlotId:string)=>boolean;removePlayer:(playerId:string)=>void;
};
export const FORMATION_POSITIONS:Record<Formation,PlayerPosition[]>={"4-3-3":["FWD","FWD","FWD","MID","MID","MID","DEF","DEF","DEF","DEF","GK"],"4-4-2":["FWD","FWD","MID","MID","MID","MID","DEF","DEF","DEF","DEF","GK"],"3-4-3":["FWD","FWD","FWD","MID","MID","MID","MID","DEF","DEF","DEF","GK"],"3-5-2":["FWD","FWD","MID","MID","MID","MID","MID","DEF","DEF","DEF","GK"],"5-3-2":["FWD","FWD","MID","MID","MID","DEF","DEF","DEF","DEF","DEF","GK"]};
const BENCH_POSITIONS:PlayerPosition[]=["GK","DEF","MID","FWD"];
const POSITIONS:PlayerPosition[]=["GK","DEF","MID","FWD"];
const MAX_BUDGET=100;
const buildStartingSlots=(formation:Formation,ids:(string|null)[])=>FORMATION_POSITIONS[formation].map((position,index)=>({id:`start-${index}`,position,playerId:ids[index]??null}));
const buildBenchSlots=(ids:(string|null)[])=>BENCH_POSITIONS.map((position,index)=>({id:`bench-${index}`,position,playerId:ids[index]??null}));
const benchAccepts=(slot:BenchSlot,player:Player)=>slot.position===player.position;
const containsPlayer=(startingSlots:StartingSlot[],benchSlots:BenchSlot[],playerId:string)=>startingSlots.some(s=>s.playerId===playerId)||benchSlots.some(s=>s.playerId===playerId);

function sanitizeHydratedSquad(players:Player[],formation:Formation,startingIds:(string|null)[],benchIds:(string|null)[]){
 const map=Object.fromEntries(players.map(p=>[p.id,p]));
 const used=new Set<string>();
 const clubCounts=new Map<string,number>();
 let spend=0;
 let repaired=0;
 const accept=(id:string|null|undefined,position:PlayerPosition)=>{
  if(!id)return null;
  const p=map[id];
  if(!p||used.has(id)||p.position!==position||(clubCounts.get(p.club)??0)>=3||spend+p.price>MAX_BUDGET+0.0001){repaired++;return null}
  used.add(id);clubCounts.set(p.club,(clubCounts.get(p.club)??0)+1);spend+=p.price;return id;
 };
 const cleanStarting=FORMATION_POSITIONS[formation].map((position,index)=>accept(startingIds[index],position));
 const cleanBench=BENCH_POSITIONS.map((position,index)=>accept(benchIds[index],position));
 return{map,cleanStarting,cleanBench,repaired};
}

export const useTeamStore=create<TeamStore>((set,get)=>({
 formation:"4-3-3",players:{},startingSlots:buildStartingSlots("4-3-3",[]),benchSlots:buildBenchSlots([]),toast:null,captainId:null,viceCaptainId:null,jokers:{tripleCaptain:false,benchBoost:false,wildcard:false,goldenBench:false},
 hydrateTeam:(players,formation,startingIds,benchIds)=>{const clean=sanitizeHydratedSquad(players,formation,startingIds,benchIds);set({players:clean.map,formation,startingSlots:buildStartingSlots(formation,clean.cleanStarting),benchSlots:buildBenchSlots(clean.cleanBench),toast:clean.repaired?`${clean.repaired} eski/geçersiz kadro kaydı temizlendi.`:null})},
 setFormation:(formation)=>{
  const state=get();
  if(formation===state.formation){set({toast:`${formation} dizilişi zaten aktif.`});return true}
  const selectedIds=[...state.startingSlots,...state.benchSlots].map(s=>s.playerId).filter((id):id is string=>Boolean(id));
  if(!selectedIds.length){set({formation,startingSlots:buildStartingSlots(formation,[]),toast:`${formation} dizilişi uygulandı.`});return true}
  const selected=selectedIds.map(id=>state.players[id]).filter((p):p is Player=>Boolean(p));
  const desired=[...FORMATION_POSITIONS[formation],...BENCH_POSITIONS];
  const targetCounts:Record<PlayerPosition,number>={GK:0,DEF:0,MID:0,FWD:0};
  desired.forEach(pos=>targetCounts[pos]++);
  let working=[...selected];
  const removed:Player[]=[];
  const oldBenchIds=new Set(state.benchSlots.map(s=>s.playerId).filter((id):id is string=>Boolean(id)));
  for(const pos of POSITIONS){
   let excess=working.filter(p=>p.position===pos).length-targetCounts[pos];
   if(excess<=0)continue;
   const candidates=working.filter(p=>p.position===pos).sort((a,b)=>Number(oldBenchIds.has(b.id))-Number(oldBenchIds.has(a.id))||a.points-b.points||a.price-b.price);
   for(const player of candidates){if(excess<=0)break;working=working.filter(p=>p.id!==player.id);removed.push(player);excess--}
  }
  const counts=new Map<string,number>();working.forEach(p=>counts.set(p.club,(counts.get(p.club)??0)+1));
  let spend=working.reduce((sum,p)=>sum+p.price,0);
  const pool=Object.values(state.players);
  const added:Player[]=[];
  for(const pos of POSITIONS){
   let deficit=targetCounts[pos]-working.filter(p=>p.position===pos).length;
   while(deficit>0){
    const available=pool.filter(p=>p.position===pos&&!working.some(x=>x.id===p.id)&&(counts.get(p.club)??0)<3&&spend+p.price<=MAX_BUDGET+0.0001).sort((a,b)=>a.price-b.price||b.points-a.points);
    const pick=available[0];
    if(!pick){set({toast:`${formation} için kadroyu kurallara uygun dönüştüremedim. Oto Tamamla kullanabilirsin.`});return false}
    working.push(pick);added.push(pick);counts.set(pick.club,(counts.get(pick.club)??0)+1);spend+=pick.price;deficit--
   }
  }
  const reservedBench=new Map<PlayerPosition,string>();
  for(const pos of BENCH_POSITIONS){
   const oldBench=state.benchSlots.find(s=>s.position===pos&&s.playerId&&working.some(p=>p.id===s.playerId));
   const fallback=working.filter(p=>p.position===pos).sort((a,b)=>a.price-b.price||a.points-b.points)[0];
   const id=oldBench?.playerId??fallback?.id;
   if(id)reservedBench.set(pos,id)
  }
  const usedBench=new Set(reservedBench.values());
  const byPosition:Record<PlayerPosition,string[]>={GK:[],DEF:[],MID:[],FWD:[]};
  for(const p of working)if(!usedBench.has(p.id))byPosition[p.position].push(p.id);
  const startingIds=FORMATION_POSITIONS[formation].map(pos=>byPosition[pos].shift()??null);
  const benchIds=BENCH_POSITIONS.map(pos=>reservedBench.get(pos)??null);
  if(startingIds.some(id=>!id)||benchIds.some(id=>!id)){set({toast:`${formation} için mevki dağılımı tamamlanamadı. Oto Tamamla kullanabilirsin.`});return false}
  set({formation,startingSlots:buildStartingSlots(formation,startingIds),benchSlots:buildBenchSlots(benchIds),toast:removed.length||added.length?`${formation} uygulandı · mevki dengesi için ${removed.length} oyuncu çıkarılıp ${added.length} oyuncu eklendi.`:`${formation} dizilişi uygulandı.`});return true
 },
 setToast:(message)=>set({toast:message}),
 setCaptain:(id)=>set(state=>({captainId:id,viceCaptainId:state.viceCaptainId===id?null:state.viceCaptainId,toast:id?`${state.players[id]?.name??"Oyuncu"} kaptan seçildi · x2`:"Kaptan seçimi kaldırıldı."})),
 setViceCaptain:(id)=>set(state=>({viceCaptainId:id===state.captainId?null:id,toast:id===state.captainId?"Kaptan aynı zamanda ikinci kaptan olamaz.":id?`${state.players[id]?.name??"Oyuncu"} ikinci kaptan seçildi.`:"İkinci kaptan seçimi kaldırıldı."})),
 activateJoker:(joker)=>{const state=get();if(state.jokers[joker]){set({toast:"Bu joker daha önce kullanıldı."});return false}set({jokers:{...state.jokers,[joker]:true},toast:"Joker bu hafta için etkinleştirildi."});return true},
 clearSquad:()=>set(state=>({startingSlots:buildStartingSlots(state.formation,[]),benchSlots:buildBenchSlots([]),captainId:null,viceCaptainId:null,toast:"Kadro temizlendi. Kullanılabilir bütçe yeniden 100M."})),
 autoArrangeSquad:(candidates,budget)=>{
  const{formation,players}=get();
  const allPlayers={...players,...Object.fromEntries(candidates.map(p=>[p.id,p]))};
  const desired=[...FORMATION_POSITIONS[formation],...BENCH_POSITIONS];
  const used=new Set<string>();const counts=new Map<string,number>();let spend=0;
  const chosen:(Player|null)[]=desired.map(()=>null);
  const cheapest=[...candidates].sort((a,b)=>a.price-b.price||b.points-a.points);
  for(let i=0;i<desired.length;i++){
   const pos=desired[i];
   const pick=cheapest.find(x=>x.position===pos&&!used.has(x.id)&&(counts.get(x.club)??0)<3&&spend+x.price<=budget+0.0001);
   if(!pick)continue;
   chosen[i]=pick;used.add(pick.id);counts.set(pick.club,(counts.get(pick.club)??0)+1);spend+=pick.price;
  }
  const missing=chosen.filter(x=>!x).length;
  if(missing){set({players:allPlayers,startingSlots:buildStartingSlots(formation,chosen.slice(0,11).map(x=>x?.id??null)),benchSlots:buildBenchSlots(chosen.slice(11).map(x=>x?.id??null)),toast:`${formation} için ${missing} pozisyon doldurulamadı.`});return false}
  let improved=true;
  while(improved){
   improved=false;
   let best:{slot:number;candidate:Player;delta:number}|null=null;
   const room=budget-spend;
   for(let i=0;i<chosen.length;i++){
    const current=chosen[i]!;
    for(const candidate of candidates){
     if(candidate.position!==desired[i]||used.has(candidate.id)||candidate.price<=current.price)continue;
     const delta=candidate.price-current.price;
     if(delta>room+0.0001)continue;
     const candidateClubCount=counts.get(candidate.club)??0;
     const clubOk=candidate.club===current.club||candidateClubCount<3;
     if(!clubOk)continue;
     if(!best||delta>best.delta||(Math.abs(delta-best.delta)<0.0001&&candidate.points>best.candidate.points))best={slot:i,candidate,delta};
    }
   }
   if(best){
    const current=chosen[best.slot]!;
    used.delete(current.id);used.add(best.candidate.id);
    counts.set(current.club,Math.max(0,(counts.get(current.club)??1)-1));
    counts.set(best.candidate.club,(counts.get(best.candidate.club)??0)+1);
    chosen[best.slot]=best.candidate;spend+=best.delta;improved=true;
   }
  }
  const ids=chosen.map(x=>x!.id);const remaining=Math.max(0,budget-spend);
  set({players:allPlayers,startingSlots:buildStartingSlots(formation,ids.slice(0,11)),benchSlots:buildBenchSlots(ids.slice(11)),toast:`Oto Tamamla tamamlandı · ${spend.toFixed(1)}M kullanıldı · ${remaining.toFixed(1)}M kaldı.`});return true
 },
 swapStartingAndBench:(a,b)=>{const{startingSlots,benchSlots,players}=get();const ai=startingSlots.findIndex(s=>s.playerId===a),bi=benchSlots.findIndex(s=>s.playerId===b);if(ai<0||bi<0)return false;const ap=players[a],bp=players[b];if(!ap||!bp)return false;if(startingSlots[ai].position!==bp.position||benchSlots[bi].position!==ap.position){set({toast:"Geçersiz Değişiklik · mevki kuralları uyuşmuyor."});return false}const ns=[...startingSlots],nb=[...benchSlots];ns[ai]={...ns[ai],playerId:b};nb[bi]={...nb[bi],playerId:a};set({startingSlots:ns,benchSlots:nb,toast:`${ap.name} ile ${bp.name} yer değiştirdi.`});return true},
 swapFieldPositions:(a,b)=>{const{startingSlots,players}=get();const ai=startingSlots.findIndex(s=>s.playerId===a),bi=startingSlots.findIndex(s=>s.playerId===b);if(ai<0||bi<0)return false;if(players[a]?.position!==players[b]?.position){set({toast:"Geçersiz Değişiklik · saha içi takas aynı mevki arasında yapılabilir."});return false}const n=[...startingSlots],x=n[ai].playerId;n[ai]={...n[ai],playerId:n[bi].playerId};n[bi]={...n[bi],playerId:x};set({startingSlots:n,toast:"Saha içi pozisyonlar değiştirildi."});return true},
 swapBenchPlayers:(a,b)=>{const{benchSlots,players}=get();const ai=benchSlots.findIndex(s=>s.playerId===a),bi=benchSlots.findIndex(s=>s.playerId===b);if(ai<0||bi<0)return false;const ap=players[a],bp=players[b];if(!ap||!bp)return false;if(!benchAccepts(benchSlots[ai],bp)||!benchAccepts(benchSlots[bi],ap)){set({toast:"Yedek koltukları mevkiye özeldir: KL, DEF, ORT ve FOR."});return false}const n=[...benchSlots];n[ai]={...n[ai],playerId:b};n[bi]={...n[bi],playerId:a};set({benchSlots:n,toast:"Yedek oyuncuların sırası değiştirildi."});return true},
 movePlayerToEmptySlot:(playerId,sourceSlotId,targetSlotId)=>{
  const{startingSlots,benchSlots,players}=get();const p=players[playerId];if(!p)return false;
  const sourceStarting=startingSlots.find(s=>s.id===sourceSlotId);const sourceBench=benchSlots.find(s=>s.id===sourceSlotId);
  if(sourceStarting?.playerId!==playerId&&sourceBench?.playerId!==playerId){set({toast:"Taşıma iptal edildi · oyuncunun kaynak slotu değişmiş."});return false}
  if(sourceSlotId===targetSlotId)return true;
  const si=startingSlots.findIndex(s=>s.id===targetSlotId),bi=benchSlots.findIndex(s=>s.id===targetSlotId);
  if(si>=0&&(startingSlots[si].playerId||startingSlots[si].position!==p.position)){set({toast:"Geçersiz Değişiklik · oyuncu bu saha slotuna taşınamaz."});return false}
  if(bi>=0&&(benchSlots[bi].playerId||!benchAccepts(benchSlots[bi],p))){set({toast:"Geçersiz Değişiklik · oyuncu bu yedek slotuna taşınamaz."});return false}
  if(si<0&&bi<0){set({toast:"Taşıma iptal edildi · hedef slot bulunamadı."});return false}
  set({startingSlots:startingSlots.map((s,i)=>s.id===sourceSlotId?{...s,playerId:null}:i===si?{...s,playerId}:s),benchSlots:benchSlots.map((s,i)=>s.id===sourceSlotId?{...s,playerId:null}:i===bi?{...s,playerId}:s),toast:`${p.name} yeni slota taşındı.`});return true
 },
 addPlayerFromTransfer:(p,target)=>{
  const{startingSlots,benchSlots,players}=get();
  if(containsPlayer(startingSlots,benchSlots,p.id)){set({toast:`${p.name} zaten kadroda.`});return false}
  const nextPlayers={...players,[p.id]:p};
  if(target.startsWith("start-")){const i=startingSlots.findIndex(s=>s.id===target);if(i<0){set({toast:"Transfer iptal edildi · saha slotu bulunamadı."});return false}const slot=startingSlots[i];if(slot.playerId||slot.position!==p.position){set({toast:`${p.name} bu mevki alanına bırakılamaz.`});return false}const n=[...startingSlots];n[i]={...slot,playerId:p.id};set({players:nextPlayers,startingSlots:n,toast:`${p.name} ilk 11'e eklendi.`});return true}
  if(target.startsWith("bench-")){const i=benchSlots.findIndex(s=>s.id===target);if(i<0){set({toast:"Transfer iptal edildi · yedek slotu bulunamadı."});return false}const slot=benchSlots[i];if(slot.playerId||!benchAccepts(slot,p)){set({toast:`Bu yedek koltuğu yalnızca ${slot.position} oyuncusu kabul eder.`});return false}const n=[...benchSlots];n[i]={...slot,playerId:p.id};set({players:nextPlayers,benchSlots:n,toast:`${p.name} yedek kulübesine eklendi.`});return true}
  set({toast:"Transfer iptal edildi · hedef slot geçersiz."});return false
 },
 removePlayer:(id)=>set(state=>({startingSlots:state.startingSlots.map(s=>s.playerId===id?{...s,playerId:null}:s),benchSlots:state.benchSlots.map(s=>s.playerId===id?{...s,playerId:null}:s),captainId:state.captainId===id?null:state.captainId,viceCaptainId:state.viceCaptainId===id?null:state.viceCaptainId,toast:"Oyuncu kadrodan çıkarıldı."}))
}));
