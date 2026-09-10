import type { Player as StorePlayer } from "@/store/useTeamStore";
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
  "Tümosan Konyaspor",
  "Gaziantep FK",
  "Çaykur Rizespor",
  "Gençlerbirliği",
  "Amed SK",
  "Eyüpspor",
] as const;

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
];

export const SQUAD_STORAGE_KEY = "futbol-iq-fantasy-squad-v24";

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
