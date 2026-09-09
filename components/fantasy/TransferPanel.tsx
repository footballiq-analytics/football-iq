"use client";

import { useDraggable } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import type { FantasyPlayer, PlayerPosition } from "./PlayerCard";

export type TransferPanelProps = {
  players: FantasyPlayer[];
  clubs: readonly string[];
  selectedIds: (string | number)[];
  onQuickAdd: (player: FantasyPlayer) => void;
  onPlayerClick?: (player: FantasyPlayer) => void;
};

const tabLabel: Record<"ALL" | PlayerPosition, string> = { ALL: "TÜMÜ", GK: "KL", DEF: "DEF", MID: "ORT", FWD: "FOR" };

export default function TransferPanel({ players, clubs, selectedIds, onQuickAdd, onPlayerClick }: TransferPanelProps) {
  const [query, setQuery] = useState("");
  const [club, setClub] = useState("ALL");
  const [position, setPosition] = useState<"ALL" | PlayerPosition>("ALL");

  const filtered = useMemo(() => {
    const needle = query.toLocaleLowerCase("tr");
    return players.filter((player) => `${player.name} ${player.club}`.toLocaleLowerCase("tr").includes(needle) && (club === "ALL" || player.club === club) && (position === "ALL" || player.position === position));
  }, [club, players, position, query]);

  return (
    <aside className="sticky top-3 flex max-h-[calc(100vh-24px)] min-h-[720px] min-w-0 flex-col overflow-hidden rounded-[26px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(5,17,28,.985),rgba(2,10,17,.995))] shadow-[0_28px_80px_rgba(0,0,0,.55),inset_0_1px_0_rgba(255,255,255,.035)] backdrop-blur-2xl max-[980px]:static max-[980px]:max-h-none max-[980px]:min-h-0">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_50%_0%,rgba(0,230,118,.09),transparent_70%)]" />
      <div className="relative border-b border-white/[.06] p-3">
        <div className="mb-2 flex items-end justify-between px-0.5"><div><span className="text-[7px] font-black tracking-[.18em] text-[#f3ca40]">TRANSFER HAVUZU</span><p className="mt-0.5 text-[8px] font-bold text-white/35">{filtered.length} oyuncu listeleniyor</p></div><span className="rounded-full border border-emerald-300/15 bg-emerald-300/[.06] px-2 py-1 text-[7px] font-black text-emerald-300">CANLI KADRO</span></div>
        <div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-white/60">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Oyuncu ara..." className="h-12 w-full rounded-xl border border-white/15 bg-[#07131f]/95 pl-10 pr-10 text-[12px] font-bold text-white outline-none placeholder:text-white/28 focus:border-cyan-300/45 focus:ring-2 focus:ring-cyan-300/10" />{query ? <button type="button" onClick={() => setQuery("")} aria-label="Aramayı temizle" className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-white/[.04] bg-white/[.02] text-xl font-light text-white/65">×</button> : null}</div>
        <div className="mt-3 grid grid-cols-5 gap-1.5 rounded-xl border border-white/[.05] bg-black/10 p-1">{(["ALL", "GK", "DEF", "MID", "FWD"] as const).map((item) => <button key={item} type="button" onClick={() => setPosition(item)} className={["h-10 rounded-lg border text-[10px] font-black tracking-[.04em] transition", position === item ? "border-[#f7d555] bg-[linear-gradient(180deg,#ffe779,#d7a41b)] text-[#211600]" : "border-white/[.08] bg-[#0a1724]/90 text-white/70"].join(" ")}>{tabLabel[item]}</button>)}</div>
        <select value={club} onChange={(event) => setClub(event.target.value)} className="mt-2 h-9 w-full rounded-lg border border-white/10 bg-[#07131f] px-3 text-[9px] font-bold text-white/60 outline-none"><option value="ALL">Tüm takımlar</option>{clubs.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      </div>

      <div className="relative flex-1 overflow-y-auto overscroll-contain px-2 pb-4 pt-1.5">
        {filtered.map((player) => <TransferDraggable key={String(player.id)} player={player} selected={selectedIds.includes(player.id)} onQuickAdd={onQuickAdd} onPlayerClick={onPlayerClick} />)}
        {!filtered.length ? <div className="grid min-h-36 place-items-center text-center text-[10px] font-bold text-white/30">Bu filtrelerle eşleşen oyuncu bulunamadı.</div> : null}
      </div>
    </aside>
  );
}

function TransferDraggable({ player, selected, onQuickAdd, onPlayerClick }: { player: FantasyPlayer; selected: boolean; onQuickAdd: (player: FantasyPlayer) => void; onPlayerClick?: (player: FantasyPlayer) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: `transfer:${player.id}`, disabled: selected, data: { sourceSlotId: "transfer", playerId: String(player.id), sourceType: "transfer" } });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px,0)`, zIndex: 9999, touchAction: "none" as const } : { touchAction: "none" as const };
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={["mb-1.5 rounded-xl border px-2.5 py-2.5", selected ? "cursor-not-allowed border-emerald-300/20 bg-emerald-300/[.05] opacity-55" : "cursor-grab border-white/[.06] bg-[linear-gradient(180deg,rgba(13,31,43,.94),rgba(8,22,32,.98))] hover:border-white/15 active:cursor-grabbing", isDragging ? "opacity-20" : ""].join(" ")}>
      <div className="grid grid-cols-[minmax(0,1fr)_58px_42px] items-center gap-2">
        <button type="button" onClick={() => onPlayerClick?.(player)} className="flex min-w-0 items-center gap-2.5 bg-transparent p-0 text-left"><div className="relative h-11 w-11 shrink-0 overflow-visible"><div className="absolute inset-0 rounded-full border border-white/15 bg-[radial-gradient(circle_at_50%_25%,#5d806f,#173d34_50%,#07191a_78%)]" />{player.photo ? <img src={player.photo} alt="" className="absolute bottom-0 left-1/2 h-12 w-11 max-w-none -translate-x-1/2 object-contain object-bottom" draggable={false} /> : <div className="absolute bottom-[-1px] left-1/2 h-10 w-8 -translate-x-1/2 rounded-t-full bg-[radial-gradient(circle_at_50%_20%,#c59270_0_22%,#8d6149_23%_37%,#12352c_38%)]" />}</div><span className="min-w-0"><strong className="block truncate text-[11px] font-black text-white">{player.name}</strong><small className="mt-0.5 block truncate text-[7px] font-bold text-white/40">{player.club} · {player.position}</small></span></button>
        <span className="text-right"><b className="block text-[9px] font-black text-white">{player.price.toFixed(1)}M</b><small className="text-[8px] font-black text-[#ffe45f]">{player.points} P</small></span>
        <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={() => onQuickAdd(player)} className={["grid h-9 w-9 place-items-center rounded-full border text-xl font-black leading-none transition", selected ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-300" : "border-emerald-300/70 bg-emerald-400/[.08] text-emerald-300"].join(" ")} aria-label={`${player.name} ${selected ? "kadroda" : "ekle"}`}>{selected ? "✓" : "+"}</button>
      </div>
    </div>
  );
}
