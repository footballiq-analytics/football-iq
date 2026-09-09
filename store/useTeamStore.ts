import { create } from "zustand";

export type PlayerPosition = "GK" | "DEF" | "MID" | "FWD";
export type Formation = "4-3-3" | "4-4-2" | "3-4-3" | "3-5-2" | "5-3-2";

export type Player = {
  id: string;
  name: string;
  club: string;
  position: PlayerPosition;
  price: number;
  points: number;
  matches?: number;
  selected?: number;
  photo?: string;
  clubLogo?: string;
};

export type StartingSlot = { id: string; position: PlayerPosition; playerId: string | null };
export type BenchSlot = { id: string; position: PlayerPosition; playerId: string | null };

type TeamStore = {
  formation: Formation;
  players: Record<string, Player>;
  startingSlots: StartingSlot[];
  benchSlots: BenchSlot[];
  toast: string | null;
  hydrateTeam: (players: Player[], formation: Formation, startingIds: (string | null)[], benchIds: (string | null)[]) => void;
  setFormation: (formation: Formation) => boolean;
  setToast: (message: string | null) => void;
  swapStartingAndBench: (startingPlayerId: string, benchPlayerId: string) => boolean;
  swapFieldPositions: (player1Id: string, player2Id: string) => boolean;
  swapBenchPlayers: (player1Id: string, player2Id: string) => boolean;
  movePlayerToEmptySlot: (playerId: string, sourceSlotId: string, targetSlotId: string) => boolean;
  addPlayerFromTransfer: (player: Player, targetSlotId: string) => boolean;
  removePlayer: (playerId: string) => void;
};

export const FORMATION_POSITIONS: Record<Formation, PlayerPosition[]> = {
  "4-3-3": ["FWD", "FWD", "FWD", "MID", "MID", "MID", "DEF", "DEF", "DEF", "DEF", "GK"],
  "4-4-2": ["FWD", "FWD", "MID", "MID", "MID", "MID", "DEF", "DEF", "DEF", "DEF", "GK"],
  "3-4-3": ["FWD", "FWD", "FWD", "MID", "MID", "MID", "MID", "DEF", "DEF", "DEF", "GK"],
  "3-5-2": ["FWD", "FWD", "MID", "MID", "MID", "MID", "MID", "DEF", "DEF", "DEF", "GK"],
  "5-3-2": ["FWD", "FWD", "MID", "MID", "MID", "DEF", "DEF", "DEF", "DEF", "DEF", "GK"],
};

const BENCH_POSITIONS: PlayerPosition[] = ["GK", "DEF", "MID", "FWD"];

function buildStartingSlots(formation: Formation, ids: (string | null)[]) {
  return FORMATION_POSITIONS[formation].map((position, index) => ({ id: `start-${index}`, position, playerId: ids[index] ?? null }));
}
function buildBenchSlots(ids: (string | null)[]) {
  return BENCH_POSITIONS.map((position, index) => ({ id: `bench-${index}`, position, playerId: ids[index] ?? null }));
}
function benchAccepts(slot: BenchSlot, player: Player) { return slot.position === player.position; }

export const useTeamStore = create<TeamStore>((set, get) => ({
  formation: "4-3-3",
  players: {},
  startingSlots: buildStartingSlots("4-3-3", []),
  benchSlots: buildBenchSlots([]),
  toast: null,

  hydrateTeam: (players, formation, startingIds, benchIds) => {
    set({ players: Object.fromEntries(players.map((player) => [player.id, player])), formation, startingSlots: buildStartingSlots(formation, startingIds), benchSlots: buildBenchSlots(benchIds) });
  },

  setFormation: (formation) => {
    const { startingSlots, players } = get();
    const nextSlots = buildStartingSlots(formation, startingSlots.map((slot) => slot.playerId));
    const invalidCount = nextSlots.filter((slot) => slot.playerId && players[slot.playerId]?.position !== slot.position).length;
    set({ formation, startingSlots: nextSlots, toast: invalidCount ? `${formation} uygulandı. ${invalidCount} oyuncu kendi mevkisi dışında kaldı; kırmızı oyuncuları düzeltmeden kadro kaydedilemez.` : `${formation} dizilişi uygulandı.` });
    return true;
  },

  setToast: (message) => set({ toast: message }),

  swapStartingAndBench: (startingPlayerId, benchPlayerId) => {
    const { startingSlots, benchSlots, players } = get();
    const startIndex = startingSlots.findIndex((slot) => slot.playerId === startingPlayerId);
    const benchIndex = benchSlots.findIndex((slot) => slot.playerId === benchPlayerId);
    if (startIndex < 0 || benchIndex < 0) return false;
    const startingPlayer = players[startingPlayerId];
    const benchPlayer = players[benchPlayerId];
    if (!startingPlayer || !benchPlayer) return false;
    if (startingSlots[startIndex].position !== benchPlayer.position || benchSlots[benchIndex].position !== startingPlayer.position) {
      set({ toast: "Bu iki oyuncu mevki kuralları nedeniyle yer değiştiremez." }); return false;
    }
    const nextStarting = [...startingSlots];
    const nextBench = [...benchSlots];
    nextStarting[startIndex] = { ...nextStarting[startIndex], playerId: benchPlayerId };
    nextBench[benchIndex] = { ...nextBench[benchIndex], playerId: startingPlayerId };
    set({ startingSlots: nextStarting, benchSlots: nextBench, toast: `${startingPlayer.name} ile ${benchPlayer.name} yer değiştirdi.` });
    return true;
  },

  swapFieldPositions: (player1Id, player2Id) => {
    const { startingSlots, players } = get();
    const firstIndex = startingSlots.findIndex((slot) => slot.playerId === player1Id);
    const secondIndex = startingSlots.findIndex((slot) => slot.playerId === player2Id);
    if (firstIndex < 0 || secondIndex < 0) return false;
    if (players[player1Id]?.position !== players[player2Id]?.position) { set({ toast: "Saha içi konum takası yalnızca aynı mevki oyuncuları arasında yapılabilir." }); return false; }
    const next = [...startingSlots];
    const first = next[firstIndex].playerId;
    next[firstIndex] = { ...next[firstIndex], playerId: next[secondIndex].playerId };
    next[secondIndex] = { ...next[secondIndex], playerId: first };
    set({ startingSlots: next, toast: "Saha içi pozisyonlar değiştirildi." });
    return true;
  },

  swapBenchPlayers: (player1Id, player2Id) => {
    const { benchSlots, players } = get();
    const firstIndex = benchSlots.findIndex((slot) => slot.playerId === player1Id);
    const secondIndex = benchSlots.findIndex((slot) => slot.playerId === player2Id);
    if (firstIndex < 0 || secondIndex < 0) return false;
    const firstPlayer = players[player1Id];
    const secondPlayer = players[player2Id];
    if (!firstPlayer || !secondPlayer) return false;
    if (!benchAccepts(benchSlots[firstIndex], secondPlayer) || !benchAccepts(benchSlots[secondIndex], firstPlayer)) { set({ toast: "Yedek koltukları mevkiye özeldir: GK, DF, OT ve F." }); return false; }
    const next = [...benchSlots];
    next[firstIndex] = { ...next[firstIndex], playerId: player2Id };
    next[secondIndex] = { ...next[secondIndex], playerId: player1Id };
    set({ benchSlots: next, toast: "Yedek oyuncuların sırası değiştirildi." });
    return true;
  },

  movePlayerToEmptySlot: (playerId, sourceSlotId, targetSlotId) => {
    const { startingSlots, benchSlots, players } = get();
    const player = players[playerId];
    if (!player) return false;
    const targetStartingIndex = startingSlots.findIndex((slot) => slot.id === targetSlotId);
    const targetBenchIndex = benchSlots.findIndex((slot) => slot.id === targetSlotId);
    if (targetStartingIndex >= 0) {
      const target = startingSlots[targetStartingIndex];
      if (target.playerId || target.position !== player.position) { set({ toast: `${player.name} bu saha slotuna taşınamaz.` }); return false; }
    }
    if (targetBenchIndex >= 0) {
      const target = benchSlots[targetBenchIndex];
      if (target.playerId || !benchAccepts(target, player)) { set({ toast: `${player.name} bu yedek slotuna taşınamaz.` }); return false; }
    }
    if (targetStartingIndex < 0 && targetBenchIndex < 0) return false;
    const nextStarting = startingSlots.map((slot, index) => slot.id === sourceSlotId ? { ...slot, playerId: null } : index === targetStartingIndex ? { ...slot, playerId } : slot);
    const nextBench = benchSlots.map((slot, index) => slot.id === sourceSlotId ? { ...slot, playerId: null } : index === targetBenchIndex ? { ...slot, playerId } : slot);
    set({ startingSlots: nextStarting, benchSlots: nextBench, toast: `${player.name} yeni slota taşındı.` });
    return true;
  },

  addPlayerFromTransfer: (player, targetSlotId) => {
    const { startingSlots, benchSlots, players } = get();
    const nextPlayers = { ...players, [player.id]: player };
    if (targetSlotId.startsWith("start-")) {
      const slotIndex = startingSlots.findIndex((slot) => slot.id === targetSlotId);
      if (slotIndex < 0) return false;
      const slot = startingSlots[slotIndex];
      if (slot.playerId || slot.position !== player.position) { set({ toast: `${player.name} bu mevki alanına bırakılamaz.` }); return false; }
      const next = [...startingSlots]; next[slotIndex] = { ...slot, playerId: player.id };
      set({ players: nextPlayers, startingSlots: next, toast: `${player.name} ilk 11'e eklendi.` }); return true;
    }
    if (targetSlotId.startsWith("bench-")) {
      const slotIndex = benchSlots.findIndex((slot) => slot.id === targetSlotId);
      if (slotIndex < 0) return false;
      const slot = benchSlots[slotIndex];
      if (slot.playerId || !benchAccepts(slot, player)) { set({ toast: `Bu yedek koltuğu yalnızca ${slot.position} oyuncusu kabul eder.` }); return false; }
      const next = [...benchSlots]; next[slotIndex] = { ...slot, playerId: player.id };
      set({ players: nextPlayers, benchSlots: next, toast: `${player.name} yedek kulübesine eklendi.` }); return true;
    }
    return false;
  },

  removePlayer: (playerId) => set((state) => ({ startingSlots: state.startingSlots.map((slot) => slot.playerId === playerId ? { ...slot, playerId: null } : slot), benchSlots: state.benchSlots.map((slot) => slot.playerId === playerId ? { ...slot, playerId: null } : slot), toast: "Oyuncu kadrodan çıkarıldı." })),
}));
