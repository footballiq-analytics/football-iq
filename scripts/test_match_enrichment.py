import copy, unittest
from update_match_enrichment import parse_match, join_fixtures
NOW='2026-10-02T20:00:00Z'
class MatchTests(unittest.TestCase):
 def setUp(self):
  self.m={'id':'T1','week':6,'home':'Trabzonspor','away':'Galatasaray','kickoff':'2026-09-19T17:00:00Z','status':'finished','homeGoals':4,'awayGoals':0}
  self.row={'id':'F1','round':'6','home':{'id':'1','name':'Trabzonspor'},'away':{'id':'2','name':'Galatasaray'}}
  self.p={'general':{'matchId':'F1','leagueId':71,'matchRound':'6','homeTeam':self.row['home'],'awayTeam':self.row['away'],'matchTimeUTCDate':self.m['kickoff'],'finished':True},'header':{'status':{},'teams':[{'id':1,'score':4},{'id':2,'score':0}]},'content':{'stats':{'Periods':{'All':{'stats':[{'stats':[{'key':'expected_goals','stats':['2.2','0.0']}]}]}}},'playerStats':{}}}
 def test_player_match_statistics(self):
  self.p['content']['playerStats']={'10':{'id':10,'teamId':1,'stats':[{'stats':{k:{'key':k,'stat':{'value':v}} for k,v in [('minutes_played',90),('goals',0),('assists',1),('rating_title',8.2)]}}]}}
  p=parse_match(self.p,self.m,self.row,NOW)['appearances'][0]
  self.assertEqual((p['minutes'],p['goals'],p['assists'],p['rating']),(90,0,1,8.2))
  stats=self.p['content']['playerStats']['10']['stats'][0]['stats']
  stats['rating_title']['stat']['value']=99;stats['goals']['stat']['value']=None
  p=parse_match(self.p,self.m,self.row,NOW)['appearances'][0]
  self.assertNotIn('rating',p);self.assertNotIn('goals',p)
 def test_xg_zero_and_missing(self):
  self.assertEqual(parse_match(self.p,self.m,self.row,NOW)['metrics']['xg'],[2.2,0])
  self.p['content']['stats']['Periods']['All']['stats'][0]['stats'][0]['stats'][1]=None
  self.assertNotIn('xg',parse_match(self.p,self.m,self.row,NOW)['metrics'])
 def test_identity_and_score_and_time(self):
  for field,value in [('matchId','other'),('leagueId',42),('matchRound','5'),('finished',False),('matchTimeUTCDate','2027-01-01T10:00:00Z')]:
   bad=copy.deepcopy(self.p);bad['general'][field]=value
   with self.assertRaises(ValueError):parse_match(bad,self.m,self.row,NOW)
  bad=copy.deepcopy(self.p);bad['header']['teams'][0]['score']=3
  with self.assertRaises(ValueError):parse_match(bad,self.m,self.row,NOW)
 def test_league_join_ambiguity(self):
  c={'season':'2026-2027','matches':[self.m]};l={'details':{'id':71,'selectedSeason':'2026/2027'},'fixtures':{'allMatches':[self.row]}}
  self.assertEqual(len(join_fixtures(c,l)),1)
  l['fixtures']['allMatches'].append(self.row)
  self.assertEqual(join_fixtures(c,l),[])
  l['details']['selectedSeason']='2025/2026'
  with self.assertRaises(ValueError):join_fixtures(c,l)
 def test_unavailable_lineup_does_not_infer_fit(self):
  self.m.update(status='scheduled',kickoff='2026-10-09T17:00:00Z');self.p['general'].update(finished=False,started=False,matchTimeUTCDate=self.m['kickoff'])
  result=parse_match(self.p,self.m,self.row,NOW)
  self.assertEqual(result['absences'],[]);self.assertIn('henüz',result['notes']['lineup']);self.assertEqual(result['metrics'],{})
if __name__=='__main__':unittest.main()
