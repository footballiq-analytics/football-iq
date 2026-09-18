import json, re, sys, time
from datetime import datetime, timezone
import requests
from bs4 import BeautifulSoup

URLS = [
    "https://fbref.com/en/comps/26/stats/Super-Lig-Estatisticas",
    "https://fbref.com/en/comps/26/stats/Super-Lig-Stats",
]
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}
def n(v):
    try:
        return float(str(v).replace(",", "").strip() or 0)
    except:
        return 0.0
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

html=None; used=None; errors=[]
for url in URLS:
    try:
        r=requests.get(url,headers=HEADERS,timeout=30)
        if r.ok and len(r.text)>50000:
            html=r.text; used=url; break
        errors.append(f"{url}: HTTP {r.status_code}, {len(r.text)} bytes")
    except Exception as e:
        errors.append(f"{url}: {e}")
    time.sleep(2)
if not html:
    print("\n".join(errors), file=sys.stderr)
    raise SystemExit("FBref fetch failed")

# FBref often wraps tables in HTML comments.
html=html.replace("<!--","").replace("-->","")
soup=BeautifulSoup(html,"lxml")
table=soup.select_one("table#stats_standard")
if not table:
    for t in soup.select("table"):
        if t.select_one('[data-stat="player"]'):
            table=t; break
if not table:
    raise SystemExit("stats_standard table not found")

players=[]
for i,row in enumerate(table.select("tbody tr")):
    player=txt(row,"player")
    if not player or player=="Player": continue
    team=txt(row,"team") or txt(row,"squad")
    pos=pos_norm(txt(row,"position"))
    if pos not in {"GK","DF","MF","FW"}: continue
    p={
        "id": f"fbref-{i}-{re.sub(r'[^a-z0-9]+','-',player.lower()).strip('-')}",
        "player": player,
        "team": team,
        "pos": pos,
        "mp": n(txt(row,"games")),
        "min": n(txt(row,"minutes")),
        "gls": n(txt(row,"goals")),
        "ast": n(txt(row,"assists")),
        "xg": n(txt(row,"xg")),
        "xa": n(txt(row,"xg_assist")),
        "xg90": n(txt(row,"xg_per90")),
        "xa90": n(txt(row,"xg_assist_per90")),
        "price": 6.0,
        "penalty": False,
        "corner": False,
        "form4": False,
    }
    players.append(p)
if len(players)<50:
    raise SystemExit(f"Too few player rows parsed: {len(players)}")

out={
    "source":"FBref",
    "sourceUrl":used,
    "updatedAt":datetime.now(timezone.utc).isoformat(),
    "season":"2026-2027",
    "count":len(players),
    "players":players,
}
with open("public/data/tff-scout.json","w",encoding="utf-8") as f:
    json.dump(out,f,ensure_ascii=False,separators=(",",":"))
print(f"Wrote {len(players)} players from {used}")
