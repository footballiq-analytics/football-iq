import unittest
from unittest.mock import patch
import update_tff_scout as scout

class RefreshTests(unittest.TestCase):
 def test_table_envelopes(self):
  teams=[{'id':i,'name':f'Team {i}'} for i in range(1,19)]
  for shape in [{'all':teams},{'data':{'table':{'all':teams}}},[{'data':{'table':{'all':teams,'home':teams,'away':teams}}}]]:
   self.assertEqual(scout.league_teams({'table':shape}),teams)
  self.assertEqual(scout.league_teams({'table':[{'all':teams},{'all':teams}]}),teams)
 def test_incomplete_and_conflicting_table(self):
  self.assertEqual(scout.league_teams({'table':None}),[])
  with self.assertRaises(ValueError):scout.league_teams({'table':[{'all':[{'id':1,'name':'A'}]},{'all':[{'id':1,'name':'B'}]}]})
 def test_squad_shapes(self):
  rows=[{'title':'keepers','members':[]}]
  self.assertEqual(scout.squad_sections({'squad':rows}),rows)
  self.assertEqual(scout.squad_sections({'squad':{'squad':rows}}),rows)
  self.assertEqual(scout.squad_sections({'squad':None}),[])
 def test_injury_unknown_is_not_fit(self):
  for m in [{},{'injury':None},{'injured':False}]:
   x=scout.injury_fields(m,1,'2026-09-27T10:00:00Z')
   self.assertEqual(x['availability'],'unknown');self.assertFalse(x['unavailable'])
  for m in [{'injured':True},{'injury':{'id':'14','expectedReturn':'Unknown'}}]:
   self.assertTrue(scout.injury_fields(m,1,'2026-09-27T10:00:00Z')['unavailable'])
 def test_turkish_identity_and_clubs(self):
  self.assertEqual(scout.key('Günay Güvenç'),scout.key('Günay Güvenc'))
  self.assertEqual(scout.key('Uğurcan Çakır'),scout.key('Uğurcan Çakir'))
  self.assertEqual(scout.canon_team('Amed Sportif'),'Amed SK')
 def test_permanent_http_failure_not_retried(self):
  with patch.object(scout.requests,'get') as get,patch.object(scout.time,'sleep') as sleep:
   get.return_value.ok=False;get.return_value.status_code=404
   with self.assertRaises(RuntimeError):scout.get_json('https://example.test')
   self.assertEqual(get.call_count,1);sleep.assert_not_called()
if __name__=='__main__':unittest.main()
