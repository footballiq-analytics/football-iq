"""Validate a normalized evidence feed and publish atomically. Never infer availability from absence."""
import datetime as dt, json, math, os, pathlib, sys, urllib.request, urllib.parse
ROOT=pathlib.Path(__file__).resolve().parents[1]
def stamp(x):
 if not isinstance(x,str):raise ValueError('Timestamp required')
 d=dt.datetime.fromisoformat(x.replace('Z','+00:00'))
 if d.tzinfo is None:raise ValueError('Timestamp timezone required')
 if d>dt.datetime.now(dt.timezone.utc)+dt.timedelta(minutes=5):raise ValueError('Future timestamp')
 return x
def source(x):
 if not isinstance(x,str):raise ValueError('Public source required')
 u=urllib.parse.urlsplit(x)
 if u.scheme!='https' or not u.netloc or u.username or u.password or u.query:raise ValueError('Source must be a public HTTPS URL without credentials/query')
 return x
def number(v,a,b):
 if isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) or not a<=v<=b:raise ValueError('Numeric field out of range')
 return v
def text(v):
 if not isinstance(v,str) or len(v)>1200:raise ValueError('Text field invalid')
 return v

def validate(raw,context,catalog):
 if raw.get('schemaVersion')!=2 or raw.get('season')!=context['season']:raise ValueError('Schema/season mismatch')
 ids={str(p['id']) for p in catalog['players']};fixtures={str(m['id']) for m in context['matches']}
 out=dict(schemaVersion=2,season=raw['season'],updatedAt=stamp(raw['updatedAt']),players={},matchStats={},fixtures={},weeklyScores=None)
 for pid,e in raw.get('players',{}).items():
  if pid not in ids:raise ValueError('Unknown catalog player ID')
  v={k:e[k] for k in ['availability','allCompetitionsComplete'] if k in e}
  if v.get('availability') not in ['available','unavailable','doubtful','suspended','unknown']:raise ValueError('Availability required')
  if not isinstance(v.get('allCompetitionsComplete'),bool):raise ValueError('Workload coverage flag required')
  v.update(week=number(e['week'],1,34),source=source(e['source']),verifiedAt=stamp(e['verifiedAt']))
  if not isinstance(e['week'],int):raise ValueError('Integer week required')
  # nextKickoff is a future event, not a verification timestamp.
  next_date=dt.datetime.fromisoformat(e['nextKickoff'].replace('Z','+00:00'))
  if next_date.tzinfo is None:raise ValueError('Kickoff timezone required')
  v['nextKickoff']=e['nextKickoff']
  for k,a,b in [('startProbability',0,1),('rotationRisk',0,1),('injuryRisk',0,1),('minutesWhenStarting',0,90),('travelKm',0,20000)]:
   if e.get(k) is not None:v[k]=number(e[k],a,b)
  for k in ['roles','riskFlags']:
   if k in e:
    if not isinstance(e[k],list) or len(e[k])>20:raise ValueError('List invalid')
    v[k]=[text(x) for x in e[k]]
  if isinstance(e.get('home'),bool):v['home']=e['home']
  if e.get('motivationSource') and e.get('motivationNote'):v.update(motivationSource=source(e['motivationSource']),motivationNote=text(e['motivationNote']))
  v['recentAppearances']=[];seen=set()
  for m in e.get('recentAppearances',[]):
   key=str(m.get('fixtureId') or m['kickoff'])
   if key in seen:raise ValueError('Duplicate appearance')
   seen.add(key)
   v['recentAppearances'].append(dict(fixtureId=key,kickoff=stamp(m['kickoff']),verifiedAt=stamp(m['verifiedAt']),source=source(m['source']),minutes=number(m['minutes'],0,130)))
  out['players'][pid]=v
 for mid,m in raw.get('matchStats',{}).items():
  if mid not in fixtures:raise ValueError('Unknown match ID')
  out['matchStats'][mid]=dict(source=source(m['source']),availableAt=stamp(m['availableAt']),homeXg=number(m['homeXg'],0,15),awayXg=number(m['awayXg'],0,15))
 for mid,m in raw.get('fixtures',{}).items():
  if mid not in fixtures:raise ValueError('Unknown fixture ID')
  out['fixtures'][mid]=dict(source=source(m['source']),verifiedAt=stamp(m['verifiedAt']))
  for k in ['lineup','absences','workload','travel','weather','pitch','tactics','coachChange','motivation']:
   if k in m:out['fixtures'][mid][k]=text(m[k])
 feed=raw.get('weeklyScores')
 if feed:
  if feed.get('complete') is not True:raise ValueError('Weekly scores must declare complete coverage')
  seen=set();rows=[]
  for p in feed['players']:
   if p['id'] not in ids or p['id'] in seen:raise ValueError('Invalid weekly score player')
   seen.add(p['id']);rows.append(dict(id=p['id'],points=number(p['points'],-100,200)))
  out['weeklyScores']=dict(week=number(feed['week'],1,34),complete=True,source=source(feed['source']),players=rows)
 return out

def main():
 url=os.environ.get('ANALYSIS_EVIDENCE_URL')
 if not url and len(sys.argv)<2:
  print('No evidence feed configured; existing evidence retained and freshness checked in the app.');return
 context=json.loads((ROOT/'public/data/analysis-context.json').read_text())
 catalog=json.loads((ROOT/'out/analysis-catalog.json').read_text())
 if len(sys.argv)>1:raw=json.loads(pathlib.Path(sys.argv[1]).read_text())
 else:
  if urllib.parse.urlsplit(url).scheme!='https':raise ValueError('HTTPS required')
  headers={'Accept':'application/json'}
  if os.environ.get('ANALYSIS_EVIDENCE_TOKEN'):headers['Authorization']='Bearer '+os.environ['ANALYSIS_EVIDENCE_TOKEN']
  with urllib.request.urlopen(urllib.request.Request(url,headers=headers),timeout=30) as response:
   body=response.read(4*1024*1024+1)
   if len(body)>4*1024*1024:raise ValueError('Feed too large')
   raw=json.loads(body)
 data=validate(raw,context,catalog)
 for target in [ROOT/'public/data/analysis-evidence.json',ROOT/'out/data/analysis-evidence.json']:
  tmp=target.with_suffix('.tmp');tmp.write_text(json.dumps(data,ensure_ascii=False,indent=2));tmp.replace(target)
 print('Verified evidence published:',len(data['players']),'players;',len(data['matchStats']),'xG matches')
if __name__=='__main__':
 try:main()
 except Exception:
  print('Evidence validation/download failed. Existing evidence retained; no unknown field converted to available.',file=sys.stderr);sys.exit(1)
