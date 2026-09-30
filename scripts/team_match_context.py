"""Observed club schedule and historical lineup; never complete player workload."""
from datetime import datetime, timezone, timedelta

def moment(value):
    try:
        d=datetime.fromisoformat(value.replace('Z','+00:00'))
        return d if d.tzinfo else None
    except (AttributeError,TypeError,ValueError):return None

def extract_team_context(data,team_id,checked_at):
    now=moment(checked_at)
    if now is None:raise ValueError('Observation timestamp required')
    rows=((data.get('fixtures') or {}).get('allFixtures') or {}).get('fixtures') or []
    result={'checkedAt':checked_at,'source':f'https://www.fotmob.com/teams/{team_id}/fixtures','coverage':'club-calendar-only','fixtures':[],'lastLineup':None}
    seen=set()
    for row in rows:
        status=row.get('status') or {};kickoff=moment(status.get('utcTime'))
        home=row.get('home') or {};away=row.get('away') or {};mid=row.get('id')
        if not isinstance(mid,int) or mid in seen or team_id not in (home.get('id'),away.get('id')):continue
        if not kickoff or not now-timedelta(days=30)<=kickoff<=now+timedelta(days=45):continue
        if status.get('cancelled') or status.get('awarded'):continue
        if status.get('finished') is True and kickoff>now:continue
        seen.add(mid)
        result['fixtures'].append({'id':str(mid),'kickoff':kickoff.isoformat(),'finished':status.get('finished') is True,'home':home.get('id')==team_id,'opponent':str((away if home.get('id')==team_id else home).get('name') or 'Bilinmiyor'),'competition':str((row.get('tournament') or {}).get('name') or 'Bilinmiyor')})
    result['fixtures'].sort(key=lambda x:x['kickoff'])
    overview=data.get('overview') or {};lineup=overview.get('lastLineupStats') or {};last=overview.get('lastMatch') or {}
    info=lineup.get('lastMatch') or {};mid=last.get('id')
    match=next((r for r in result['fixtures'] if r['id']==str(mid) and r['finished']),None)
    starters=lineup.get('starters') or [];subs=lineup.get('subs') or []
    ids=[p.get('id') for p in starters];bench=[p.get('id') for p in subs]
    if match and lineup.get('id')==team_id and info.get('matchId')==mid and len(ids)==11 and all(type(i) is int for i in ids+bench) and len(set(ids+bench))==len(ids+bench):
        result['lastLineup']={'fixtureId':str(mid),'kickoff':match['kickoff'],'opponent':match['opponent'],'formation':str(lineup.get('formation') or '—'),'starters':[str(i) for i in ids],'bench':[str(i) for i in bench]}
    return result
