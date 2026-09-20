"""Publish verified TFF fixtures/results atomically; fail rather than fabricate."""
import datetime, html, json, pathlib, re, sys, urllib.request
URL='https://www.tff.org/default.aspx?pageID=198'
def add_dates(data,raw):
 text=raw.decode('windows-1254')
 for row in re.findall(r'<tr class="haftaninMaclariTr">(.*?)</tr>',text,re.S):
  mid=re.search(r'macId=(\d+)',row,re.I);date=re.search(r'lblTarih[^>]*>([^<]+)',row);clock=re.search(r'lblSaat[^>]*>([^<]+)',row)
  if not (mid and date and clock):continue
  try:
   dt=datetime.datetime.strptime(date[1].strip()+' '+clock[1].strip(),'%d.%m.%Y %H:%M').replace(tzinfo=datetime.timezone(datetime.timedelta(hours=3)))
  except ValueError:continue
  for m in data['matches']:
   if m['id']==mid[1]:
    m['kickoff']=dt.isoformat()
    if m['homeGoals'] is not None and datetime.datetime.now(datetime.timezone.utc)<dt+datetime.timedelta(hours=3):m['status']='live'
 return data

def parse(raw):
 text=raw.decode('windows-1254')
 season=re.search(r'(202\d-202\d) Sezonu',text)
 if not season: raise ValueError('Season missing')
 pieces=re.split(r'<td[^>]*class="belirginYazi"[^>]*>\s*(\d+)\.Hafta\s*</td>',text)
 matches=[]
 for i in range(1,len(pieces),2):
  week=int(pieces[i]);section=pieces[i+1]
  pattern=r'<a[^>]*kulupId=(\d+)[^>]*>(.*?)</a>\s*</td>\s*<td[^>]*>\s*<a[^>]*macId=(\d+)[^>]*>(.*?)</a>\s*</td>\s*<td[^>]*>\s*<a[^>]*kulupId=(\d+)[^>]*>(.*?)</a>'
  for h,hn,mid,score,a,an in re.findall(pattern,section,re.S|re.I):
   nums=re.fullmatch(r'\s*(\d+)\s*-\s*(\d+)\s*',html.unescape(score))
   matches.append(dict(id=mid,week=week,homeId=h,awayId=a,home=html.unescape(hn).strip(),away=html.unescape(an).strip(),homeGoals=int(nums[1]) if nums else None,awayGoals=int(nums[2]) if nums else None))
 if len(matches)!=306 or len({m['id'] for m in matches})!=306:raise ValueError('Expected 306 unique fixtures, got '+str(len(matches)))
 for w in range(1,35):
  ms=[m for m in matches if m['week']==w]
  if len(ms)!=9 or len({m[k] for m in ms for k in ('homeId','awayId')})!=18:raise ValueError('Invalid week '+str(w))
 # Canonical names come from the game's club catalog, mapped by official club id.
 names={'3604':'Galatasaray','3659':'Beşiktaş'}
 aliases={'GALATASARAY':'Galatasaray','BEŞİKTAŞ':'Beşiktaş','FENERBAHÇE':'Fenerbahçe','TRABZONSPOR':'Trabzonspor','ALANYASPOR':'Alanyaspor','SAMSUNSPOR':'Samsunspor','KOCAELİSPOR':'Kocaelispor','BAŞAKŞEHİR':'İstanbul Başakşehir FK','GÖZTEPE':'Göztepe','KASIMPAŞA':'Kasımpaşa','KONYASPOR':'Konyaspor','GAZİANTEP':'Gaziantep FK','RİZESPOR':'Çaykur Rizespor','GENÇLERBİRLİĞİ':'Gençlerbirliği','AMED':'Amed SK','EYÜPSPOR':'Eyüpspor','ERZURUMSPOR':'Erzurumspor FK','ÇORUM':'Çorum FK'}
 for m in matches:
  for side in ('home','away'):
   name=next((v for k,v in aliases.items() if k in m[side]),None)
   if not name:raise ValueError('Unknown club '+m[side])
   m[side]=name
  m['kickoff']=None
  m['status']='finished' if m['homeGoals'] is not None else 'scheduled'
 unfinished=[m['week'] for m in matches if m['homeGoals'] is None]
 current=min(unfinished) if unfinished else 34
 upcoming=next((w for w in range(current,35) if all(m['homeGoals'] is None for m in matches if m['week']==w)),current)
 return add_dates(dict(schemaVersion=2,season=season[1],source=URL,updatedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),currentWeek=current,recommendedWeek=upcoming,matches=matches),raw)
if __name__=='__main__':
 raw=pathlib.Path(sys.argv[1]).read_bytes() if len(sys.argv)>1 else urllib.request.urlopen(URL,timeout=45).read()
 d=parse(raw)
 if len(sys.argv)==1:
  # Date only the active and upcoming rounds; preserve explicit unknown dates on failure.
  for week in sorted({d['currentWeek'],min(34,d['currentWeek']+1)}):
   try:add_dates(d,urllib.request.urlopen(URL+'&hafta='+str(week),timeout=20).read())
   except Exception as error:print('Dates unavailable for week',week,':',error,file=sys.stderr)
 p=pathlib.Path('public/data/analysis-context.json');p.parent.mkdir(exist_ok=True,parents=True)
 temp=p.with_suffix('.tmp');temp.write_text(json.dumps(d,ensure_ascii=False,indent=2));temp.replace(p)
 print('Verified',len(d['matches']),'fixtures;',d['season'],'week',d['currentWeek'])
