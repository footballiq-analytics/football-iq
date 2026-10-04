export type TrainingNews={id:string;club:string;playerId?:string;playerName?:string;status:"team"|"individual"|"full"|"partial"|"absent";reportDate:string;source:string;publisher:string;summary:string};
const publishers=new Set(["bjk.com.tr","www.bjk.com.tr","www.galatasaray.org","www.haberturk.com"]);
export function selectTrainingNews(raw:unknown,playerId:string,club:string,now=Date.now()):TrainingNews[]{
 if(!raw||typeof raw!=="object")return [];
 const feed=raw as {schemaVersion?:number;records?:unknown[]};
 if(feed.schemaVersion!==1||!Array.isArray(feed.records))return [];
 return feed.records.filter((value):value is TrainingNews=>{
  if(!value||typeof value!=="object")return false;
  const r=value as TrainingNews;
  if(typeof r.id!=="string"||r.club!==club||typeof r.summary!=="string"||r.summary.length>600||typeof r.publisher!=="string")return false;
  if(!["team","individual","full","partial","absent"].includes(r.status))return false;
  if(r.status==="team"?!!r.playerId:r.playerId!==playerId)return false;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(r.reportDate))return false;
  const date=Date.parse(r.reportDate+"T00:00:00+03:00");
  if(!Number.isFinite(date)||date>now)return false;
  try{const u=new URL(r.source);if(u.protocol!=="https:"||!publishers.has(u.hostname)||u.username||u.password)return false}catch{return false}
  return true;
 }).sort((a,b)=>b.reportDate.localeCompare(a.reportDate)).filter((r,i,rows)=>rows.findIndex(x=>x.id===r.id)===i);
}
export const trainingNewsStale=(r:TrainingNews,now=Date.now())=>now-Date.parse(r.reportDate+"T00:00:00+03:00")>72*3600000;
