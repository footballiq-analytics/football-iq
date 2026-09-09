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

export type StartingSlot = {
  id: string;
  position: PlayerPosition;
  playerId: string | null;
};

export type BenchSlot = {
  id: string;
  kind: "GK" | "OUTFIELD";
  playerId: string | null;
};

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

const FORMATIONS = Object.keys(FORMATION_POSITIONS) as Formation[];

function buildStartingSlots(formation: Formation, ids: (string | null)[]) {
  return FORMATION_POSITIONS[formation].map((position, index) => ({
    id: `start-${index}`,
    position,
    playerId: ids[index] ?? null,
  }));
}

function getCounts(ids: string[], players: Record<string, Player>) {
  return ids.reduce(
    (acc, id) => {
      const position = players[id]?.position;
      if (position) acc[position] += 1;
      return acc;
    },
    { GK: 0, DEF: 0, MID: 0, FWD: 0 } as Record<PlayerPosition, number>,
  );
}

function inferFormation(ids: string[], players: Record<string, Player>) {
  const counts = getCounts(ids, players);
  return FORMATIONS.find((formation) => {
    const required = FORMATION_POSITIONS[formation].reduce(
      (acc, position) => {
        acc[position] += 1;
        return acc;
      },
      { GK: 0, DEF: 0, MID: 0, FWD: 0 } as Record<PlayerPosition, number>,
    );
    return required.GK === counts.GK && required.DEF === counts.DEF && required.MID === counts.MID && required.FWD === counts.FWD;
  });
}

function reflow(ids: string[], formation: Formation, players: Record<string, Player>) {
  const positions = FORMATION_POSITIONS[formation];
  const result: (string | null)[] = positions.map(() => null);
  ids.forEach((id) => {
    const player = players[id];
    if (!player) return;
    const index = positions.findIndex((position, slotIndex) => position === player.position && result[slotIndex] === null);
    if (index >= 0) result[index] = id;
  });
  return result;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  formation: "4-3-3",
  players: {},
  startingSlots: buildStartingSlots("4-3-3", []),
  benchSlots: [
    { id: "bench-0", kind: "GK", playerId: null },
    { id: "bench-1", kind: "OUTFIELD", playerId: null },
    { id: "bench-2", kind: "OUTFIELD", playerId: null },
    { id: "bench-3", kind: "OUTFIELD", playerId: null },
  ],
  toast: null,

  hydrateTeam: (players, formation, startingIds, benchIds) => {
    const playerMap = Object.fromEntries(players.map((player) => [player.id, player]));
    set({
      players: playerMap,
      formation,
      startingSlots: buildStartingSlots(formation, startingIds),
      benchSlots: [
        { id: "bench-0", kind: "GK", playerId: benchIds[0] ?? null },
        { id: "bench-1", kind: "OUTFIELD", playerId: benchIds[1] ?? null },
        { id: "bench-2", kind: "OUTFIELD", playerId: benchIds[2] ?? null },
        { id: "bench-3", kind: "OUTFIELD", playerId: benchIds[3] ?? null },
      ],
    });
  },

  setFormation: (formation) => {
    const { startingSlots, players } = get();
    const ids = startingSlots.map((slot) => slot.playerId);
    const nextSlots = buildStartingSlots(formation, ids);
    const invalidCount = nextSlots.filter((slot) => {
      if (!slot.playerId) return false;
      return players[slot.playerId]?.position !== slot.position;
    }).length;

    set({
      formation,
      startingSlots: nextSlots,
      toast: invalidCount > 0
        ? `${formation} uygulandı. ${invalidCount} oyuncu kendi mevkisi dışında kaldı; kırmızı oyuncuları düzeltmeden kadro kaydedilemez.`
        : `${formation} dizilişi uygulandı.`,
    });
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

    if (startingPlayer.position === "GK" || benchPlayer.position === "GK") {
      if (startingPlayer.position !== "GK" || benchPlayer.position !== "GK") {
        set({ toast: "Kaleci yalnızca yedek kaleci ile değiştirilebilir." });
        return false;
      }
    }

    const candidateIds = startingSlots
      .map((slot) => (slot.playerId === startingPlayerId ? benchPlayerId : slot.playerId))
      .filter((id): id is string => Boolean(id));
    const nextFormation = inferFormation(candidateIds, players);
    if (!nextFormation) {
      set({ toast: "Bu değişiklik geçerli bir diziliş oluşturmuyor." });
      return false;
    }

    const rebuiltIds = reflow(candidateIds, nextFormation, players);
    const nextBench = benchSlots.map((slot, index) => index === benchIndex ? { ...slot, playerId: startingPlayerId } : slot);
    set({
      formation: nextFormation,
      startingSlots: buildStartingSlots(nextFormation, rebuiltIds),
      benchSlots: nextBench,
      toast: `${startingPlayer.name} ile ${benchPlayer.name} yer değiştirdi. Diziliş: ${nextFormation}`,
    });
    return true;
  },

  swapFieldPositions: (player1Id, player2Id) => {
    const { startingSlots, players } = get();
    const firstIndex = startingSlots.findIndex((slot) => slot.playerId === player1Id);
    const secondIndex = startingSlots.findIndex((slot) => slot.playerId === player2Id);
    if (firstIndex < 0 || secondIndex < 0) return false;
    if (players[player1Id]?.position !== players[player2Id]?.position) {
      set({ toast: "Saha içi konum takası yalnızca aynı mevki oyuncuları arasında yapılabilir." });
      return false;
    }
    const next = [...startingSlots];
    const first = next[firstIndex].playerId;
    next[firstIndex] = { ...next[firstIndex], playerId: next[secondIndex].playerId };
    next[secondIndex] = { ...next[secondIndex], playerId: first };
    set({ startingSlots: next, toast: "Saha içi pozisyonlar değiştirildi." });
    return true;
  },

  addPlayerFromTransfer: (player, targetSlotId) => {
    const { startingSlots, benchSlots, players } = get();
    const nextPlayers = { ...players, [player.id]: player };

    if (targetSlotId.startsWith("start-")) {
      const slotIndex = startingSlots.findIndex((slot) => slot.id === targetSlotId);
      if (slotIndex < 0) return false;
      const slot = startingSlots[slotIndex];
      if (slot.position !== player.position) {
        set({ toast: `${player.name} bu mevki alanına bırakılamaz.` });
        return false;
      }
      const next = [...startingSlots];
      next[slotIndex] = { ...slot, playerId: player.id };
      set({ players: nextPlayers, startingSlots: next, toast: `${player.name} ilk 11'e eklendi.` });
      return true;
    }

    if (targetSlotId.startsWith("bench-")) {
      const slotIndex = benchSlots.findIndex((slot) => slot.id === targetSlotId);
      if (slotIndex < 0) return false;
      const slot = benchSlots[slotIndex];
      const valid = slot.kind === "GK" ? player.position === "GK" : player.position !== "GK";
      if (!valid) {
        set({ toast: slot.kind === "GK" ? "Bu yedek slotu yalnızca kaleci kabul eder." : "Kaleci saha oyuncusu yedek slotuna bırakılamaz." });
        return false;
      }
      const next = [...benchSlots];
      next[slotIndex] = { ...slot, playerId: player.id };
      set({ players: nextPlayers, benchSlots: next, toast: `${player.name} yedek kulübesine eklendi.` });
      return true;
    }

    return false;
  },

  removePlayer: (playerId) => {
    set((state) => ({
      startingSlots: state.startingSlots.map((slot) => slot.playerId === playerId ? { ...slot, playerId: null } : slot),
      benchSlots: state.benchSlots.map((slot) => slot.playerId === playerId ? { ...slot, playerId: null } : slot),
      toast: "Oyuncu kadrodan çıkarıldı.",
    }));
  },
}));
