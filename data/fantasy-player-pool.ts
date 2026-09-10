import type { Player as StorePlayer } from "@/store/useTeamStore";
import { GALATASARAY_FANTASY_PLAYERS } from "./galatasaray-squad-2026";
import { BESIKTAS_FANTASY_PLAYERS } from "./besiktas-squad-2026";
import { FENERBAHCE_FANTASY_PLAYERS } from "./fenerbahce-squad-2026";
import { TRABZONSPOR_FANTASY_PLAYERS } from "./trabzonspor-squad-2026";

/**
 * Tek oyuncu havuzu giriş noktası.
 * Yeni bir kulübün gerçek kadrosu hazır olduğunda yalnızca burada birleştirilir.
 * Aşağıdaki geçici kayıtlar, henüz gerçek kadro veri dosyası oluşturulmamış kulüpler içindir.
 */
const LEGACY_PLACEHOLDER_PLAYERS: StorePlayer[] = [
  { id: "22", name: "Ali", club: "Tümosan Konyaspor", position: "DEF", price: 4.2, points: 0, matches: 0, selected: 0 },
  { id: "23", name: "Burak", club: "Göztepe", position: "GK", price: 4.0, points: 0, matches: 0, selected: 0 },
  { id: "24", name: "Yusuf", club: "Samsunspor", position: "DEF", price: 4.1, points: 0, matches: 0, selected: 0 },
  { id: "25", name: "Kerem", club: "İstanbul Başakşehir FK", position: "MID", price: 4.3, points: 0, matches: 0, selected: 0 },
  { id: "26", name: "Deniz", club: "Kasımpaşa", position: "FWD", price: 4.5, points: 0, matches: 0, selected: 0 },
];

export const REAL_SQUAD_CLUBS = [
  "Galatasaray",
  "Beşiktaş",
  "Fenerbahçe",
  "Trabzonspor",
] as const;

export const FANTASY_PLAYER_POOL: StorePlayer[] = [
  ...GALATASARAY_FANTASY_PLAYERS,
  ...BESIKTAS_FANTASY_PLAYERS,
  ...FENERBAHCE_FANTASY_PLAYERS,
  ...TRABZONSPOR_FANTASY_PLAYERS,
  ...LEGACY_PLACEHOLDER_PLAYERS,
];

export const SQUAD_STORAGE_KEY = "futbol-iq-fantasy-squad-v12";

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
  "22",
  "ts-andre-onana",
];

export const INITIAL_BENCH_IDS: (string | null)[] = ["23", "24", "25", "26"];
