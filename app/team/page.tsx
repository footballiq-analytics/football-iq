"use client";

import { DragDropContext, type DragStart, type DropResult } from "@hello-pangea/dnd";
import { useEffect, useMemo, useState } from "react";
import FootballPitch, { type BenchPitchSlot, type PitchSlot } from "@/components/fantasy/FootballPitch";
import TransferPanel from "@/components/fantasy/TransferPanel";
import type { FantasyPlayer, PlayerPosition } from "@/components/fantasy/PlayerCard";
import { SUPER_LIG_CLUBS_2026_27 } from "@/data/superlig-2026";
import { useTeamStore, type Formation, type Player as StorePlayer } from "@/store/useTeamStore";

const BUDGET = 100;
const STORAGE_KEY = "futbol-iq-fantasy-squad-v6";
const FORMATIONS: Formation[] = ["4-3-3", "4-4-2", "3-4-3", "3-5-2", "5-3-2"];

const players: StorePlayer[] = [
  { id: "1", name: "Victor Osimhen", club: "Galatasaray", position: "FWD", price: 11.5, points: 78, matches: 5, selected: 64 },
  { id: "2", name: "Vlahović", club: "Beşiktaş", position: "FWD", price: 11, points: 71, matches: 5, selected: 52 },
  { id: "3", name: "En-Nesyri", club: "Fenerbahçe", position: "FWD", price: 9.2, points: 67, matches: 5, selected: 47 },
  { id: "4", name: "Rafa Silva", club: "Beşiktaş", position: "MID", price: 8.6, points: 63, matches: 5, selected: 43 },
  { id: "5", name: "Talisca", club: "Fenerbahçe", position: "MID", price: 9, points: 61, matches: 5, selected: 41 },
  { id: "6", name: "Torreira", club: "Galatasaray", position: "MID", price: 7.4, points: 58, matches: 5, selected: 38 },
  { id: "7", name: "Gedson", club: "Beşiktaş", position: "MID", price: 7.2, points: 56, matches: 5, selected: 36 },
  { id: "8", name: "Fred", club: "Fenerbahçe", position: "MID", price: 7.8, points: 55, matches: 5, selected: 35 },
  { id: "9", name: "Davinson Sánchez", club: "Galatasaray", position: "DEF", price: 7.1, points: 52, matches: 5, selected: 34 },
  { id: "10", name: "Svensson", club: "Beşiktaş", position: "DEF", price: 5.9, points: 49, matches: 5, selected: 29 },
  { id: "11", name: "Mert Müldür", club: "Fenerbahçe", position: "DEF", price: 5.2, points: 46, matches: 5, selected: 26 },
  { id: "12", name: "Abdülkerim Bardakcı", club: "Galatasaray", position: "DEF", price: 6.5, points: 50, matches: 5, selected: 31 },
  { id: "13", name: "Uğurcan Çakır", club: "Galatasaray", position: "GK", price: 6.3, points: 48, matches: 5, selected: 33 },
  { id: "14", name: "Mert Günok", club: "Beşiktaş", position: "GK", price: 5.8, points: 45, matches: 5, selected: 28 },
  { id: "15", name: "İrfan Can", club: "Fenerbahçe", position: "GK", price: 5.2, points: 42, matches: 5, selected: 22 },
  { id: "16", name: "Semih", club: "Beşiktaş", position: "FWD", price: 6, points: 44, matches: 5, selected: 24 },
  { id: "17", name: "Muçi", club: "Beşiktaş", position: "MID", price: 6.2, points: 43, matches: 5, selected: 23 },
  { id: "18", name: "Eren", club: "Trabzonspor", position: "DEF", price: 4.8, points: 41, matches: 5, selected: 19 },
  { id: "19", name: "Okay", club: "Trabzonspor", position: "MID", price: 5.4, points: 39, matches: 5, selected: 18 },
  { id: "20", name: "Onuachu", club: "Trabzonspor", position: "FWD", price: 8.1, points: 54, matches: 5, selected: 27 },
  { id: "21", name: "Muhammet", club: "Trabzonspor", position: "GK", price: 5, points: 36, matches: 5, selected: 14 },
  { id: "22", name: "Ali", club: "Konyaspor", position: "DEF", price: 4.2, points: 34, matches: 5, selected: 12 },
  { id: "23", name: "Burak", club: "Göztepe", position: "GK", price: 4, points: 33, matches: 5, selected: 11 },
  { id: "24", name: "Yusuf", club: "Samsunspor", position: "DEF", price: 4.1, points: 35, matches: 5, selected: 13 },
  { id: "25", name: "Kerem", club: "İstanbul Başakşehir FK", position: "MID", price: 4.3, points: 37, matches: 5, selected: 15 },
  { id: "26", name: "Deniz", club: "Kasımpaşa", position: "FWD", price: 4.5, points: 38, matches: 5, selected: 16 },
];

const initialLineup: (string | null)[] = ["1", "2", "3", "4", "6", "8", "9", "10", "18", "22", "21"];
const initialBench: (string | null)[] = ["23", "24", "25", "26"];
const toFantasyPlayer = (player: StorePlayer): FantasyPlayer => player;

function positionName(position: PlayerPosition) {
  return position === "FWD" ? "Forvet" : position === "MID" ? "Orta saha" : position === "DEF" ? "Defans" : "Kaleci";
}

export default function TeamBuilderPage() {
  const {
    formation,
    players: playerMap,
    startingSlots,
    benchSlots,
    toast,
    hydrateTeam,
    setFormation,
    setToast,
    swapStartingAndBench,
    swapFieldPositions,
    swapBenchPlayers,
    movePlayerToEmptySlot,
    addPlayerFromTransfer,
    removePlayer,
  } = useTeamStore();

  const [captain, setCaptain] = useState<string | null>("1");
  const [draggingPlayer, setDraggingPlayer] = useState<FantasyPlayer | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<FantasyPlayer | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { formation?: Formation; startingIds?: (string | null)[]; benchIds?: (string | null)[]; captain?: string | null };
        hydrateTeam(players, saved.formation ?? "4-3-3", saved.startingIds ?? initialLineup, saved.benchIds ?? initialBench);
        setCaptain(saved.captain ?? "1");
      } else {
        hydrateTeam(players, "4-3-3", initialLineup, initialBench);
      }
    } finally {
      setHydrated(true);
    }
  }, [hydrateTeam]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      formation,
      startingIds: startingSlots.map((slot) => slot.playerId),
      benchIds: benchSlots.map((slot) => slot.playerId),
      captain,
    }));
  }, [benchSlots, captain, formation, hydrated, startingSlots]);

  const selectedIds = [...startingSlots, ...benchSlots].map((slot) => slot.playerId).filter((id): id is string => Boolean(id));
  const selectedPlayers = selectedIds.map((id) => playerMap[id]).filter(Boolean);
  const spent = selectedPlayers.reduce((total, player) => total + player.price, 0);
  const remaining = BUDGET - spent;
  const invalidStartingSlots = startingSlots.filter((slot) => slot.playerId && playerMap[slot.playerId]?.position !== slot.position);
  const hasInvalidPositions = invalidStartingSlots.length > 0;

  const pitchSlots: PitchSlot[] = useMemo(() => startingSlots.map((slot, index) => ({
    id: slot.id,
    index,
    position: slot.position,
    player: slot.playerId ? toFantasyPlayer(playerMap[slot.playerId]) : null,
    invalidPosition: Boolean(slot.playerId && playerMap[slot.playerId]?.position !== slot.position),
  })), [playerMap, startingSlots]);

  const pitchBenchSlots: BenchPitchSlot[] = useMemo(() => benchSlots.map((slot) => ({
    id: slot.id,
    kind: slot.kind,
    player: slot.playerId ? toFantasyPlayer(playerMap[slot.playerId]) : null,
  })), [benchSlots, playerMap]);

  function clubCount(club: string) {
    return selectedPlayers.filter((player) => player.club === club).length;
  }

  function canAddTransfer(player: StorePlayer) {
    if (selectedIds.includes(player.id)) return false;
    if (clubCount(player.club) >= 3) {
      setToast(`${player.club} için 3 oyuncu sınırına ulaştın.`);
      return false;
    }
    if (remaining < player.price) {
      setToast("Bu oyuncu için kalan bütçe yeterli değil.");
      return false;
    }
    return true;
  }

  function quickAdd(player: FantasyPlayer) {
    const id = String(player.id);
    if (selectedIds.includes(id)) {
      removePlayer(id);
      if (captain === id) setCaptain(null);
      return;
    }
    const storePlayer = playerMap[id] ?? players.find((item) => item.id === id);
    if (!storePlayer || !canAddTransfer(storePlayer)) return;
    const emptyStarting = startingSlots.find((slot) => slot.position === storePlayer.position && !slot.playerId);
    if (emptyStarting) return void addPlayerFromTransfer(storePlayer, emptyStarting.id);
    const emptyBench = benchSlots.find((slot) => !slot.playerId && (slot.kind === "GK" ? storePlayer.position === "GK" : storePlayer.position !== "GK"));
    if (emptyBench) return void addPlayerFromTransfer(storePlayer, emptyBench.id);
    setToast(`${positionName(storePlayer.position)} için uygun boş slot yok. Sürükle-bırak ile değişim yapabilirsin.`);
  }

  function autoComplete() {
    const used = new Set(selectedIds);
    const counts = new Map<string, number>();
    selectedPlayers.forEach((player) => counts.set(player.club, (counts.get(player.club) ?? 0) + 1));
    let runningSpend = spent;
    let added = 0;

    const pick = (predicate: (player: StorePlayer) => boolean) => players
      .filter((player) => !used.has(player.id) && predicate(player) && (counts.get(player.club) ?? 0) < 3 && runningSpend + player.price <= BUDGET)
      .sort((a, b) => a.price - b.price || b.points - a.points)[0];

    startingSlots.filter((slot) => !slot.playerId).forEach((slot) => {
      const candidate = pick((player) => player.position === slot.position);
      if (!candidate) return;
      if (addPlayerFromTransfer(candidate, slot.id)) {
        used.add(candidate.id); counts.set(candidate.club, (counts.get(candidate.club) ?? 0) + 1); runningSpend += candidate.price; added += 1;
      }
    });

    benchSlots.filter((slot) => !slot.playerId).forEach((slot) => {
      const candidate = pick((player) => slot.kind === "GK" ? player.position === "GK" : player.position !== "GK");
      if (!candidate) return;
      if (addPlayerFromTransfer(candidate, slot.id)) {
        used.add(candidate.id); counts.set(candidate.club, (counts.get(candidate.club) ?? 0) + 1); runningSpend += candidate.price; added += 1;
      }
    });

    setToast(added ? `Kadro otomatik tamamlandı: ${added} oyuncu eklendi.` : "Uygun bütçe ve kulüp sınırlarıyla eklenebilecek boş oyuncu bulunamadı.");
  }

  function findPlayerByDragId(draggableId: string) {
    const id = draggableId.replace(/^transfer:/, "").replace(/^player:/, "");
    return playerMap[id] ?? players.find((player) => player.id === id) ?? null;
  }

  function onDragStart(start: DragStart) {
    const player = findPlayerByDragId(start.draggableId);
    setDraggingPlayer(player ? toFantasyPlayer(player) : null);
  }

  function onDragEnd(result: DropResult) {
    setDraggingPlayer(null);
    const destination = result.destination;
    if (!destination || destination.droppableId === result.source.droppableId) return;

    const player = findPlayerByDragId(result.draggableId);
    if (!player) return;
    const sourceId = result.source.droppableId;
    const targetId = destination.droppableId;

    if (sourceId === "transfer") {
      if (!canAddTransfer(player)) return;
      const occupied = startingSlots.find((slot) => slot.id === targetId)?.playerId || benchSlots.find((slot) => slot.id === targetId)?.playerId;
      if (occupied) return void setToast("Transfer listesinden oyuncu yalnızca boş bir slota bırakılabilir.");
      addPlayerFromTransfer(player, targetId);
      return;
    }

    const sourceStarting = startingSlots.find((slot) => slot.id === sourceId);
    const sourceBench = benchSlots.find((slot) => slot.id === sourceId);
    const targetStarting = startingSlots.find((slot) => slot.id === targetId);
    const targetBench = benchSlots.find((slot) => slot.id === targetId);

    const targetPlayerId = targetStarting?.playerId ?? targetBench?.playerId ?? null;
    if (!targetPlayerId) {
      movePlayerToEmptySlot(player.id, sourceId, targetId);
      return;
    }

    if (sourceStarting && targetStarting && sourceStarting.playerId && targetStarting.playerId) {
      swapFieldPositions(sourceStarting.playerId, targetStarting.playerId);
      return;
    }
    if (sourceStarting && targetBench && sourceStarting.playerId && targetBench.playerId) {
      swapStartingAndBench(sourceStarting.playerId, targetBench.playerId);
      return;
    }
    if (sourceBench && targetStarting && sourceBench.playerId && targetStarting.playerId) {
      swapStartingAndBench(targetStarting.playerId, sourceBench.playerId);
      return;
    }
    if (sourceBench && targetBench && sourceBench.playerId && targetBench.playerId) {
      swapBenchPlayers(sourceBench.playerId, targetBench.playerId);
      return;
    }
    setToast("Bu sürükle-bırak işlemi desteklenmiyor.");
  }

  function save() {
    const emptyStarting = startingSlots.filter((slot) => !slot.playerId).length;
    const emptyBench = benchSlots.filter((slot) => !slot.playerId).length;
    if (hasInvalidPositions) return void setToast(`Kadro kaydedilemez: ${invalidStartingSlots.length} oyuncu kendi mevkisi dışında. Kırmızı kartları düzelt.`);
    if (emptyStarting || emptyBench) return void setToast(`Kadroyu tamamla: ${emptyStarting} ilk 11, ${emptyBench} yedek pozisyonu boş.`);
    if (!captain) return void setToast("Kadroyu kaydetmeden önce bir kaptan seçmelisin.");
    setToast("Kadro bu cihazın tarayıcısına kaydedildi.");
  }

  const fantasyPlayers = players.map(toFantasyPlayer);

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_50%_-10%,rgba(0,230,160,.10),transparent_26%),linear-gradient(180deg,#041019,#02090f_74%)] pb-20 pt-2 text-white sm:pt-3">
        <section className="mx-auto mb-2 flex w-[calc(100%-24px)] max-w-[1540px] items-center justify-between gap-2 rounded-xl border border-white/8 bg-[#07151c]/88 px-2.5 py-2 backdrop-blur-xl sm:w-[calc(100%-40px)]">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[8px] font-bold text-white/45 sm:text-[9px]">
            <span>Bütçe <b className="text-white">100 M₺</b></span>
            <span>Kalan <b className="text-emerald-300">{remaining.toFixed(1)} M₺</b></span>
            <span>İlk 11 <b className="text-white">{startingSlots.filter((slot) => slot.playerId).length}/11</b></span>
            <span>Kadro <b className="text-white">{selectedIds.length}/15</b></span>
            {hasInvalidPositions ? <span className="rounded-full bg-rose-500/15 px-2 py-0.5 font-black text-rose-300">{invalidStartingSlots.length} MEVKİ HATASI</span> : null}
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button type="button" onClick={autoComplete} className="rounded-lg border border-white/10 bg-white/[.055] px-3 py-2 text-[8px] font-black text-white/75 transition hover:bg-white/10">Kadroyu Otomatik Tamamla</button>
            <button type="button" onClick={save} className={["rounded-lg border px-3 py-2 text-[8px] font-black transition", hasInvalidPositions ? "border-rose-300/25 bg-rose-500/15 text-rose-200 hover:bg-rose-500/20" : "border-emerald-200/20 bg-emerald-300 text-emerald-950 shadow-[0_0_18px_rgba(52,211,153,.16)] hover:bg-emerald-200"].join(" ")}>{hasInvalidPositions ? "Önce Mevkileri Düzelt" : "Kadroyu Kaydet"}</button>
          </div>
        </section>

        <section className="mx-auto grid w-[calc(100%-24px)] max-w-[1540px] grid-cols-[minmax(0,1.45fr)_minmax(360px,.72fr)] items-start gap-3 max-[980px]:grid-cols-1 sm:w-[calc(100%-40px)]">
          <div className="min-w-0">
            <FootballPitch formationLabel={formation} formations={FORMATIONS} slots={pitchSlots} benchSlots={pitchBenchSlots} captainId={captain} draggingPlayer={draggingPlayer} onFormationChange={(value) => setFormation(value as Formation)} onPlayerClick={setSelectedPlayer} onBenchPlayerClick={setSelectedPlayer} />
            <div className={["mx-auto mt-2 max-w-[860px] rounded-xl border px-3 py-2 text-[8.5px] font-bold backdrop-blur-xl", hasInvalidPositions ? "border-rose-400/25 bg-rose-950/20 text-rose-200" : "border-white/8 bg-[#07151c]/90 text-white/48"].join(" ")}>{toast ?? (hasInvalidPositions ? "Kırmızı oyuncuları düzeltmeden kadro kaydedilemez." : "Kartları sürükleyerek saha ve yedekler arasında yönetebilirsin.")}</div>
          </div>
          <TransferPanel players={fantasyPlayers} clubs={SUPER_LIG_CLUBS_2026_27} selectedIds={selectedIds} onQuickAdd={quickAdd} onPlayerClick={setSelectedPlayer} />
        </section>

        {selectedPlayer ? (
          <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setSelectedPlayer(null)}>
            <div className="w-full max-w-[430px] rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,#0a2028,#061219)] p-4 shadow-[0_28px_90px_rgba(0,0,0,.65)]" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-start justify-between gap-3"><div><span className="text-[8px] font-black tracking-[.12em] text-emerald-300">OYUNCU BİLGİLERİ</span><h2 className="mt-1 text-2xl font-black tracking-[-.04em] text-white">{selectedPlayer.name}</h2><p className="mt-1 text-[10px] font-bold text-white/45">{selectedPlayer.club} · {positionName(selectedPlayer.position)}</p></div><button type="button" onClick={() => setSelectedPlayer(null)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-lg text-white/60">×</button></div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{[["Maç", String(selectedPlayer.matches ?? "—")], ["Puan", `${selectedPlayer.points} P`], ["Fiyat", `${selectedPlayer.price.toFixed(1)}M`], ["Seçilme", selectedPlayer.selected !== undefined ? `%${selectedPlayer.selected}` : "—"]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/8 bg-white/[.035] p-2.5"><small className="block text-[7px] font-black text-white/30">{label}</small><strong className="mt-1 block text-[13px] font-black text-white">{value}</strong></div>)}</div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => { setCaptain(String(selectedPlayer.id)); setToast(`${selectedPlayer.name} kaptan seçildi · x2`); setSelectedPlayer(null); }} className="rounded-xl border border-[#ffe889]/30 bg-[#d39b19]/15 px-3 py-3 text-[9px] font-black text-[#ffe889]">Kaptan Yap</button>
                <button type="button" onClick={() => { setToast(`${selectedPlayer.name} için değiştir modu: kartı uygun slota sürükle.`); setSelectedPlayer(null); }} className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-3 text-[9px] font-black text-emerald-200">Oyuncuyu Değiştir</button>
                <button type="button" onClick={() => { removePlayer(String(selectedPlayer.id)); if (captain === String(selectedPlayer.id)) setCaptain(null); setSelectedPlayer(null); }} className="col-span-2 rounded-xl border border-rose-300/20 bg-rose-400/10 px-3 py-3 text-[9px] font-black text-rose-200">Oyuncuyu Çıkar</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DragDropContext>
  );
}
