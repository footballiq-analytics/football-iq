export type InjuryRecord = { checkedAt: string; source: string };
const normalize = (value: string) => value.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]/g, '');
export function injuryKey(name: string, club: string) {
  const aliases: Record<string, string> = { gaziantep: 'gaziantepfk', erzurumspor: 'erzurumsporfk', corum: 'corumfk', corumspor: 'corumfk', istanbulbasaksehir: 'istanbulbasaksehirfk', basaksehir: 'istanbulbasaksehirfk', rizespor: 'caykurrizespor', amedspor: 'amedsk', amedsportif: 'amedsk' };
  const team = normalize(club);
  return normalize(name) + '|' + (aliases[team] || team);
}
export function injuryIndex(data: unknown, now = Date.now()): Record<string, InjuryRecord> {
  const out: Record<string, InjuryRecord> = {};
  if (!data || typeof data !== 'object' || !('players' in data) || !Array.isArray(data.players)) return out;
  const seen = new Set<string>(), duplicates = new Set<string>();
  for (const row of data.players) {
    if (!row || typeof row.player !== 'string' || typeof row.team !== 'string' || !row.player.trim() || !row.team.trim()) continue;
    const key = injuryKey(row.player, row.team);
    if (seen.has(key)) { duplicates.add(key); delete out[key]; continue; }
    seen.add(key);
    if (row.unavailable !== true || typeof row.injurySource !== 'string' || !row.injurySource.startsWith('https://')) continue;
    const time = Date.parse(row.injuryUpdatedAt);
    if (!Number.isFinite(time) || time > now) continue;
    out[key] = { source: row.injurySource, checkedAt: row.injuryUpdatedAt };
  }
  for (const key of duplicates) delete out[key];
  return out;
}
export function injuryIsCurrent(record: InjuryRecord, now = Date.now()) {
  const age = now - Date.parse(record.checkedAt);
  return Number.isFinite(age) && age >= 0 && age <= 72 * 3600000;
}

export type SuspensionRecord = InjuryRecord & { kickoff: string; week: number };
export function suspensionIndex(data: unknown, now = Date.now()): Record<string, SuspensionRecord> {
 const out: Record<string, SuspensionRecord> = {};
 if (!data || typeof data !== 'object' || !('playerWarnings' in data) || !Array.isArray(data.playerWarnings)) return out;
 for (const row of data.playerWarnings) {
  if (!row || row.kind !== 'suspended' || typeof row.name !== 'string' || typeof row.club !== 'string' || !row.name.trim() || !row.club.trim()) continue;
  const checked = Date.parse(row.checkedAt), kickoff = Date.parse(row.kickoff);
  if (!Number.isInteger(row.week) || row.week < 1 || row.week > 34 || !Number.isFinite(checked) || !Number.isFinite(kickoff) || checked > now || now-checked > 72*3600000 || kickoff <= now) continue;
  if (typeof row.source !== 'string' || !/^https:\/\/www\.fotmob\.com\/(matches\/|match\/)/.test(row.source)) continue;
  out[injuryKey(row.name,row.club)] = {checkedAt:row.checkedAt,source:row.source,kickoff:row.kickoff,week:row.week};
 }
 return out;
}
