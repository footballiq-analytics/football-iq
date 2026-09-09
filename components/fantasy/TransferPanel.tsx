"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
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
    <aside className="sticky top-3 flex max-h-[calc(100vh-24px)] min-h-[720px] min-w-0 flex-col overflow-hidden rounded-[24px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(5,17,28,.985),rgba(2,10,17,.995))] shadow-[0_28px_80px_rgba(0,0,0,.55),inset_0_1px_0_rgba(255,255,255,.035)] max-[980px]:static max-[980px]:max-h-none max-[980px]:min-h-0">
      <div className="border-b border-white/[.06] p-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-white/60">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Oyuncu ara..." className="h-12 w-full rounded-xl border border-white/15 bg-[#07131f] pl-10 pr-10 text-[12px] font-bold text-white outline-none placeholder:text-white/28 focus:border-cyan-300/45 focus:ring-2 focus:ring-cyan-300/10" />
          {query ? <button type="button" onClick={() => setQuery("")} aria-label="Aramayı temizle" className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-xl font-light text-white/65 transition hover:bg-white/8 hover:text-white">×</button> : null}
        </div>
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {(["ALL", "GK", "DEF", "MID", "FWD"] as const).map((item) => <button key={item} type="button" onClick={() => setPosition(item)} className={["h-11 rounded-lg border text-[10px] font-black tracking-[.04em] transition", position === item ? "border-[#f7d555] bg-[linear-gradient(180deg,#f8d75d,#d9a61f)] text-[#211600] shadow-[0_0_18px_rgba(247,213,85,.22)]" : "border-white/10 bg-[#0a1724] text-white/70 hover:border-white/20 hover:bg-[#0d1d2c]"].join(" ")}>{tabLabel[item]}</button>)}
        </div>
        <select value={club} onChange={(event) => setClub(event.target.value)} className="mt-2 h-9 w-full rounded-lg border border-white/10 bg-[#07131f] px-3 text-[9px] font-bold text-white/60 outline-none">
          <option value="ALL">Tüm takımlar</option>{clubs.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      <Droppable droppableId="transfer" isDropDisabled>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-y-auto overscroll-contain px-2 pb-4 pt-1.5">
            {filtered.map((player, index) => {
              const selected = selectedIds.includes(player.id);
              return (
                <Draggable key={String(player.id)} draggableId={`transfer:${player.id}`} index={index} isDragDisabled={selected}>
                  {(dragProvided, dragSnapshot) => (
                    <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps} style={{ ...dragProvided.draggableProps.style, transition: dragSnapshot.isDragging ? "none" : "transform 150ms cubic-bezier(.2,.8,.2,1)", willChange: "transform" }} className={["mb-1.5 grid grid-cols-[minmax(0,1fr)_58px_42px] items-center gap-2 rounded-xl border px-2.5 py-2.5", selected ? "cursor-not-allowed border-emerald-300/20 bg-emerald-300/[.05] opacity-55" : "cursor-grab border-white/[.06] bg-[linear-gradient(180deg,rgba(13,31,43,.88),rgba(8,22,32,.96))] hover:border-white/15 active:cursor-grabbing", dragSnapshot.isDragging ? "z-[9999] scale-[1.025] border-[#f8d65c]/55 shadow-[0_18px_42px_rgba(0,0,0,.62),0_0_26px_rgba(248,214,92,.18)]" : ""].join(" ")}>
                      <button type="button" onClick={() => onPlayerClick?.(player)} className="flex min-w-0 items-center gap-2.5 bg-transparent p-0 text-left">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/15 bg-[radial-gradient(circle_at_50%_25%,#5d806f,#173d34_50%,#07191a_78%)]">
                          {player.photo ? <img src={player.photo} alt="" className="h-full w-full object-cover object-top" draggable={false} /> : <div className="absolute bottom-[-7px] left-1/2 h-10 w-8 -translate-x-1/2 rounded-t-full bg-[radial-gradient(circle_at_50%_20%,#c59270_0_22%,#8d6149_23%_37%,#12352c_38%)]" />}
                        </div>
                        <span className="min-w-0"><strong className="block truncate text-[11px] font-black text-white">{player.name}</strong><small className="mt-0.5 block truncate text-[7px] font-bold text-white/40">{player.club}</small></span>
                      </button>
                      <span className="text-right"><b className="block text-[9px] font-black text-white">{player.price.toFixed(1)}M</b><small className="text-[8px] font-black text-[#ffe45f]">{player.points} P</small></span>
                      <button type="button" onClick={() => onQuickAdd(player)} className={["grid h-9 w-9 place-items-center rounded-full border text-2xl font-light leading-none transition", selected ? "border-rose-300/25 bg-rose-400/10 text-rose-200" : "border-emerald-300/70 bg-emerald-400/[.08] text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,.12)] hover:bg-emerald-400/15"].join(" ")} aria-label={`${player.name} ${selected ? "çıkar" : "ekle"}`}>{selected ? "−" : "+"}</button>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </aside>
  );
}
