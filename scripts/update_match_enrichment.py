"""Attach observed FotMob match data to TFF identities; preserve explicit unknowns."""
import concurrent.futures, datetime as dt, json, math, pathlib, re, urllib.request, unicodedata
from update_analysis_evidence import validate
ROOT=pathlib.Path(__file__).resolve().parents[1]
LEAGUE='https://www.fotmob.com/api/data/leagues?id=71&ccode3=TUR'
def date(value):
 try:
  d=dt.datetime.fromisoformat(value.replace('Z','+00:00'))
  return d if d.tzinfo else None
 except (AttributeError,ValueError,TypeError):return None
def key(value):
 return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',str(value or '').lower().replace('ı','i')).encode('ascii','ignore').decode())
def club(value):
 k=key(value)
 return {'gaziantep':'gaziantepfk','erzurumspor':'erzurumsporfk','istanbulbasaksehir':'istanbulbasaksehirfk','basaksehir':'istanbulbasaksehirfk','rizespor':'caykurrizespor','amedspor':'amedsk','amedsportif':'amedsk'}.get(k,k)
def numeric(v,maximum=1000):
 if isinstance(v,bool):return None
 try:n=float(v)
 except (TypeError,ValueError):return None
 return n if math.isfinite(n) and 0<=n<=maximum else None
def get(url):
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0','Accept':'application/json'})
 with urllib.request.urlopen(req,timeout=25) as r:return json.loads(r.read(8*1024*1024))
def identity(m):return (int(m['week']),club(m['home']),club(m['away']))
def join_fixtures(context,league):
 if league.get('details',{}).get('id')!=71 or league['details'].get('selectedSeason','').replace('/','-')!=context['season']:raise ValueError('Provider season/league mismatch')
 indexed={};ambiguous=set()
 for row in league.get('fixtures',{}).get('allMatches',[]):
  try:k=(int(row['round']),club(row['home']['name']),club(row['away']['name']))
  except (KeyError,TypeError,ValueError):continue
  if k in indexed:ambiguous.add(k)
  indexed[k]=row
 return [(m,indexed[identity(m)]) for m in context['matches'] if identity(m) in indexed and identity(m) not in ambiguous]
def parse_match(payload,m,row,observed):
 g=payload.get('general',{});h=payload.get('header',{});status=h.get('status',{});c=payload.get('content',{})
 if str(g.get('matchId'))!=str(row['id']) or g.get('leagueId')!=71 or str(g.get('matchRound'))!=str(m['week']):raise ValueError('Match ID/competition/round mismatch')
 for side in ('home','away'):
  if str(g.get(side+'Team',{}).get('id'))!=str(row[side]['id']) or club(g.get(side+'Team',{}).get('name'))!=club(m[side]):raise ValueError('Home/away team mismatch')
 kickoff=date(g.get('matchTimeUTCDate'));now=date(observed);official=date(m.get('kickoff'))
 if not kickoff or not now or (official and abs((official-kickoff).total_seconds())>300):raise ValueError('Kickoff mismatch/missing')
 if status.get('cancelled') or status.get('awarded'):raise ValueError('Cancelled/awarded match')
 path=row.get('pageUrl','')
 source='https://www.fotmob.com'+path if path.startswith('/matches/') else 'https://www.fotmob.com/match/'+str(row['id'])
 result={'source':source,'verifiedAt':observed,'kickoff':kickoff.isoformat(),'providerId':str(row['id']),'metrics':{},'appearances':[],'absences':[],'notes':{}}
 finished=m['status']=='finished'
 if finished:
  teams=h.get('teams',[])
  if g.get('finished') is not True or kickoff>=now or len(teams)!=2:raise ValueError('Unfinished/future result')
  if any(str(teams[i].get('id'))!=str(row[side]['id']) or teams[i].get('score')!=m[side+'Goals'] for i,side in enumerate(('home','away'))):raise ValueError('TFF/provider score mismatch')
  wanted={'expected_goals':'xg','total_shots':'shots','ShotsOnTarget':'shotsOnTarget','big_chance':'bigChances','expected_goals_non_penalty':'nonPenaltyXg'}
  for section in c.get('stats',{}).get('Periods',{}).get('All',{}).get('stats',[]):
   for stat in section.get('stats',[]):
    field=wanted.get(stat.get('key'));values=stat.get('stats')
    if not field or not isinstance(values,list) or len(values)!=2:continue
    pair=[numeric(v,15 if field in ('xg','nonPenaltyXg') else 100) for v in values]
    if None in pair:continue
    if field in result['metrics'] and result['metrics'][field]!=pair:raise ValueError('Conflicting statistic')
    result['metrics'][field]=pair
  for pid,p in (c.get('playerStats') or {}).items():
   if str(p.get('id'))!=str(pid) or str(p.get('teamId')) not in [str(row[s]['id']) for s in ('home','away')]:continue
   minutes=None
   for group in p.get('stats',[]):
    for stat in group.get('stats',{}).values():
     if stat.get('key')=='minutes_played':minutes=numeric(stat.get('stat',{}).get('value'),130)
   if minutes is not None:result['appearances'].append({'providerPlayerId':str(pid),'providerTeamId':str(p['teamId']),'minutes':minutes})
 else:
  if g.get('finished') or g.get('started') or kickoff<=now:return result
  lineup=c.get('lineup') or {};lineup_text=[];absent_text=[]
  if str(lineup.get('matchId'))==str(row['id']):
   for side in ('home','away'):
    team=lineup.get(side+'Team') or {}
    if str(team.get('id'))!=str(row[side]['id']):continue
    starters=team.get('starters') or []
    if len(starters)==11 and len({p.get('id') for p in starters})==11:
     lineup_text.append(m[side]+': '+', '.join(str(p.get('name','')) for p in starters)+' (kaynak kadrosu; kesin ilk 11 teyidi yok)')
    for p in team.get('unavailable') or []:
     u=p.get('unavailability') or {};kind=u.get('type');doubtful=u.get('expectedReturn')=='Doubtful'
     if kind not in ('injury','suspension','suspended'):continue
     availability='suspended' if kind in ('suspension','suspended') else 'doubtful' if doubtful else 'unavailable'
     result['absences'].append({'providerPlayerId':str(p['id']),'providerTeamId':str(team['id']),'availability':availability})
     absent_text.append(str(p.get('name',''))+' ('+{'suspended':'cezalı','doubtful':'şüpheli','unavailable':'sakat'}[availability]+')')
  result['notes']['lineup']=' · '.join(lineup_text) if lineup_text else 'Kesin ilk 11 henüz açıklanmadı / kaynakta yok.'
  result['notes']['absences']='; '.join(absent_text) if absent_text else 'Kaynakta eksik oyuncu listesi yok; tüm oyuncuların uygun olduğu doğrulanmadı.'
  w=c.get('weather') or {};updated=date(w.get('lastUpdated'));temperature=w.get('temperature')
  if updated and dt.timedelta(0)<=now-updated<=dt.timedelta(hours=72) and w.get('apiUsed')=='forecast' and isinstance(temperature,(int,float)) and not isinstance(temperature,bool) and -40<=temperature<=60:
   result['notes']['weather']=f"Maç hava tahmini: {temperature} °C · hava kaynağı kontrolü: {w['lastUpdated']}"
  stadium=((c.get('matchFacts') or {}).get('infoBox') or {}).get('Stadium') or {}
  if stadium.get('name'):result['notes']['pitch']=str(stadium['name'])+' · '+str(stadium.get('city',''))+' · Zemin türü: '+str(stadium.get('surface','bilinmiyor'))+' (zemin durumu doğrulanmadı)'
 return result

def assemble(context,roster,catalog,league,fetch=get,now=None):
 observed=now or dt.datetime.now(dt.timezone.utc).isoformat();clock=date(observed)
 matches=context['matches'];rounds=sorted({m['week'] for m in matches})
 active=next((w for w in rounds if any(m['status']!='finished' for m in matches if m['week']==w)),None)
 begun=active and any(m['week']==active and (m['status'] in ('finished','live') or (date(m.get('kickoff')) and date(m['kickoff'])<=clock)) for m in matches)
 target=next((w for w in rounds if w>active),None) if begun else active
 pairs=join_fixtures(context,league);selected=[(m,r) for m,r in pairs if m['status']=='finished' or m['week'] in (active,target)]
 # Identity joins require exact normalized name AND club, then provider player AND team IDs.
 source_players={};duplicates=set()
 for p in roster.get('players',[]):
  k=(key(p['player']),club(p['team']))
  if k in source_players:duplicates.add(k)
  source_players[k]=p
 mapping={}
 for p in catalog['players']:
  k=(key(p['name']),club(p['club']));raw=source_players.get(k)
  if raw and k not in duplicates and raw.get('fotmobId') and raw.get('fotmobTeamId'):mapping[(str(raw['fotmobId']),str(raw['fotmobTeamId']))]=str(p['id'])
 out={'schemaVersion':2,'season':context['season'],'updatedAt':observed,'players':{},'matchStats':{},'fixtures':{},'weeklyScores':None}
 report={'attempted':len(selected),'matchedFixtures':len(pairs),'expectedFixtures':len(matches),'fetched':0,'xgMatches':0,'weatherMatches':0,'failures':[],'missing':['Kesin ilk 11 / başlama olasılığı','Tüm organizasyonlarda eksiksiz oyuncu yükü','Doğrulanmış motivasyon ve taktik','Gerçek seyahat mesafesi','Oyunun haftalık fantezi puanları']}
 details={};history={}
 def retrieve(pair):
  m,r=pair
  try:return m,parse_match(fetch('https://www.fotmob.com/api/data/matchDetails?matchId='+str(r['id'])),m,r,observed),None
  except Exception as e:return m,None,type(e).__name__
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
  for m,item,error in pool.map(retrieve,selected):
   if error:report['failures'].append({'matchId':str(m['id']),'reason':error});continue
   report['fetched']+=1;mid=str(m['id']);details[mid]=item
   xg=item['metrics'].get('xg')
   if xg is not None:out['matchStats'][mid]={'source':item['source'],'availableAt':observed,'homeXg':xg[0],'awayXg':xg[1]}
   if item['notes']:
    out['fixtures'][mid]={'source':item['source'],'verifiedAt':observed,**{k:v[:1200] for k,v in item['notes'].items()}}
    if 'weather' in item['notes']:report['weatherMatches']+=1
   for p in item['appearances']:
    pid=mapping.get((p['providerPlayerId'],p['providerTeamId']))
    if pid:history.setdefault(pid,[]).append({'fixtureId':mid,'kickoff':item['kickoff'],'minutes':p['minutes'],'source':item['source'],'verifiedAt':observed})
   if m['week']==target:
    for p in item['absences']:
     pid=mapping.get((p['providerPlayerId'],p['providerTeamId']))
     if pid:out['players'][pid]={'week':target,'availability':p['availability'],'allCompetitionsComplete':False,'nextKickoff':item['kickoff'],'source':item['source'],'verifiedAt':observed,'riskFlags':['Maça özel eksik oyuncu kaydı']}
 if not report['fetched']:raise ValueError('No validated match data; retain previous publication')
 for pid,e in out['players'].items():e['recentAppearances']=history.get(pid,[])
 checked=validate(out,context,catalog)
 checked.update(report=report,matchDetails=details,playerMatches=history)
 report['xgMatches']=len(checked['matchStats']);report['playerMinuteRecords']=sum(map(len,history.values()));report['playersWithMinutes']=len(history);report['matchSpecificAbsences']=len(checked['players'])
 return checked

def main():
 context=json.loads((ROOT/'public/data/analysis-context.json').read_text());roster=json.loads((ROOT/'public/data/tff-scout.json').read_text());catalog=json.loads((ROOT/'out/analysis-catalog.json').read_text())
 data=assemble(context,roster,catalog,get(LEAGUE))
 for target in (ROOT/'public/data/match-enrichment.json',ROOT/'out/data/match-enrichment.json'):
  target.parent.mkdir(parents=True,exist_ok=True);tmp=target.with_suffix('.tmp');tmp.write_text(json.dumps(data,ensure_ascii=False,indent=2));tmp.replace(target)
 print(json.dumps(data['report'],ensure_ascii=False))
if __name__=='__main__':main()
