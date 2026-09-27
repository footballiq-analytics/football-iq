import json, re, sys, time, os, unicodedata, pathlib
from datetime import datetime, timezone
import requests
from bs4 import BeautifulSoup

OUT="public/data/tff-scout.json"
HEADERS={
 "User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
 "Accept-Language":"tr-TR,tr;q=0.9,en;q=0.8",
 "Referer":"https://www.fotmob.com/",
}
FOTMOB_LEAGUE_URLS=[
 "https://www.fotmob.com/api/data/leagues?id=71&ccode3=TUR",
 "https://www.fotmob.com/api/leagues?id=71&ccode3=TUR",
]
FOTMOB_TEAM_URLS=[
 "https://www.fotmob.com/api/data/teams?id={id}",
 "https://www.fotmob.com/api/teams?id={id}&tab=squad&type=team",
]
FBREF_URLS=[
 "https://fbref.com/en/comps/26/stats/Super-Lig-Stats",
 "https://fbref.com/en/comps/26/stats/Super-Lig-Estatisticas",
]

TEAM_CANON={
 "İstanbul Başakşehir":"İstanbul Başakşehir","Istanbul Basaksehir":"İstanbul Başakşehir","Başakşehir":"İstanbul Başakşehir",
 "Çaykur Rizespor":"Çaykur Rizespor","Rizespor":"Çaykur Rizespor",
 "Amedspor":"Amed SK","Amed Sportif":"Amed SK","Amed Sportif Faaliyetler":"Amed SK","Amed SK":"Amed SK",
 "Erzurumspor FK":"Erzurumspor","Erzurumspor":"Erzurumspor",
 "Çorum FK":"Çorum FK","Corum FK":"Çorum FK",
 "Gaziantep FK":"Gaziantep","Gaziantep":"Gaziantep",
}

def canon_team(v):
    return TEAM_CANON.get(str(v or "").strip(),str(v or "").strip())

def key(v):
    s=unicodedata.normalize("NFKD",str(v or "").lower().replace('ı','i')).encode("ascii","ignore").decode()
    return re.sub(r"[^a-z0-9]+","",s)

def n(v):
    try:return float(str(v if v is not None else 0).replace(",","").strip() or 0)
    except:return 0.0

def get_json(url,retries=3):
    err=None
    for i in range(retries):
        try:
            r=requests.get(url,headers={**HEADERS,"Accept":"application/json,*/*"},timeout=35)
            if r.ok:
                return r.json()
            err=RuntimeError(f"HTTP {r.status_code}: {url}")
            if r.status_code in (400,401,403,404):break
        except Exception as e: err=e
        time.sleep(1.2*(i+1))
    raise err or RuntimeError(url)

def first_json(urls):
    errs=[]
    for u in urls:
        try:return get_json(u),u
        except Exception as e:errs.append(str(e))
    raise RuntimeError(" | ".join(errs))

def role_pos(section,member):
    text=(" ".join([
        str(section.get("title","")),
        str((member.get("role") or {}).get("key","")),
        str((member.get("role") or {}).get("fallback","")),
        str(member.get("positionIdsDesc","")),
    ])).lower()
    if "keeper" in text or "goalkeeper" in text:return "GK"
    if "defend" in text or "back" in text:return "DF"
    if "midfield" in text:return "MF"
    if "attack" in text or "forward" in text or "striker" in text:return "FW"
    return ""

def load_previous():
    if not os.path.exists(OUT):return {}
    try:
        d=json.load(open(OUT,encoding="utf-8"))
        return {(key(p.get("player")),key(canon_team(p.get("team")))):{**p, "statsUpdatedAt":p.get("statsUpdatedAt",d.get("statsUpdatedAt",d.get("updatedAt")))} for p in d.get("players",[])}
    except:return {}

def league_teams(league):
    """Support single-table and grouped-table envelopes, never home/away duplicates."""
    found={}
    def visit(node):
        if isinstance(node,list):
            for item in node:visit(item)
        elif isinstance(node,dict):
            if isinstance(node.get('all'),list):
                for team in node['all']:
                    if not isinstance(team,dict) or not team.get('id') or not team.get('name'):continue
                    tid=str(team['id'])
                    if tid in found and key(found[tid]['name'])!=key(team['name']):raise ValueError('Conflicting team IDs')
                    found[tid]=team
            for field in ('data','table','tables'):
                if field in node:visit(node[field])
    visit(league.get('table'))
    return list(found.values())

def squad_sections(data):
    squad=data.get('squad')
    if isinstance(squad,dict):squad=squad.get('squad',[])
    return squad if isinstance(squad,list) else []

def injury_fields(member,team_id,checked_at):
    # A listed problem is a reason to exclude. No problem listed is NOT proof of fitness.
    injury=member.get('injury')
    risk=member.get('injured') is True or (isinstance(injury,dict) and bool(injury))
    return dict(unavailable=risk,doubtful=False,suspended=False,injuryRisk=1.0 if risk else 0.0,
                availability='unavailable' if risk else 'unknown',
                injuryNote='Kaynakta sakatlık / oynayamama kaydı var; kesin dönüş tarihi doğrulanmadı.' if risk else '',
                injuryUpdatedAt=checked_at,injurySource=f'https://www.fotmob.com/teams/{team_id}/overview')

def fetch_full_rosters():
    league,league_url=first_json(FOTMOB_LEAGUE_URLS)
    teams=league_teams(league)
    expected_season=json.loads(pathlib.Path("public/data/analysis-context.json").read_text())["season"]
    if str((league.get("details") or {}).get("selectedSeason", "")).replace("/","-")!=expected_season:raise ValueError("Provider season mismatch")
    if not isinstance(teams,list) or len(teams)<18:
        raise RuntimeError(f"FotMob league table incomplete: {len(teams) if isinstance(teams,list) else 0} teams")

    out=[];seen=set();team_names=set()
    for t in teams:
        tid=t.get("id"); team=canon_team(t.get("name") or t.get("shortName") or "")
        if not tid or not team:continue
        data=None
        for tpl in FOTMOB_TEAM_URLS:
            try:
                data=get_json(tpl.format(id=tid),retries=2);break
            except Exception:pass
        if not data:
            print(f"WARN no squad: {team}",file=sys.stderr);continue
        if str((data.get('details') or {}).get('id'))!=str(tid):raise ValueError('Wrong team response')
        checked_at=datetime.now(timezone.utc).isoformat()
        sections=squad_sections(data)
        count_before=len(out)
        for sec in sections:
            if str(sec.get("title","")).lower()=="coach":continue
            for m in sec.get("members") or []:
                name=m.get("name") or ""; pos=role_pos(sec,m)
                if not name or pos not in {"GK","DF","MF","FW"}:continue
                k=(key(name),key(team))
                if k in seen:continue
                seen.add(k);team_names.add(team)
                pid=m.get("id")
                out.append({
                    "id":f"fotmob-{pid or key(team)+'-'+key(name)}",
                    "fotmobId":pid,
                    "player":name,"team":team,"pos":pos,
                    "shirtNumber":m.get("shirtNumber"),"age":m.get("age"),
                    "photo":f"https://images.fotmob.com/image_resources/playerimages/{pid}.png" if pid else "",
                    "rosterOnly":True,
                    "mp":0,"min":0,"starts":0,"startRate":0,"minutesPerMatch":0,
                    "gls":n(m.get("goals")),"ast":n(m.get("assists")),
                    "xg":0,"xa":0,"xg90":0,"xa90":0,
                    "yellow":n(m.get("ycards")),"red":n(m.get("rcards")),
                    "pk":0,"pkAtt":0,
                    "price":6.0,"priceVerified":False,"priceSource":"Varsayılan/manuel",
                    "ownership":None,"ownershipVerified":False,"ownershipSource":"Bilinmiyor",
                    "penalty":False,"corner":False,"form4":False,
                    "unavailable":False,"doubtful":False,"suspended":False,"injuryRisk":0.0,
                    "startProb":0.25,
                    **injury_fields(m,tid,checked_at),
                })
        print(f"{team}: {len(out)-count_before} players")
        time.sleep(0.25)

    if len(team_names)<18 or len(out)<350:
        raise RuntimeError(f"Full roster validation failed: {len(out)} players / {len(team_names)} teams")
    return out,league_url

def txt(row,name):
    el=row.select_one(f'[data-stat="{name}"]')
    return el.get_text(" ",strip=True) if el else ""

def pos_norm(v):
    v=(v or "").upper()
    if "GK" in v:return "GK"
    if any(x in v for x in ["DF","CB","FB"]):return "DF"
    if any(x in v for x in ["MF","DM","CM","AM"]):return "MF"
    if any(x in v for x in ["FW","ST","LW","RW"]):return "FW"
    return ""

def fetch_fbref_stats():
    html=None;used=None
    for u in FBREF_URLS:
        try:
            r=requests.get(u,headers=HEADERS,timeout=30)
            if r.ok and len(r.text)>30000:
                html=r.text.replace("<!--","").replace("-->","");used=u;break
        except Exception:pass
    if not html:return {},None
    soup=BeautifulSoup(html,"lxml")
    expected_season=json.loads(pathlib.Path("public/data/analysis-context.json").read_text())["season"]
    heading=" ".join(x.get_text(" ",strip=True) for x in soup.select("title,h1"))
    if expected_season not in heading.replace("–","-"):return {},used
    table=soup.select_one("table#stats_standard")
    if not table:return {},used
    out={}
    for row in table.select("tbody tr"):
        name=txt(row,"player");team=canon_team(txt(row,"team") or txt(row,"squad"));pos=pos_norm(txt(row,"position"))
        if not name or not team or not pos:continue
        if not all(txt(row,k) for k in ("games","minutes","xg","xg_assist","xg_per90","xg_assist_per90")):continue
        mp=n(txt(row,"games"));minutes=n(txt(row,"minutes"))
        out[(key(name),key(team))]={
            "mp":mp,"min":minutes,"gls":n(txt(row,"goals")),"ast":n(txt(row,"assists")),
            "xg":n(txt(row,"xg")),"xa":n(txt(row,"xg_assist")),
            "xg90":n(txt(row,"xg_per90")),"xa90":n(txt(row,"xg_assist_per90")),
            "yellow":n(txt(row,"cards_yellow")),"red":n(txt(row,"cards_red")),
            "pk":n(txt(row,"pens_made")),"pkAtt":n(txt(row,"pens_att")),
            "minutesPerMatch":minutes/mp if mp else 0,
            "startProb":max(.25,min(.98,(minutes/mp/75) if mp else .25)),
            "rosterOnly":False,
        }
    return out,used

def main():
    previous=load_previous()
    players,league_url=fetch_full_rosters()
    stats,fbref_url=fetch_fbref_stats()

    for p in players:
        k=(key(p["player"]),key(canon_team(p["team"])))
        prev=previous.get(k,{})
        if k in stats:
            p.update(stats[k]);p['statsUpdatedAt']=datetime.now(timezone.utc).isoformat();p['statsSourceUrl']=fbref_url
        elif prev.get('rosterOnly') is False:
            # Keep the actual age of retained statistics; refreshing a roster is not refreshing xG.
            for fld in ['mp','min','starts','startRate','minutesPerMatch','gls','ast','xg','xa','xg90','xa90','yellow','red','pk','pkAtt','startProb','rosterOnly','statsUpdatedAt','statsSourceUrl']:
                if fld in prev:p[fld]=prev[fld]
        for fld in ["price","priceVerified","priceSource","ownership","ownershipVerified","ownershipSource","corner","opponent","home"]:
            if fld in prev:p[fld]=prev[fld]
        p["penalty"]=bool(prev.get("penalty",False) or p.get("pkAtt",0)>0)
        if p.get("unavailable") or p.get("suspended"):p["startProb"]=0

    teams=sorted({canon_team(p["team"]) for p in players if p.get("team")})
    if len(teams)<18 or len(players)<350:
        raise SystemExit(f"REFUSING TO PUBLISH incomplete data: {len(players)} players / {len(teams)} teams")

    context=json.loads(pathlib.Path('public/data/analysis-context.json').read_text())
    expected={key(canon_team(m[side])) for m in context['matches'] for side in ('home','away')}
    actual={key(canon_team(t)) for t in teams}
    # Alias suffixes are canonicalized before comparison, not guessed player matches.
    normalize=lambda k:{'istanbulbasaksehirfk':'istanbulbasaksehir','gaziantepfk':'gaziantep','erzurumsporfk':'erzurumspor'}.get(k,k)
    if {normalize(k) for k in expected}!={normalize(k) for k in actual}:raise ValueError('Roster clubs do not match the TFF season')
    out={
        "source":"FotMob full squads + optional FBref stats",
        "sourceUrl":league_url,
        "statsSourceUrl":fbref_url,
        "updatedAt":datetime.now(timezone.utc).isoformat(),
        "season":context['season'],
        "statsUpdatedAt":datetime.now(timezone.utc).isoformat() if stats else None,
        "statsCount":len(stats),
        "count":len(players),
        "teamCount":len(teams),
        "teams":teams,
        "players":players,
    }
    os.makedirs(os.path.dirname(OUT),exist_ok=True)
    with open(OUT+'.tmp',"w",encoding="utf-8") as fh:
        json.dump(out,fh,ensure_ascii=False,separators=(",",":"))
    os.replace(OUT+'.tmp',OUT)
    print(f"OK {len(players)} players / {len(teams)} teams -> {OUT}")

if __name__=="__main__":
    main()
