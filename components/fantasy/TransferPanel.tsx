"use client";

import { Draggable, Droppable, type DraggableProvided, type DraggableStateSnapshot } from "@hello-pangea/dnd";
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
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-[linear-gradient(180deg,transparent,rgba(45,232,255,.32),transparent)]" />

      <div className="relative border-b border-white/[.06] p-3">
        <div className="mb-2 flex items-end justify-between px-0.5"><div><span className="text-[7px] font-black tracking-[.18em] text-[#f3ca40]">TRANSFER HAVUZU</span><p className="mt-0.5 text-[8px] font-bold text-white/35">{filtered.length} oyuncu listeleniyor</p></div><span className="rounded-full border border-emerald-300/15 bg-emerald-300/[.06] px-2 py-1 text-[7px] font-black text-emerald-300">CANLI KADRO</span></div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-white/60">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Oyuncu ara..." className="h-12 w-full rounded-xl border border-white/15 bg-[#07131f]/95 pl-10 pr-10 text-[12px] font-bold text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.03),0_7px_18px_rgba(0,0,0,.18)] placeholder:text-white/28 focus:border-cyan-300/45 focus:ring-2 focus:ring-cyan-300/10" />
          {query ? <button type="button" onClick={() => setQuery("")} aria-label="Aramayı temizle" className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-white/[.04] bg-white/[.02] text-xl font-light text-white/65 transition hover:bg-white/[.08] hover:text-white">×</button> : null}
        </div>
        <div className="mt-3 grid grid-cols-5 gap-1.5 rounded-xl border border-white/[.05] bg-black/10 p-1">
          {(["ALL", "GK", "DEF", "MID", "FWD"] as const).map((item) => <button key={item} type="button" onClick={() => setPosition(item)} className={["h-10 rounded-lg border text-[10px] font-black tracking-[.04em] transition", position === item ? "border-[#f7d555] bg-[linear-gradient(180deg,#ffe779,#d7a41b)] text-[#211600] shadow-[0_0_20px_rgba(247,213,85,.24),inset_0_1px_0_rgba(255,255,255,.35)]" : "border-white/[.08] bg-[#0a1724]/90 text-white/70 hover:border-white/20 hover:bg-[#0d1d2c]"].join(" ")}>{tabLabel[item]}</button>)}
        </div>
        <select value={club} onChange={(event) => setClub(event.target.value)} className="mt-2 h-9 w-full rounded-lg border border-white/10 bg-[#07131f] px-3 text-[9px] font-bold text-white/60 outline-none focus:border-[#f3ca40]/40">
          <option value="ALL">Tüm takımlar</option>{clubs.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      <Droppable
        droppableId="transfer"
        isDropDisabled
        renderClone={(provided, snapshot, rubric) => {
          const player = filtered[rubric.source.index];
          if (!player) return <span />;
          return <TransferClone provided={provided} snapshot={snapshot}><TransferRow player={player} selected={false} onQuickAdd={onQuickAdd} onPlayerClick={onPlayerClick} clone /></TransferClone>;
        }}
      >
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="relative flex-1 overflow-y-auto overscroll-contain px-2 pb-4 pt-1.5">
            {filtered.map((player, index) => {
              const selected = selectedIds.includes(player.id);
              return (
                <Draggable key={String(player.id)} draggableId={`transfer:${player.id}`} index={index} isDragDisabled={selected}>
                  {(dragProvided, dragSnapshot) => (
                    <TransferFrame provided={dragProvided} snapshot={dragSnapshot} selected={selected}>
                      <TransferRow player={player} selected={selected} onQuickAdd={onQuickAdd} onPlayerClick={onPlayerClick} />
                    </TransferFrame>
                  )}
                </Draggable>
              );
            })}
            <div className="pointer-events-none absolute h-0 overflow-hidden opacity-0">{provided.placeholder}</div>
            {!filtered.length ? <div className="grid min-h-36 place-items-center text-center text-[10px] font-bold text-white/30">Bu filtrelerle eşleşen oyuncu bulunamadı.</div> : null}
          </div>
        )}
      </Droppable>
    </aside>
  );
}

function TransferRow({ player, selected, onQuickAdd, onPlayerClick, clone = false }: { player: FantasyPlayer; selected: boolean; onQuickAdd: (player: FantasyPlayer) => void; onPlayerClick?: (player: FantasyPlayer) => void; clone?: boolean }) {
  return <div className="grid grid-cols-[minmax(0,1fr)_58px_42px] items-center gap-2"><button type="button" onClick={() => !clone && onPlayerClick?.(player)} className="flex min-w-0 items-center gap-2.5 bg-transparent p-0 text-left"><div className="relative h-11 w-11 shrink-0 overflow-visible"><div className="absolute inset-0 rounded-full border border-white/15 bg-[radial-gradient(circle_at_50%_25%,#5d806f,#173d34_50%,#07191a_78%)] shadow-[0_5px_16px_rgba(0,0,0,.3)]" />{player.photo ? <img src={player.photo} alt="" className="absolute bottom-0 left-1/2 h-12 w-11 max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_5px_6px_rgba(0,0,0,.42)]" draggable={false} /> : <div className="absolute bottom-[-1px] left-1/2 h-10 w-8 -translate-x-1/2 rounded-t-full bg-[radial-gradient(circle_at_50%_20%,#c59270_0_22%,#8d6149_23%_37%,#12352c_38%)]" />}</div><span className="min-w-0"><strong className="block truncate text-[11px] font-black text-white">{player.name}</strong><small className="mt-0.5 block truncate text-[7px] font-bold text-white/40">{player.club} · {player.position}</small></span></button><span className="text-right"><b className="block text-[9px] font-black text-white">{player.price.toFixed(1)}M</b><small className="text-[8px] font-black text-[#ffe45f]">{player.points} P</small></span><button type="button" disabled={clone} onClick={() => onQuickAdd(player)} className={["grid h-9 w-9 place-items-center rounded-full border text-xl font-black leading-none transition", selected ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-300" : "border-emerald-300/70 bg-emerald-400/[.08] text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,.12)] hover:bg-emerald-400/15 hover:shadow-[0_0_22px_rgba(52,211,153,.24)]", clone ? "pointer-events-none" : ""].join(" ")} aria-label={`${player.name} ${selected ? "kadroda" : "ekle"}`}>{selected ? "✓" : "+"}</button></div>;
}

function TransferFrame({ provided, snapshot, selected, children }: { provided: DraggableProvided; snapshot: DraggableStateSnapshot; selected: boolean; children: React.ReactNode }) {
  return <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={provided.draggableProps.style} className={["mb-1.5 rounded-xl border px-2.5 py-2.5", selected ? "cursor-not-allowed border-emerald-300/20 bg-emerald-300/[.05] opacity-55" : "cursor-grab border-white/[.06] bg-[linear-gradient(180deg,rgba(13,31,43,.94),rgba(8,22,32,.98))] hover:border-white/15 active:cursor-grabbing", snapshot.isDragging ? "opacity-0" : "transition-[border-color,background-color,box-shadow] duration-150"].join(" ")}>{children}</div>;
}

function TransferClone({ provided, snapshot, children }: { provided: DraggableProvided; snapshot: DraggableStateSnapshot; children: React.ReactNode }) {
  return <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ ...provided.draggableProps.style, zIndex: 999999, pointerEvents: "none" }} className={["w-[360px] rounded-xl border border-[#f8d65c]/70 bg-[#0b1b25] px-2.5 py-2.5 opacity-95 shadow-[0_22px_50px_rgba(0,0,0,.68),0_0_30px_rgba(248,214,92,.20),0_0_30px_rgba(0,230,118,.12)]", snapshot.isDragging ? "will-change-transform" : ""].join(" ")}>{children}</div>;
}
