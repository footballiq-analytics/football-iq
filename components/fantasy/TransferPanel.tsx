"use client";

import { useDraggable } from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";
import type { FantasyCoach } from "@/data/superlig-coaches-2026";
import type { FantasyPlayer, PlayerPosition } from "./PlayerCard";

export type TransferPanelProps = {
  players: FantasyPlayer[];
  coaches: FantasyCoach[];
  clubs: readonly string[];
  selectedIds: (string | number)[];
  selectedCoachId?: string | null;
  onQuickAdd: (player: FantasyPlayer) => void;
  onSelectCoach: (coach: FantasyCoach) => void;
  onPlayerClick?: (player: FantasyPlayer) => void;
};

type FilterTab = "ALL" | PlayerPosition | "COACH";
type SortMode = "POINTS" | "PRICE_ASC" | "PRICE_DESC" | "POPULAR";
type TransferAssessment = { eligible: boolean; reason: string | null };

const tabLabel: Record<FilterTab, string> = {
  ALL: "TÜMÜ",
  GK: "KL",
  DEF: "DEF",
  MID: "ORT",
  FWD: "FOR",
  COACH: "TD",
};

const positions: PlayerPosition[] = ["GK", "DEF", "MID", "FWD"];
const BUDGET = 100;

export default function TransferPanel({
  players,
  coaches,
  clubs,
  selectedIds,
  selectedCoachId,
  onQuickAdd,
  onSelectCoach,
  onPlayerClick,
}: TransferPanelProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [club, setClub] = useState("ALL");
  const [position, setPosition] = useState<FilterTab>("ALL");
  const [sort, setSort] = useState<SortMode>("POINTS");
  const [smartOnly, setSmartOnly] = useState(false);
  const showingCoaches = position === "COACH";

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(id);
  }, [query]);

  const selectedSet = useMemo(() => new Set(selectedIds.map(String)), [selectedIds]);
  const selectedPlayers = useMemo(
    () => players.filter((p) => selectedSet.has(String(p.id))),
    [players, selectedSet],
  );
  const spent = useMemo(() => selectedPlayers.reduce((sum, p) => sum + p.price, 0), [selectedPlayers]);
  const remainingBudget = Math.max(0, BUDGET - spent);
  const selectedClubCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of selectedPlayers) counts.set(p.club, (counts.get(p.club) ?? 0) + 1);
    return counts;
  }, [selectedPlayers]);

  const clubCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of players) counts.set(p.club, (counts.get(p.club) ?? 0) + 1);
    return counts;
  }, [players]);

  const scopePlayers = useMemo(
    () => (club === "ALL" ? players : players.filter((p) => p.club === club)),
    [club, players],
  );

  const positionCounts = useMemo(() => {
    const counts: Record<PlayerPosition, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    for (const p of scopePlayers) counts[p.position]++;
    return counts;
  }, [scopePlayers]);

  const transferAssessments = useMemo(() => {
    const assessments = new Map<string, TransferAssessment>();
    const hasFreeSquadPlace = selectedIds.length < 15;

    for (const candidate of players) {
      const candidateId = String(candidate.id);
      if (selectedSet.has(candidateId)) {
        assessments.set(candidateId, { eligible: false, reason: "KADRODA" });
        continue;
      }

      const candidateClubCount = selectedClubCounts.get(candidate.club) ?? 0;
      const samePositionSelected = selectedPlayers.filter(
        (selected) => selected.position === candidate.position,
      );
      const directClubOk = candidateClubCount < 3;
      const directBudgetOk = candidate.price <= remainingBudget + 0.0001;
      const directAdd = hasFreeSquadPlace && directClubOk && directBudgetOk;

      const validReplacement = samePositionSelected.some((replaced) => {
        const effectiveBudget = remainingBudget + replaced.price;
        const clubLimitOk = candidateClubCount < 3 || replaced.club === candidate.club;
        return clubLimitOk && candidate.price <= effectiveBudget + 0.0001;
      });

      if (directAdd || validReplacement) {
        assessments.set(candidateId, { eligible: true, reason: null });
        continue;
      }

      const canFixClubLimitByReplacement = samePositionSelected.some(
        (replaced) => replaced.club === candidate.club,
      );
      const clubBlocked = candidateClubCount >= 3 && !canFixClubLimitByReplacement;
      const bestReplacementBudget = samePositionSelected.reduce(
        (best, replaced) => Math.max(best, remainingBudget + replaced.price),
        remainingBudget,
      );
      const budgetBlocked = candidate.price > bestReplacementBudget + 0.0001;
      const positionBlocked = !hasFreeSquadPlace && samePositionSelected.length === 0;

      assessments.set(candidateId, {
        eligible: false,
        reason: clubBlocked
          ? "3 OYUNCU SINIRI"
          : budgetBlocked
            ? "BÜTÇE YETERSİZ"
            : positionBlocked
              ? "UYGUN MEVKİ/DEĞİŞİM YOK"
              : !hasFreeSquadPlace
                ? "UYGUN DEĞİŞİM YOK"
                : "UYGUN TRANSFER DEĞİL",
      });
    }

    return assessments;
  }, [players, remainingBudget, selectedClubCounts, selectedIds.length, selectedPlayers, selectedSet]);

  const filteredPlayers = useMemo(() => {
    if (showingCoaches) return [];
    const normalizedQuery = debouncedQuery.toLocaleLowerCase("tr");
    const list = players.filter(
      (p) =>
        `${p.name} ${p.club}`.toLocaleLowerCase("tr").includes(normalizedQuery) &&
        (club === "ALL" || p.club === club) &&
        (position === "ALL" || p.position === position) &&
        (!smartOnly || transferAssessments.get(String(p.id))?.eligible),
    );

    return [...list].sort((a, b) =>
      sort === "PRICE_ASC"
        ? a.price - b.price
        : sort === "PRICE_DESC"
          ? b.price - a.price
          : sort === "POPULAR"
            ? (b.selected ?? 0) - (a.selected ?? 0)
            : b.points - a.points,
    );
  }, [club, debouncedQuery, players, position, showingCoaches, smartOnly, sort, transferAssessments]);

  const filteredCoaches = useMemo(() => {
    if (!showingCoaches) return [];
    const normalizedQuery = debouncedQuery.toLocaleLowerCase("tr");
    return coaches.filter(
      (c) =>
        `${c.name} ${c.club} ${c.country}`.toLocaleLowerCase("tr").includes(normalizedQuery) &&
        (club === "ALL" || c.club === club),
    );
  }, [club, coaches, debouncedQuery, showingCoaches]);

  const resultCount = showingCoaches ? filteredCoaches.length : filteredPlayers.length;
  const totalScopePlayers = scopePlayers.length;
  const hasActiveFilters = club !== "ALL" || position !== "ALL" || query.trim().length > 0 || smartOnly;

  const clearFilters = () => {
    setClub("ALL");
    setPosition("ALL");
    setQuery("");
    setDebouncedQuery("");
    setSmartOnly(false);
  };

  const activeFilterLabels = [
    club !== "ALL" ? club : null,
    position !== "ALL" ? tabLabel[position] : null,
    query.trim() ? `“${query.trim()}”` : null,
    smartOnly ? "UYGUN" : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <aside className="sticky top-3 flex h-[calc(100dvh-24px)] min-h-0 min-w-0 flex-col overflow-hidden rounded-[26px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(5,17,28,.985),rgba(2,10,17,.995))] shadow-[0_28px_80px_rgba(0,0,0,.55)] backdrop-blur-2xl max-[980px]:static max-[980px]:h-[68dvh] max-[980px]:min-h-[460px]">
      <div className="relative shrink-0 border-b border-white/[.06] p-3">
        <div className="mb-2 flex items-end justify-between gap-2">
          <div>
            <span className="text-[7px] font-black tracking-[.18em] text-[#f3ca40]">
              {showingCoaches ? "TEKNİK DİREKTÖR HAVUZU" : "TRANSFER HAVUZU"}
            </span>
            <p className="text-[8px] font-bold text-white/35">
              {resultCount} {showingCoaches ? "teknik direktör" : "oyuncu"} listeleniyor
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {!showingCoaches ? (
              <div className="rounded-lg border border-emerald-300/30 bg-black px-2 py-1 text-right">
                <small className="block text-[6px] font-black tracking-[.12em] text-white/35">KADRO</small>
                <b className={`text-[10px] font-black ${selectedIds.length === 15 ? "text-emerald-300" : "text-[#ffe778]"}`}>
                  {selectedIds.length}/15
                </b>
              </div>
            ) : null}
            {!showingCoaches ? (
              <div className="rounded-lg border border-[#f3ca40]/35 bg-black px-2 py-1 text-right">
                <small className="block text-[6px] font-black tracking-[.12em] text-white/35">HAVUZ</small>
                <b className="text-[10px] font-black text-[#ffe778]">{totalScopePlayers}</b>
              </div>
            ) : null}
          </div>
        </div>

        <select
          value={club}
          onChange={(e) => setClub(e.target.value)}
          className="h-12 w-full rounded-xl border border-[#f3ca40]/60 bg-[#050a0f] px-3 text-[13px] font-black text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.035),0_0_0_1px_rgba(243,202,64,.07)] focus:border-[#ffe778] focus:ring-2 focus:ring-[#f3ca40]/15"
        >
          <option className="bg-[#050a0f] text-white" value="ALL">Tüm takımlar ({players.length})</option>
          {clubs.map((item) => (
            <option className="bg-[#050a0f] text-white" key={item} value={item}>
              {item} ({clubCounts.get(item) ?? 0})
            </option>
          ))}
        </select>

        {!showingCoaches ? (
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {positions.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPosition(position === p ? "ALL" : p)}
                className={`rounded-lg border bg-black px-1 py-2 text-center transition-all ${position === p ? "border-[#ffe778] shadow-[0_0_12px_rgba(243,202,64,.18)]" : "border-[#f3ca40]/25"}`}
              >
                <span className="block text-[7px] font-black text-white/40">{tabLabel[p]}</span>
                <strong className="text-[12px] font-black text-[#ffe778]">{positionCounts[p]}</strong>
              </button>
            ))}
          </div>
        ) : null}

        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl font-black text-[#f3ca40]/85">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={showingCoaches ? "Teknik direktör ara..." : "Oyuncu ara..."}
            className="h-12 w-full rounded-xl border border-[#f3ca40]/60 bg-[#050a0f] pl-10 pr-10 text-[13px] font-black text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.035),0_0_0_1px_rgba(243,202,64,.07)] placeholder:font-black placeholder:text-white/55 focus:border-[#ffe778] focus:ring-2 focus:ring-[#f3ca40]/15"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-[#f3ca40]/45 bg-black text-xl font-black text-[#f3ca40]/85">×</button>
          ) : null}
        </div>

        {hasActiveFilters ? (
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="shrink-0 text-[7px] font-black tracking-[.12em] text-white/35">AKTİF</span>
            {activeFilterLabels.map((label) => (
              <span key={label} className="max-w-[140px] shrink-0 truncate rounded-full border border-[#f3ca40]/30 bg-[#f3ca40]/[.06] px-2 py-1 text-[8px] font-black text-[#f7e7a2]">{label}</span>
            ))}
            <button type="button" onClick={clearFilters} className="ml-auto shrink-0 rounded-lg border border-[#f3ca40]/60 bg-black px-2.5 py-1.5 text-[8px] font-black text-[#ffe778]">FİLTRELERİ TEMİZLE</button>
          </div>
        ) : null}

        <div className="mt-3 grid grid-cols-6 gap-1.5 rounded-xl border border-[#f3ca40]/55 bg-[linear-gradient(180deg,rgba(243,202,64,.08),rgba(0,0,0,.16))] p-1.5 shadow-[0_0_0_1px_rgba(243,202,64,.08),0_8px_24px_rgba(0,0,0,.20)]">
          {(["ALL", "GK", "DEF", "MID", "FWD", "COACH"] as const).map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => { setPosition(item); setQuery(""); }}
              className={`h-10 rounded-lg border text-[9px] font-black transition-all ${position === item ? "border-[#ffe778] bg-[#090909] text-[#ffe778] shadow-[0_0_14px_rgba(243,202,64,.22)]" : "border-[#f3ca40]/35 bg-[#090909] text-[#f7e7a2] hover:border-[#ffe778]/70 hover:bg-[#f3ca40]/10"}`}
            >
              {tabLabel[item]}
            </button>
          ))}
        </div>

        {!showingCoaches ? (
          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_94px] gap-2">
            <button
              type="button"
              onClick={() => setSmartOnly((value) => !value)}
              className={`min-h-12 rounded-xl border border-[#f3ca40]/65 bg-black px-3 py-2 text-left font-black transition-all ${smartOnly ? "text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,.14)]" : "text-[#ffe778]"}`}
            >
              <span className="block text-[10px]">UYGUN TRANSFERLER {smartOnly ? "✓" : ""}</span>
              <small className="mt-0.5 block text-[7px] font-bold text-white/40">Bütçe · 3 oyuncu sınırı · aynı mevki değişimi</small>
            </button>
            <div className="grid min-h-12 place-items-center rounded-xl border border-[#f3ca40]/35 bg-black px-2 text-center">
              <span>
                <small className="block text-[6px] font-black tracking-[.12em] text-white/35">KALAN</small>
                <b className="text-[11px] font-black text-[#ffe778]">{remainingBudget.toFixed(1)}M</b>
              </span>
            </div>
          </div>
        ) : null}

        {!showingCoaches ? (
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="mt-2 h-12 w-full rounded-xl border border-[#f3ca40]/60 bg-[#050a0f] px-3 text-[13px] font-black tracking-[.015em] text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.035),0_0_0_1px_rgba(243,202,64,.07)] focus:border-[#ffe778] focus:ring-2 focus:ring-[#f3ca40]/15"
          >
            <option className="bg-[#050a0f] text-white" value="POINTS">Fantasy puanına göre</option>
            <option className="bg-[#050a0f] text-white" value="PRICE_ASC">Fiyat · artan</option>
            <option className="bg-[#050a0f] text-white" value="PRICE_DESC">Fiyat · azalan</option>
            <option className="bg-[#050a0f] text-white" value="POPULAR">Popülerliğe göre</option>
          </select>
        ) : null}
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-8 pt-1.5 touch-pan-y [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable]">
        {showingCoaches
          ? filteredCoaches.map((coach) => (
              <CoachRow key={coach.id} coach={coach} selected={coach.id === selectedCoachId} onSelectCoach={onSelectCoach} />
            ))
          : filteredPlayers.map((player) => (
              <TransferDraggable
                key={String(player.id)}
                player={player}
                selected={selectedSet.has(String(player.id))}
                assessment={transferAssessments.get(String(player.id)) ?? { eligible: false, reason: "UYGUN TRANSFER DEĞİL" }}
                onQuickAdd={onQuickAdd}
                onPlayerClick={onPlayerClick}
              />
            ))}
        {!resultCount ? (
          <div className="grid min-h-36 place-items-center px-4 text-center text-[10px] text-white/30">
            {smartOnly ? "Kadro kurallarına uyan transfer bulunamadı." : "Bu filtrelerle eşleşen kayıt bulunamadı."}
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function CoachRow({ coach, selected, onSelectCoach }: { coach: FantasyCoach; selected: boolean; onSelectCoach: (coach: FantasyCoach) => void }) {
  return (
    <div className="mb-1.5 grid grid-cols-[1fr_48px] items-center gap-2 rounded-xl border border-white/[.06] bg-[#101b29] px-2.5 py-2.5">
      <div>
        <strong className="block truncate text-[12px] font-black">{coach.name}</strong>
        <small className="text-[7px] text-white/42">{coach.club}</small>
      </div>
      <button type="button" onClick={() => onSelectCoach(coach)} className="h-9 w-9 rounded-full border border-[#f3ca40]/60 bg-black text-[#ffe778]">{selected ? "✓" : "+"}</button>
    </div>
  );
}

function TransferDraggable({ player, selected, assessment, onQuickAdd, onPlayerClick }: { player: FantasyPlayer; selected: boolean; assessment: TransferAssessment; onQuickAdd: (player: FantasyPlayer) => void; onPlayerClick?: (player: FantasyPlayer) => void }) {
  const draggable = useDraggable({
    id: `transfer:${player.id}`,
    disabled: selected,
    data: { sourceSlotId: "transfer", playerId: String(player.id), sourceType: "transfer" },
  });

  return (
    <div
      ref={draggable.setNodeRef}
      data-fiq-dnd="true"
      className={`mb-1.5 select-none rounded-xl border px-2.5 py-2.5 transition-all ${draggable.isDragging ? "border-cyan-300/60 bg-cyan-400/10 opacity-35 shadow-[0_0_24px_rgba(34,211,238,.22)]" : selected ? "border-emerald-300/45 bg-emerald-300/[.07] shadow-[inset_3px_0_0_rgba(110,231,183,.7)]" : assessment.eligible ? "border-emerald-300/20 bg-[#0b1e2a] hover:border-emerald-300/35" : "border-white/[.06] bg-[#0b1e2a] hover:border-[#f3ca40]/25"}`}
    >
      <div className="grid grid-cols-[42px_minmax(0,1fr)_58px_42px] items-center gap-2">
        <button
          ref={draggable.setActivatorNodeRef}
          type="button"
          disabled={selected}
          {...draggable.listeners}
          {...draggable.attributes}
          aria-label={`${player.name} oyuncusunu sürükle`}
          className={`grid h-11 w-10 place-items-center rounded-lg border text-[16px] ${selected ? "cursor-default border-emerald-300/20 bg-black text-emerald-300/40" : "cursor-grab touch-none border-[#f3ca40]/45 bg-black text-[#ffe778] active:cursor-grabbing active:border-[#ffe778]"}`}
        >
          {selected ? "✓" : "⋮⋮"}
        </button>
        <button type="button" onClick={() => onPlayerClick?.(player)} className="min-w-0 text-left">
          <div className="flex min-w-0 items-center gap-1.5">
            <strong className="block min-w-0 truncate text-[13px] font-black leading-tight tracking-[-.01em] text-white">{player.name}</strong>
            {selected ? (
              <span className="shrink-0 rounded-full border border-emerald-300/35 bg-emerald-300/10 px-1.5 py-0.5 text-[6px] font-black tracking-[.08em] text-emerald-200">KADRODA</span>
            ) : assessment.eligible ? (
              <span className="shrink-0 rounded-full border border-emerald-300/30 bg-emerald-300/[.08] px-1.5 py-0.5 text-[6px] font-black tracking-[.06em] text-emerald-200">UYGUN</span>
            ) : null}
          </div>
          <small className="mt-0.5 block text-[8px] font-semibold text-white/45">{player.club} · {player.position}</small>
          {!selected && !assessment.eligible && assessment.reason ? (
            <span className="mt-1 inline-flex max-w-full truncate rounded-md border border-[#f3ca40]/30 bg-black px-1.5 py-0.5 text-[6px] font-black tracking-[.04em] text-[#f7cf62]">{assessment.reason}</span>
          ) : null}
        </button>
        <span className="text-right">
          <b className="block text-[9px]">{player.price.toFixed(1)}M</b>
          <small className="text-[8px] text-[#ffe45f]">{player.points} P</small>
        </span>
        <button
          type="button"
          disabled={selected}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => { event.stopPropagation(); onQuickAdd(player); }}
          className="h-9 w-9 rounded-full border border-[#f3ca40]/60 bg-black text-xl text-[#ffe778] disabled:border-emerald-300/20 disabled:text-emerald-300/55"
        >
          {selected ? "✓" : "+"}
        </button>
      </div>
    </div>
  );
}
