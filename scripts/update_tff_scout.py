import json, re, sys, time, os, unicodedata
from datetime import datetime, timezone
import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}
STANDARD_URLS = [
    "https://fbref.com/en/comps/26/stats/Super-Lig-Estatisticas",
    "https://fbref.com/en/comps/26/stats/Super-Lig-Stats",
]
PLAYING_URL = "https://fbref.com/en/comps/26/playingtime/Super-Lig-Stats"
INJURY_URL = "https://lineupstoday.com/super-lig/injuries/"
FANTASY_HOME = "https://www.fantasysuperlig.com/"
FANTASY_BLOGS = [
 "https://www.fantasysuperlig.com/blog/gw5-en-iyi-fantasy-oyunculari-form-raporu",
 "https://www.fantasysuperlig.com/blog/gw6-kaptan-transfer-diferansiyel-analizi",
 "https://www.fantasysuperlig.com/blog/gw3-kaptanlik-analizi-osimhen-greenwood",
]
TFF_URL = "https://www.tff.org/?pageID=198"
TEAM_ALIASES = {
 "KASIMPAŞA A.Ş.":"Kasımpaşa","TÜMOSAN KONYASPOR":"Konyaspor","ARCA ÇORUM FK":"Çorum FK",
 "CORENDON ALANYASPOR":"Alanyaspor","KOCAELİSPOR":"Kocaelispor","GAZİANTEP FUTBOL KULÜBÜ A.Ş.":"Gaziantep",
 "TRABZONSPOR A.Ş.":"Trabzonspor","GALATASARAY A.Ş.":"Galatasaray","İSTANBUL BAŞAKŞEHİR FK":"Başakşehir",
 "GENÇLERBİRLİĞİ":"Gençlerbirliği","FENERBAHÇE A.Ş.":"Fenerbahçe","EYÜPSPOR":"Eyüpspor",
 "ERZURUMSPOR FK":"Erzurumspor","SAMSUNSPOR A.Ş.":"Samsunspor","AMED SPORTİF FAALİYETLER":"Amedspor",
 "BEŞİKTAŞ A.Ş.":"Beşiktaş","GÖZTEPE A.Ş.":"Göztepe","ÇAYKUR RİZESPOR A.Ş.":"Rizespor"
}
OUT = "public/data/tff-scout.json"

def n(v):
    try:
        return float(str(v).replace(",", "").replace("%","").strip() or 0)
    except Exception:
        return 0.0

def norm_key(v):
    s = unicodedata.normalize("NFKD", str(v or "")).encode("ascii","ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+","",s)

def txt(row, key):
    el = row.select_one(f'[data-stat="{key}"]')
    return el.get_text(" ", strip=True) if el else ""

def pos_norm(v):
    v=(v or "").upper()
    if "GK" in v: return "GK"
    if any(x in v for x in ["DF","CB","FB"]): return "DF"
    if any(x in v for x in ["MF","DM","CM","AM"]): return "MF"
    if any(x in v for x in ["FW","ST","LW","RW"]): return "FW"
    return v[:2]

def fetch(url, min_bytes=1000):
    r=requests.get(url,headers=HEADERS,timeout=35)
    if not r.ok or len(r.text)<min_bytes:
        raise RuntimeError(f"{url}: HTTP {r.status_code}, {len(r.text)} bytes")
    return r.text.replace("<!--","").replace("-->","")

def fetch_first(urls):
    errors=[]
    for url in urls:
        try:
            html=fetch(url,50000)
            return html,url
        except Exception as e:
            errors.append(str(e)); time.sleep(2)
    raise RuntimeError("\n".join(errors))

def player_table(html, table_id):
    soup=BeautifulSoup(html,"lxml")
    t=soup.select_one(f"table#{table_id}")
    if t: return t
    for cand in soup.select("table"):
        if cand.select_one('[data-stat="player"]'):
            return cand
    raise RuntimeError(f"{table_id} player table not found")

def previous_data():
    if not os.path.exists(OUT): return {},{}
    try:
        old=json.load(open(OUT,encoding="utf-8"))
    except Exception:
        return {},{}
    by_id={p.get("id"):p for p in old.get("players",[]) if p.get("id")}
    by_name_team={(norm_key(p.get("player")),norm_key(p.get("team"))):p for p in old.get("players",[])}
    return by_id,by_name_team

def previous_for(p, old_id, old_nt):
    if p.get("id") in old_id: return old_id[p["id"]]
    return old_nt.get((norm_key(p.get("player")),norm_key(p.get("team"))),{})

def parse_playing_time(html):
    table=player_table(html,"stats_playing_time")
    out={}
    for row in table.select("tbody tr"):
        name=txt(row,"player"); team=txt(row,"team") or txt(row,"squad")
        if not name or not team: continue
        games=n(txt(row,"games"))
        starts=n(txt(row,"games_starts"))
        minutes=n(txt(row,"minutes"))
        out[(norm_key(name),norm_key(team))]={
            "starts":starts,"minutes":minutes,"games":games,
            "startRate": (starts/games if games else 0),
            "minutesPerMatch": (minutes/games if games else 0),
        }
    return out

def parse_injuries():
    unavailable={}
    try:
        html=fetch(INJURY_URL,5000)
    except Exception as e:
        print(f"Injury feed skipped: {e}",file=sys.stderr); return unavailable
    soup=BeautifulSoup(html,"lxml")
    # Site presents club sections followed by a table/list of unavailable players.
    for heading in soup.find_all(["h2","h3"]):
        team=heading.get_text(" ",strip=True)
        if not team or "Süper Lig" in team: continue
        node=heading.find_next()
        limit=0
        while node and node.name not in ["h2","h3"] and limit<30:
            if node.name in ["tr","li","div"]:
                text=" ".join(node.stripped_strings)
                if text and len(text)<250:
                    # Match against actual player names later, using the entire line as evidence.
                    unavailable.setdefault(norm_key(team),[]).append(text)
            node=node.find_next(); limit+=1
    return unavailable

def parse_current_fixtures():
    out={}
    try:
        html=fetch(TFF_URL,5000)
        soup=BeautifulSoup(html,"lxml")
        for tr in soup.select("tr"):
            text=" ".join(tr.stripped_strings)
            if not re.search(r"\d{2}\.\d{2}\.2026\s+\d{2}:\d{2}",text): continue
            found=[]
            for raw,canon in TEAM_ALIASES.items():
                if raw in text: found.append(canon)
            if len(found)==2:
                home,away=found
                out[home]={"opponent":away,"home":True}
                out[away]={"opponent":home,"home":False}
        # Some TFF markup is not table based; fall back to line-level text.
        if len(out)<12:
            body="\n".join(" ".join(x.stripped_strings) for x in soup.find_all(["div","li","p"]))
            for line in body.splitlines():
                if not re.search(r"\d{2}\.\d{2}\.2026\s+\d{2}:\d{2}",line): continue
                found=[canon for raw,canon in TEAM_ALIASES.items() if raw in line]
                if len(found)==2:
                    out[found[0]]={"opponent":found[1],"home":True}
                    out[found[1]]={"opponent":found[0],"home":False}
    except Exception as e:
        print(f"Fixture feed skipped: {e}",file=sys.stderr)
    return out

def parse_public_fantasy_market():
    market={}
    texts=[]
    for url in [FANTASY_HOME,*FANTASY_BLOGS]:
        try:
            texts.append(fetch(url,3000))
        except Exception as e:
            print(f"Fantasy public feed skipped {url}: {e}",file=sys.stderr)
    soup_text="\n".join(BeautifulSoup(x,"lxml").get_text(" ",strip=True) for x in texts)
    # Use actual league player names later; this helper scans a local text window around each name.
    return soup_text

def enrich_market(player, public_text, prev):
    out={
      "price":prev.get("price",6.0),
      "priceVerified":prev.get("priceVerified",False),
      "priceSource":prev.get("priceSource","Varsayılan/manuel"),
      "ownership":prev.get("ownership"),
      "ownershipVerified":prev.get("ownershipVerified",False),
      "ownershipSource":prev.get("ownershipSource","Bilinmiyor")
    }
    # Search surname + first initial/full name in a bounded public-text window.
    tokens=[t for t in re.split(r"\s+",player) if len(t)>2]
    needle=tokens[-1] if tokens else player
    m=re.search(rf"(.{{0,220}}\b{re.escape(needle)}\b.{{0,260}})",public_text,re.I)
    if not m: return out
    window=m.group(1)
    pm=re.search(r"(?:Fiyat|fiyatı|Fiyat₺)\s*₺?\s*([0-9]+(?:[\.,][0-9]+)?)\s*m?",window,re.I)
    if pm:
        out["price"]=float(pm.group(1).replace(",","."))
        out["priceVerified"]=True
        out["priceSource"]="Fantasy Süper Lig public"
    om=re.search(r"(?:sahipliği|sahiplik(?:i)?|ownership)\s*(?:yaklaşık\s*)?(?:yüzde\s*)?%?\s*([0-9]+(?:[\.,][0-9]+)?)",window,re.I)
    if om:
        out["ownership"]=float(om.group(1).replace(",","."))
        out["ownershipVerified"]=True
        out["ownershipSource"]="Fantasy Süper Lig public"
    return out

def injury_status(player, team, injury_sections):
    pkey=norm_key(player)
    tkey=norm_key(team)
    lines=[]
    for key,vals in injury_sections.items():
        if key in tkey or tkey in key:
            lines.extend(vals)
    for line in lines:
        if pkey and pkey in norm_key(line):
            low=line.lower()
            doubtful=("doubt" in low or "şüpheli" in low or "supheli" in norm_key(low))
            suspended=("suspend" in low or "cezalı" in low or "cezali" in norm_key(low))
            return {
                "unavailable": not doubtful,
                "doubtful": doubtful,
                "suspended": suspended,
                "injuryNote": line[:180],
                "injuryRisk": 0.5 if doubtful else 1.0
            }
    return {"unavailable":False,"doubtful":False,"suspended":False,"injuryNote":"","injuryRisk":0.0}

old_id,old_nt=previous_data()
std_html,used=fetch_first(STANDARD_URLS)
play_html=fetch(PLAYING_URL,30000)
ptime=parse_playing_time(play_html)
injuries=parse_injuries()
fixtures=parse_current_fixtures()
public_market=parse_public_fantasy_market()
table=player_table(std_html,"stats_standard")
players=[]

for i,row in enumerate(table.select("tbody tr")):
    player=txt(row,"player")
    if not player or player=="Player": continue
    team=txt(row,"team") or txt(row,"squad")
    pos=pos_norm(txt(row,"position"))
    if not team or pos not in {"GK","DF","MF","FW"}: continue
    href=(row.select_one('[data-stat="player"] a') or {}).get("href","") if row.select_one('[data-stat="player"] a') else ""
    fbref_id=""
    m=re.search(r"/players/([^/]+)/",href)
    if m: fbref_id=m.group(1)
    pid=f"fbref-{fbref_id}" if fbref_id else f"fbref-{norm_key(team)}-{norm_key(player)}"
    pt=ptime.get((norm_key(player),norm_key(team)),{})
    p={
        "id":pid,"player":player,"team":team,"pos":pos,
        "mp":n(txt(row,"games")),"min":n(txt(row,"minutes")),
        "starts":pt.get("starts",n(txt(row,"games_starts"))),
        "startRate":pt.get("startRate",0),
        "minutesPerMatch":pt.get("minutesPerMatch",0),
        "gls":n(txt(row,"goals")),"ast":n(txt(row,"assists")),
        "xg":n(txt(row,"xg")),"xa":n(txt(row,"xg_assist")),
        "xg90":n(txt(row,"xg_per90")),"xa90":n(txt(row,"xg_assist_per90")),
        "yellow":n(txt(row,"cards_yellow")),"red":n(txt(row,"cards_red")),
        "pk":n(txt(row,"pens_made")),"pkAtt":n(txt(row,"pens_att")),
    }
    prev=previous_for(p,old_id,old_nt)
    market=enrich_market(player,public_market,prev)
    p["price"]=market["price"]
    p["priceVerified"]=market["priceVerified"]
    p["priceSource"]=market["priceSource"]
    p["ownership"]=market["ownership"]
    p["ownershipVerified"]=market["ownershipVerified"]
    p["ownershipSource"]=market["ownershipSource"]
    p["penalty"]=bool(prev.get("penalty",False) or p["pkAtt"]>0)
    p["corner"]=bool(prev.get("corner",False))
    p["form4"]=bool(p["startRate"]>=0.8 and p["mp"]>=4)
    fixture=fixtures.get(team) or fixtures.get(TEAM_ALIASES.get(team,""))
    if fixture:
        p.update(fixture)
    else:
        for k in ["opponent","home"]:
            if k in prev: p[k]=prev[k]
    p.update(injury_status(player,team,injuries))
    # Start probability: recent availability + actual start rate + minutes.
    if p["unavailable"] or p["suspended"]:
        p["startProb"]=0.0
    else:
        base=max(p["startRate"], min(1.0,p["minutesPerMatch"]/75.0) if p["minutesPerMatch"] else 0)
        if p["mp"]<2: base=max(base,0.45)
        if p["doubtful"]: base*=0.55
        p["startProb"]=round(max(0.15,min(0.98,base or 0.55)),3)
    players.append(p)

if len(players)<250:
    raise SystemExit(f"Too few player rows parsed: {len(players)}")

out={
    "source":"FBref standard + playing time + LineupsToday availability",
    "sourceUrl":used,
    "playingTimeUrl":PLAYING_URL,
    "injuryUrl":INJURY_URL,
    "fixtureUrl":TFF_URL,
    "fixtureTeams":len(fixtures),
    "updatedAt":datetime.now(timezone.utc).isoformat(),
    "season":"2026-2027",
    "count":len(players),
    "automation":{
        "stats":"daily",
        "playingTime":"daily",
        "availability":"daily",
        "manualFieldsPreserved":["price","priceVerified","priceSource","ownership","ownershipVerified","ownershipSource","corner"]
    },
    "players":players,
}
os.makedirs(os.path.dirname(OUT),exist_ok=True)
with open(OUT,"w",encoding="utf-8") as f:
    json.dump(out,f,ensure_ascii=False,separators=(",",":"))
print(f"Wrote {len(players)} players from FBref; playing-time rows={len(ptime)}")
