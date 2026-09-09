"use client";

import { useEffect, useMemo, useState } from "react";
import FootballPitch, { type PitchSlot } from "@/components/fantasy/FootballPitch";
import TransferPanel from "@/components/fantasy/TransferPanel";
import type { FantasyPlayer, PlayerPosition } from "@/components/fantasy/PlayerCard";
import { SUPER_LIG_CLUBS_2026_27, SUPER_LIG_DATA_META } from "@/data/superlig-2026";

type Formation = "4-3-3" | "4-4-2" | "3-4-3" | "3-5-2" | "5-3-2";

const BUDGET = 100;
const STORAGE_KEY = "futbol-iq-fantasy-squad-v5";
const FORMATIONS: Formation[] = ["4-3-3", "4-4-2", "3-4-3", "3-5-2", "5-3-2"];

const players: FantasyPlayer[] = [
  { id: 1, name: "Victor Osimhen", club: "Galatasaray", position: "FWD", price: 11.5, points: 78, matches: 5, selected: 64 },
  { id: 2, name: "Vlahović", club: "Beşiktaş", position: "FWD", price: 11, points: 71, matches: 5, selected: 52 },
  { id: 3, name: "En-Nesyri", club: "Fenerbahçe", position: "FWD", price: 9.2, points: 67, matches: 5, selected: 47 },
  { id: 4, name: "Rafa Silva", club: "Beşiktaş", position: "MID", price: 8.6, points: 63, matches: 5, selected: 43 },
  { id: 5, name: "Talisca", club: "Fenerbahçe", position: "MID", price: 9, points: 61, matches: 5, selected: 41 },
  { id: 6, name: "Torreira", club: "Galatasaray", position: "MID", price: 7.4, points: 58, matches: 5, selected: 38 },
  { id: 7, name: "Gedson", club: "Beşiktaş", position: "MID", price: 7.2, points: 56, matches: 5, selected: 36 },
  { id: 8, name: "Fred", club: "Fenerbahçe", position: "MID", price: 7.8, points: 55, matches: 5, selected: 35 },
  { id: 9, name: "Davinson Sánchez", club: "Galatasaray", position: "DEF", price: 7.1, points: 52, matches: 5, selected: 34 },
  { id: 10, name: "Svensson", club: "Beşiktaş", position: "DEF", price: 5.9, points: 49, matches: 5, selected: 29 },
  { id: 11, name: "Mert Müldür", club: "Fenerbahçe", position: "DEF", price: 5.2, points: 46, matches: 5, selected: 26 },
  { id: 12, name: "Abdülkerim Bardakcı", club: "Galatasaray", position: "DEF", price: 6.5, points: 50, matches: 5, selected: 31 },
  { id: 13, name: "Uğurcan Çakır", club: "Galatasaray", position: "GK", price: 6.3, points: 48, matches: 5, selected: 33 },
  { id: 14, name: "Mert Günok", club: "Beşiktaş", position: "GK", price: 5.8, points: 45, matches: 5, selected: 28 },
  { id: 15, name: "İrfan Can", club: "Fenerbahçe", position: "GK", price: 5.2, points: 42, matches: 5, selected: 22 },
  { id: 16, name: "Semih", club: "Beşiktaş", position: "FWD", price: 6, points: 44, matches: 5, selected: 24 },
  { id: 17, name: "Muçi", club: "Beşiktaş", position: "MID", price: 6.2, points: 43, matches: 5, selected: 23 },
  { id: 18, name: "Eren", club: "Trabzonspor", position: "DEF", price: 4.8, points: 41, matches: 5, selected: 19 },
  { id: 19, name: "Okay", club: "Trabzonspor", position: "MID", price: 5.4, points: 39, matches: 5, selected: 18 },
  { id: 20, name: "Onuachu", club: "Trabzonspor", position: "FWD", price: 8.1, points: 54, matches: 5, selected: 27 },
  { id: 21, name: "Muhammet", club: "Trabzonspor", position: "GK", price: 5, points: 36, matches: 5, selected: 14 },
  { id: 22, name: "Ali", club: "Konyaspor", position: "DEF", price: 4.2, points: 34, matches: 5, selected: 12 },
  { id: 23, name: "Burak", club: "Göztepe", position: "GK", price: 4, points: 33, matches: 5, selected: 11 },
  { id: 24, name: "Yusuf", club: "Samsunspor", position: "DEF", price: 4.1, points: 35, matches: 5, selected: 13 },
  { id: 25, name: "Kerem", club: "İstanbul Başakşehir FK", position: "MID", price: 4.3, points: 37, matches: 5, selected: 15 },
  { id: 26, name: "Deniz", club: "Kasımpaşa", position: "FWD", price: 4.5, points: 38, matches: 5, selected: 16 },
];

const formationSlots: Record<Formation, PlayerPosition[]> = {
  "4-3-3": ["FWD", "FWD", "FWD", "MID", "MID", "MID", "DEF", "DEF", "DEF", "DEF", "GK"],
  "4-4-2": ["FWD", "FWD", "MID", "MID", "MID", "MID", "DEF", "DEF", "DEF", "DEF", "GK"],
  "3-4-3": ["FWD", "FWD", "FWD", "MID", "MID", "MID", "MID", "DEF", "DEF", "DEF", "GK"],
  "3-5-2": ["FWD", "FWD", "MID", "MID", "MID", "MID", "MID", "DEF", "DEF", "DEF", "GK"],
  "5-3-2": ["FWD", "FWD", "MID", "MID", "MID", "DEF", "DEF", "DEF", "DEF", "DEF", "GK"],
};

const initialLineup: (number | null)[] = [1, 2, 3, 4, 6, 8, 9, 10, 18, 22, 21];
const initialBench: (number | null)[] = [23, 24, 25, 26];

function getPlayer(id: number) {
  return players.find((player) => player.id === id)!;
}

function positionName(position: PlayerPosition) {
  return position === "FWD" ? "Forvet" : position === "MID" ? "Orta saha" : position === "DEF" ? "Defans" : "Kaleci";
}

export default function TeamBuilderPage() {
  const [formation, setFormation] = useState<Formation>("4-3-3");
  const [lineup, setLineup] = useState<(number | null)[]>(initialLineup);
  const [bench, setBench] = useState<(number | null)[]>(initialBench);
  const [captain, setCaptain] = useState<number | null>(1);
  const [draggingPlayer, setDraggingPlayer] = useState<FantasyPlayer | null>(null);
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<FantasyPlayer | null>(null);
  const [message, setMessage] = useState("Oyuncuyu sağdaki listeden tutup sahadaki uygun mevkiye sürükle.");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setFormation(saved.formation ?? "4-3-3");
        setLineup(saved.lineup ?? initialLineup);
        setBench(saved.bench ?? initialBench);
        setCaptain(saved.captain ?? 1);
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify({ formation, lineup, bench, captain }));
  }, [bench, captain, formation, hydrated, lineup]);

  const slotPositions = formationSlots[formation];
  const selectedIds = [...lineup, ...bench].filter((id): id is number => id !== null);
  const selectedPlayers = selectedIds.map(getPlayer).filter(Boolean);
  const spent = selectedPlayers.reduce((total, player) => total + player.price, 0);
  const remaining = BUDGET - spent;

  const pitchSlots: PitchSlot[] = useMemo(
    () => slotPositions.map((position, index) => ({ index, position, player: lineup[index] ? getPlayer(lineup[index]!) : null })),
    [lineup, slotPositions],
  );
  const benchPlayers = bench.map((id) => (id ? getPlayer(id) : null));

  function clubCount(club: string) {
    return selectedPlayers.filter((player) => player.club === club).length;
  }

  function canAdd(player: FantasyPlayer) {
    if (selectedIds.includes(player.id)) return true;
    if (clubCount(player.club) >= 3) {
      setMessage(`${player.club} için 3 oyuncu sınırına ulaştın.`);
      return false;
    }
    if (remaining < player.price) {
      setMessage("Bu oyuncu için kalan bütçe yeterli değil.");
      return false;
    }
    return true;
  }

  function removePlayer(id: number) {
    setLineup((current) => current.map((value) => (value === id ? null : value)));
    setBench((current) => current.map((value) => (value === id ? null : value)));
    if (captain === id) setCaptain(null);
    if (selectedPlayer?.id === id) setSelectedPlayer(null);
    setMessage(`${getPlayer(id).name} kadrodan çıkarıldı.`);
  }

  function changeFormation(next: Formation) {
    const nextPositions = formationSlots[next];
    const currentPlayers = lineup.filter((id): id is number => id !== null).map(getPlayer);
    const rebuilt: (number | null)[] = nextPositions.map(() => null);
    currentPlayers.forEach((player) => {
      const index = nextPositions.findIndex((position, slotIndex) => position === player.position && rebuilt[slotIndex] === null);
      if (index >= 0) rebuilt[index] = player.id;
    });
    setFormation(next);
    setLineup(rebuilt);
    setMessage(`${next} dizilişi uygulandı. Her oyuncu kendi mevki hattında tutuldu.`);
  }

  function startDrag(event: React.DragEvent<HTMLElement>, player: FantasyPlayer, fromIndex: number | null = null) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(player.id));
    setDraggingPlayer(player);
    setDragSourceIndex(fromIndex);
  }

  function dropPlayer(slotIndex: number, player: FantasyPlayer) {
    const requiredPosition = slotPositions[slotIndex];
    if (player.position !== requiredPosition) {
      setMessage(`${player.name} ${positionName(player.position)} oyuncusu. ${positionName(requiredPosition)} hattına bırakılamaz.`);
      setDraggingPlayer(null);
      setDragSourceIndex(null);
      return;
    }
    if (!canAdd(player)) return;

    const targetId = lineup[slotIndex];
    if (targetId === player.id) {
      setDraggingPlayer(null);
      setDragSourceIndex(null);
      return;
    }

    if (dragSourceIndex !== null) {
      setLineup((current) => {
        const next = [...current];
        next[dragSourceIndex] = targetId ?? null;
        next[slotIndex] = player.id;
        return next;
      });
    } else {
      const targetBenchIndex = targetId ? bench.findIndex((value) => value === null) : -1;
      if (targetId && targetBenchIndex < 0) {
        setMessage("Bu pozisyon dolu ve yedek kulübesinde boş yer yok. Önce bir oyuncu çıkar.");
        setDraggingPlayer(null);
        return;
      }
      if (targetId && targetBenchIndex >= 0) {
        setBench((current) => current.map((value, index) => index === targetBenchIndex ? targetId : value === player.id ? null : value));
      } else {
        setBench((current) => current.map((value) => value === player.id ? null : value));
      }
      setLineup((current) => current.map((value, index) => index === slotIndex ? player.id : value === player.id ? null : value));
    }

    setMessage(`${player.name} ${positionName(requiredPosition)} hattına yerleştirildi.`);
    setDraggingPlayer(null);
    setDragSourceIndex(null);
  }

  function quickAdd(player: FantasyPlayer) {
    if (selectedIds.includes(player.id)) {
      removePlayer(player.id);
      return;
    }
    if (!canAdd(player)) return;
    const emptySlot = slotPositions.findIndex((position, index) => position === player.position && lineup[index] === null);
    if (emptySlot < 0) {
      setMessage(`${positionName(player.position)} hattında boş pozisyon yok. Kartı değiştirmek için sürükle-bırak kullan.`);
      return;
    }
    setLineup((current) => current.map((value, index) => index === emptySlot ? player.id : value));
    setMessage(`${player.name} ${positionName(player.position)} hattına eklendi.`);
  }

  function save() {
    const emptyStarting = lineup.filter((value) => value === null).length;
    const emptyBench = bench.filter((value) => value === null).length;
    if (emptyStarting || emptyBench) {
      setMessage(`Kadroyu tamamla: ${emptyStarting} ilk 11, ${emptyBench} yedek pozisyonu boş.`);
      return;
    }
    if (!captain) {
      setMessage("Kadroyu kaydetmeden önce bir kaptan seçmelisin.");
      return;
    }
    setMessage("Kadro bu cihazın tarayıcısına kaydedildi.");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_-10%,rgba(0,230,160,.10),transparent_26%),linear-gradient(180deg,#041019,#02090f_74%)] pb-24 text-white">
      <section className="mx-auto grid w-full max-w-[1540px] gap-4 px-3 pb-3 pt-5 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <span className="text-[9px] font-black tracking-[.18em] text-emerald-300">KADROM / SAHA İÇİ</span>
          <h1 className="mt-1 text-[clamp(30px,4vw,46px)] font-black tracking-[-.055em] text-white">Takımını Kur</h1>
          <p className="mt-1 max-w-[720px] text-[11px] text-white/45">Sahayı solda yönet, oyuncuları sağdan sürükle. Mevki kuralı zorunlu: kaleci kaleye, defans defansa, orta saha orta sahaya, forvet forvete.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["Toplam bütçe", "100 M₺"],
            ["Kalan bütçe", `${remaining.toFixed(1)} M₺`],
            ["İlk 11", `${lineup.filter(Boolean).length}/11`],
            ["Toplam", `${selectedIds.length}/15`],
          ].map(([label, value]) => (
            <div key={label} className="min-w-[112px] rounded-2xl border border-white/8 bg-white/[.035] px-3 py-2.5 backdrop-blur-xl">
              <small className="block text-[7px] font-black uppercase tracking-[.08em] text-white/30">{label}</small>
              <strong className="mt-0.5 block text-[15px] font-black text-white">{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mb-3 flex w-[calc(100%-24px)] max-w-[1540px] items-center justify-between gap-3 rounded-2xl border border-white/8 bg-[#07151c]/95 px-3 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,.2)] backdrop-blur-xl sm:w-[calc(100%-40px)]">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-black tracking-[.1em] text-white/35">DİZİLİŞ</span>
          <select value={formation} onChange={(event) => changeFormation(event.target.value as Formation)} className="h-9 rounded-xl border border-emerald-300/30 bg-[#08252b] px-3 text-[10px] font-black text-emerald-200 outline-none focus:border-emerald-300/70">
            {FORMATIONS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <span className="hidden text-[8px] font-bold text-white/30 sm:block">{SUPER_LIG_DATA_META.season} · {SUPER_LIG_DATA_META.clubCount} kulüp</span>
      </section>

      <section className="mx-auto grid w-[calc(100%-24px)] max-w-[1540px] grid-cols-[minmax(0,1.45fr)_minmax(360px,.72fr)] items-start gap-4 max-[980px]:grid-cols-1 sm:w-[calc(100%-40px)]">
        <div className="min-w-0">
          <FootballPitch
            formationLabel={formation}
            slots={pitchSlots}
            bench={benchPlayers}
            captainId={captain}
            draggingPlayer={draggingPlayer}
            onDropPlayer={dropPlayer}
            onPlayerClick={setSelectedPlayer}
            onBenchPlayerClick={setSelectedPlayer}
            onPlayerDragStart={(event, player, slotIndex) => startDrag(event, player, slotIndex)}
          />

          <div className="mx-auto mt-3 grid max-w-[860px] grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-2xl border border-white/8 bg-[#07151c]/90 p-2.5 backdrop-blur-xl max-[560px]:grid-cols-1">
            <div className="rounded-xl bg-black/15 px-3 py-2 text-[9px] font-bold text-white/48">{message}</div>
            <button type="button" onClick={save} className="rounded-xl border border-emerald-200/20 bg-emerald-300 px-5 py-2.5 text-[10px] font-black text-emerald-950 shadow-[0_0_22px_rgba(52,211,153,.18)] transition hover:bg-emerald-200">Kadroyu Kaydet</button>
          </div>
        </div>

        <TransferPanel
          players={players}
          clubs={SUPER_LIG_CLUBS_2026_27}
          selectedIds={selectedIds}
          onQuickAdd={quickAdd}
          onDragStart={(event, player) => startDrag(event, player)}
          onPlayerClick={setSelectedPlayer}
        />
      </section>

      {selectedPlayer ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setSelectedPlayer(null)}>
          <div className="w-full max-w-[430px] rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,#0a2028,#061219)] p-4 shadow-[0_28px_90px_rgba(0,0,0,.65)]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[8px] font-black tracking-[.12em] text-emerald-300">OYUNCU BİLGİLERİ</span>
                <h2 className="mt-1 text-2xl font-black tracking-[-.04em] text-white">{selectedPlayer.name}</h2>
                <p className="mt-1 text-[10px] font-bold text-white/45">{selectedPlayer.club} · {positionName(selectedPlayer.position)}</p>
              </div>
              <button type="button" onClick={() => setSelectedPlayer(null)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-lg text-white/60">×</button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["Maç", String(selectedPlayer.matches ?? "—")],
                ["Puan", `${selectedPlayer.points} P`],
                ["Fiyat", `${selectedPlayer.price.toFixed(1)}M`],
                ["Seçilme", selectedPlayer.selected !== undefined ? `%${selectedPlayer.selected}` : "—"],
              ].map(([label, value]) => <div key={label} className="rounded-xl border border-white/8 bg-white/[.035] p-2.5"><small className="block text-[7px] font-black text-white/30">{label}</small><strong className="mt-1 block text-[13px] font-black text-white">{value}</strong></div>)}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => { setCaptain(selectedPlayer.id); setMessage(`${selectedPlayer.name} kaptan seçildi · x2`); setSelectedPlayer(null); }} className="rounded-xl border border-[#ffe889]/30 bg-[#d39b19]/15 px-3 py-3 text-[9px] font-black text-[#ffe889]">Kaptan Yap</button>
              <button type="button" onClick={() => { setMessage(`${selectedPlayer.name} için değiştir modu: sağdan aynı mevkide bir oyuncuyu kartın üzerine sürükle.`); setSelectedPlayer(null); }} className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-3 text-[9px] font-black text-emerald-200">Oyuncuyu Değiştir</button>
              <button type="button" onClick={() => removePlayer(selectedPlayer.id)} className="col-span-2 rounded-xl border border-rose-300/20 bg-rose-400/10 px-3 py-3 text-[9px] font-black text-rose-200">Oyuncuyu Çıkar</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
