import type { Player as StorePlayer } from "@/store/useTeamStore";
import { SUPER_LIG_CLUBS_2026_27 } from "./superlig-2026";
import { GALATASARAY_FANTASY_PLAYERS } from "./galatasaray-squad-2026";
import { BESIKTAS_FANTASY_PLAYERS } from "./besiktas-squad-2026";
import { FENERBAHCE_FANTASY_PLAYERS } from "./fenerbahce-squad-2026";
import { TRABZONSPOR_FANTASY_PLAYERS } from "./trabzonspor-squad-2026";
import { ALANYASPOR_FANTASY_PLAYERS } from "./alanyaspor-squad-2026";
import { SAMSUNSPOR_FANTASY_PLAYERS } from "./samsunspor-squad-2026";
import { KOCAELISPOR_FANTASY_PLAYERS } from "./kocaelispor-squad-2026";
import { BASAKSEHIR_FANTASY_PLAYERS } from "./basaksehir-squad-2026";
import { GOZTEPE_FANTASY_PLAYERS } from "./goztepe-squad-2026";
import { KASIMPASA_FANTASY_PLAYERS } from "./kasimpasa-squad-2026";
import { KONYASPOR_FANTASY_PLAYERS } from "./konyaspor-squad-2026";
import { GAZIANTEP_FANTASY_PLAYERS } from "./gaziantep-squad-2026";
import { RIZESPOR_FANTASY_PLAYERS } from "./rizespor-squad-2026";
import { GENCLERBIRLIGI_FANTASY_PLAYERS } from "./genclerbirligi-squad-2026";
import { AMED_FANTASY_PLAYERS } from "./amed-squad-2026";
import { EYUPSPOR_FANTASY_PLAYERS } from "./eyupspor-squad-2026";
import { ERZURUMSPOR_FANTASY_PLAYERS } from "./erzurumspor-squad-2026";
import { CORUM_FANTASY_PLAYERS } from "./corum-squad-2026";

/** Tek oyuncu havuzu giriş noktası. Yeni gerçek kulüp kadroları burada birleştirilir. */
export const REAL_SQUAD_CLUBS = [
  "Galatasaray",
  "Beşiktaş",
  "Fenerbahçe",
  "Trabzonspor",
  "Alanyaspor",
  "Samsunspor",
  "Kocaelispor",
  "İstanbul Başakşehir FK",
  "Göztepe",
  "Kasımpaşa",
  "Konyaspor",
  "Gaziantep FK",
  "Çaykur Rizespor",
  "Gençlerbirliği",
  "Amed SK",
  "Eyüpspor",
  "Erzurumspor FK",
  "Çorum FK",
] as const;

export const POSITION_PRICE_CAPS = { GK: 5.5, DEF: 5.25 } as const;

/** Product pricing, independent of real-world market values. */
export const PLAYER_PRICE_OVERRIDES: Readonly<Record<string, number>> = {
  "bjk-orkun-kokcu": 8, "fb-ngolo-kante": 7, "gs-rafael-leao": 9.5,
  "ts-mohamed-salah": 10, "bjk-dusan-vlahovic": 10, "gs-leroy-sane": 9,
  "fb-romelu-lukaku": 8, "fb-mason-greenwood": 9, "ts-franculino-dju": 7.6,
  "bjk-leandro-trossard": 9, "fb-kerem-akturkoglu": 7.5, "gs-baris-alper-yilmaz": 8,
  "kon-mostafa-mohamed": 7.5, "amed-gift-orban": 7.5, "sam-mohamed-bayo": 7.5,
  "koc-bruno-petkovic": 7, "cor-youssoufa-moukoko": 7.5, "ibfk-eldor-shomurodov": 9,
  "gs-gabriel-sara": 7.8, "gs-lucas-torreira": 7.4, "fb-matteo-guendouzi": 7.6,
  "ibfk-abbosbek-fayzullaev": 7.5, "ibfk-andreas-skov-olsen": 7,
  "bjk-wilfred-ndidi": 6.3, "ts-ruslan-malinovskyi": 7, "aln-ianis-hagi": 6.4,
  "ksp-haris-hajradinovic": 6, "ksp-kerem-demirbay": 6,
};
// The three highest-priced defenders in the original pool retain the premium tier.
export const PREMIUM_DEFENDER_IDS = ["gs-wilfried-singo", "gs-davinson-sanchez", "fb-nathan-ake"] as const;
const premiumDefenders = new Set<string>(PREMIUM_DEFENDER_IDS);
function fantasyPrice(player: StorePlayer): number {
  if (player.position === "GK") return Math.min(player.price, POSITION_PRICE_CAPS.GK);
  if (player.position === "DEF") {
    if (premiumDefenders.has(player.id)) return POSITION_PRICE_CAPS.DEF;
    // Compress the remaining original 3.5–8.5M scale into 3.5–5M quarter steps.
    return Math.min(5, Math.max(3.5, Math.round((3.5 + (player.price - 3.5) * .3) * 4) / 4));
  }
  return PLAYER_PRICE_OVERRIDES[player.id] ?? player.price;
}

export const FANTASY_PLAYER_POOL: StorePlayer[] = [
  ...GALATASARAY_FANTASY_PLAYERS,
  ...BESIKTAS_FANTASY_PLAYERS,
  ...FENERBAHCE_FANTASY_PLAYERS,
  ...TRABZONSPOR_FANTASY_PLAYERS,
  ...ALANYASPOR_FANTASY_PLAYERS,
  ...SAMSUNSPOR_FANTASY_PLAYERS,
  ...KOCAELISPOR_FANTASY_PLAYERS,
  ...BASAKSEHIR_FANTASY_PLAYERS,
  ...GOZTEPE_FANTASY_PLAYERS,
  ...KASIMPASA_FANTASY_PLAYERS,
  ...KONYASPOR_FANTASY_PLAYERS,
  ...GAZIANTEP_FANTASY_PLAYERS,
  ...RIZESPOR_FANTASY_PLAYERS,
  ...GENCLERBIRLIGI_FANTASY_PLAYERS,
  ...AMED_FANTASY_PLAYERS,
  ...EYUPSPOR_FANTASY_PLAYERS,
  ...ERZURUMSPOR_FANTASY_PLAYERS,
  ...CORUM_FANTASY_PLAYERS,
].map(player => ({
  ...player,
  price: fantasyPrice(player),
}));

export const SQUAD_STORAGE_KEY = "futbol-iq-fantasy-squad-v26";

export const INITIAL_LINEUP_IDS: (string | null)[] = [
  "gs-victor-osimhen",
  "bjk-mustafa-erhan-hekimoglu",
  "fb-romelu-lukaku",
  "gs-renato-nhaga",
  "bjk-kartal-kayra-yilmaz",
  "fb-ngolo-kante",
  "gs-el-chadaille-bitshiabu",
  "bjk-umit-akdag",
  "ts-cenk-ozkacar",
  "kon-adil-demirbag",
  "ts-andre-onana",
];

export const INITIAL_BENCH_IDS: (string | null)[] = [
  "goz-arda-ozcimen",
  "sam-logi-tomasson",
  "ibfk-umut-gunes",
  "ksp-adrian-benedyczak",
];

const VALID_POSITIONS = new Set(["GK", "DEF", "MID", "FWD"]);
const DEFAULT_LINEUP_POSITIONS = ["FWD", "FWD", "FWD", "MID", "MID", "MID", "DEF", "DEF", "DEF", "DEF", "GK"] as const;
const DEFAULT_BENCH_POSITIONS = ["GK", "DEF", "MID", "FWD"] as const;

export type FantasyDataIntegrityReport = {
  playerCount: number;
  clubCount: number;
  errors: string[];
};

export function validateFantasyDataIntegrity(): FantasyDataIntegrityReport {
  const errors: string[] = [];
  const leagueClubs = new Set<string>(SUPER_LIG_CLUBS_2026_27);
  const realClubs = new Set<string>(REAL_SQUAD_CLUBS);
  const seenIds = new Set<string>();
  const seenIdentity = new Set<string>();
  const playerById = new Map<string, StorePlayer>();

  if (leagueClubs.size !== 18) errors.push(`Süper Lig kulüp sayısı 18 olmalı, mevcut: ${leagueClubs.size}.`);
  if (realClubs.size !== leagueClubs.size) errors.push(`Gerçek kadro kulüp sayısı ${realClubs.size}, lig kulüp sayısı ${leagueClubs.size}.`);
  for (const club of leagueClubs) if (!realClubs.has(club)) errors.push(`REAL_SQUAD_CLUBS eksik kulüp: ${club}.`);
  for (const club of realClubs) if (!leagueClubs.has(club)) errors.push(`Lig listesinde olmayan gerçek kadro kulübü: ${club}.`);

  for (const player of FANTASY_PLAYER_POOL) {
    const id = String(player.id).trim();
    const name = player.name.trim();
    const club = player.club.trim();
    if (!id) errors.push("Boş oyuncu ID'si bulundu.");
    if (!name) errors.push(`İsimsiz oyuncu bulundu: ${id || "ID YOK"}.`);
    if (!leagueClubs.has(club)) errors.push(`${name || id}: geçersiz kulüp adı '${club}'.`);
    if (!VALID_POSITIONS.has(player.position)) errors.push(`${name || id}: geçersiz mevki '${String(player.position)}'.`);
    if (!Number.isFinite(player.price) || player.price <= 0) errors.push(`${name || id}: geçersiz fiyat '${player.price}'.`);
    if ((player.position === "GK" || player.position === "DEF") && player.price > POSITION_PRICE_CAPS[player.position]) errors.push(`${name}: mevki fiyat tavanı aşıldı.`);
    if (!Number.isFinite(player.points)) errors.push(`${name || id}: geçersiz puan '${player.points}'.`);
    if (seenIds.has(id)) errors.push(`Tekrarlanan oyuncu ID'si: ${id}.`);
    seenIds.add(id);
    const identity = `${club}::${name}`.toLocaleLowerCase("tr");
    if (seenIdentity.has(identity)) errors.push(`Aynı kulüpte tekrarlanan oyuncu: ${club} / ${name}.`);
    seenIdentity.add(identity);
    playerById.set(id, player);
  }

  for (const [id, price] of Object.entries(PLAYER_PRICE_OVERRIDES)) if (playerById.get(id)?.price !== price) errors.push(`Fiyat ayarı eksik/uyumsuz: ${id}.`);
  const premium = FANTASY_PLAYER_POOL.filter(p => p.position === "DEF" && p.price === POSITION_PRICE_CAPS.DEF);
  if (premium.length !== 3 || PREMIUM_DEFENDER_IDS.some(id => !premium.some(p => p.id === id))) errors.push("5.25M defans katmanında tam üç oyuncu olmalı.");

  for (const club of leagueClubs) if (!FANTASY_PLAYER_POOL.some(player => player.club === club)) errors.push(`Oyuncu havuzunda futbolcusu olmayan kulüp: ${club}.`);

  const initialIds = [...INITIAL_LINEUP_IDS, ...INITIAL_BENCH_IDS].filter((id): id is string => Boolean(id));
  if (INITIAL_LINEUP_IDS.length !== 11) errors.push(`Başlangıç ilk 11 slot sayısı 11 olmalı, mevcut: ${INITIAL_LINEUP_IDS.length}.`);
  if (INITIAL_BENCH_IDS.length !== 4) errors.push(`Başlangıç yedek slot sayısı 4 olmalı, mevcut: ${INITIAL_BENCH_IDS.length}.`);
  if (new Set(initialIds).size !== initialIds.length) errors.push("Başlangıç kadrosunda tekrarlanan oyuncu ID'si var.");
  for (const id of initialIds) if (!playerById.has(id)) errors.push(`Başlangıç kadrosunda havuzda bulunmayan ID: ${id}.`);

  INITIAL_LINEUP_IDS.forEach((id, index) => {
    if (!id) return;
    const player = playerById.get(id);
    if (player && player.position !== DEFAULT_LINEUP_POSITIONS[index]) errors.push(`Başlangıç ilk 11 mevki uyumsuzluğu: ${player.name} ${player.position}, slot ${DEFAULT_LINEUP_POSITIONS[index]}.`);
  });
  INITIAL_BENCH_IDS.forEach((id, index) => {
    if (!id) return;
    const player = playerById.get(id);
    if (player && player.position !== DEFAULT_BENCH_POSITIONS[index]) errors.push(`Başlangıç yedek mevki uyumsuzluğu: ${player.name} ${player.position}, slot ${DEFAULT_BENCH_POSITIONS[index]}.`);
  });

  return { playerCount: FANTASY_PLAYER_POOL.length, clubCount: realClubs.size, errors };
}

export const FANTASY_DATA_INTEGRITY = validateFantasyDataIntegrity();
if (FANTASY_DATA_INTEGRITY.errors.length) {
  throw new Error(`FUTBOL IQ veri bütünlüğü hatası:\n${FANTASY_DATA_INTEGRITY.errors.map(error => `- ${error}`).join("\n")}`);
}
