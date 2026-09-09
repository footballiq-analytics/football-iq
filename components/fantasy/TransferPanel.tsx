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

const positionLabel: Record<PlayerPosition, string> = { GK: "Kaleci", DEF: "Defans", MID: "Orta Saha", FWD: "Forvet" };

export default function TransferPanel({ players, clubs, selectedIds, onQuickAdd, onPlayerClick }: TransferPanelProps) {
  const [query, setQuery] = useState("");
  const [club, setClub] = useState("ALL");
  const [position, setPosition] = useState<"ALL" | PlayerPosition>("ALL");

  const filtered = useMemo(() => {
    const needle = query.toLocaleLowerCase("tr");
    return players.filter((player) => {
      const queryMatches = `${player.name} ${player.club}`.toLocaleLowerCase("tr").includes(needle);
      return queryMatches && (club === "ALL" || player.club === club) && (position === "ALL" || player.position === position);
    });
  }, [club, players, position, query]);

  return (
    <aside className="sticky top-[78px] flex max-h-[calc(100vh-92px)] min-h-[720px] min-w-0 flex-col overflow-hidden rounded-[24px] border border-emerald-200/10 bg-[linear-gradient(180deg,rgba(5,24,31,.98),rgba(2,13,19,.99))] shadow-[0_24px_70px_rgba(0,0,0,.38)] max-[980px]:static max-[980px]:max-h-none max-[980px]:min-h-0">
      <div className="grid gap-2 border-b border-white/8 p-3">
        <div className="relative">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Oyuncu ara..."
            className="h-10 w-full rounded-xl border border-white/10 bg-black/25 px-3 pr-10 text-[11px] font-bold text-white outline-none placeholder:text-white/25 focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/10"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Aramayı temizle"
              className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-white/5 text-sm font-black text-white/55 transition hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          ) : null}
        </div>
        <select value={club} onChange={(event) => setClub(event.target.value)} className="h-10 w-full rounded-xl border border-white/10 bg-[#071b22] px-3 text-[10px] font-bold text-white/80 outline-none focus:border-emerald-300/50">
          <option value="ALL">Tüm takımlar</option>{clubs.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <div className="grid grid-cols-5 gap-1 rounded-xl border border-white/8 bg-black/15 p-1">
          {(["ALL", "GK", "DEF", "MID", "FWD"] as const).map((item) => (
            <button key={item} type="button" onClick={() => setPosition(item)} className={["rounded-lg px-1 py-2 text-[8px] font-black transition", position === item ? "bg-emerald-300 text-emerald-950 shadow-[0_0_16px_rgba(52,211,153,.22)]" : "text-white/40 hover:bg-white/5 hover:text-white/75"].join(" ")}>{item === "ALL" ? "Tümü" : item}</button>
          ))}
        </div>
      </div>

      <Droppable droppableId="transfer" isDropDisabled>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-y-auto overscroll-contain px-2 pb-5 pt-1">
            {filtered.map((player, index) => {
              const selected = selectedIds.includes(player.id);
              return (
                <Draggable key={String(player.id)} draggableId={`transfer:${player.id}`} index={index} isDragDisabled={selected}>
                  {(dragProvided, dragSnapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      onDoubleClick={() => onPlayerClick?.(player)}
                      style={{
                        ...dragProvided.draggableProps.style,
                        transition: dragSnapshot.isDragging ? "none" : "transform 180ms cubic-bezier(.22,.8,.28,1)",
                        willChange: "transform",
                      }}
                      className={[
                        "group grid grid-cols-[minmax(0,1fr)_52px_44px_32px] items-center gap-2 rounded-xl border px-2 py-2",
                        selected ? "cursor-not-allowed border-emerald-300/25 bg-emerald-300/8 opacity-65" : "cursor-grab border-transparent hover:border-white/8 hover:bg-white/[.035] active:cursor-grabbing",
                        dragSnapshot.isDragging ? "z-50 scale-[1.035] border-[#f6d56a]/60 bg-[#0b2523] opacity-95 shadow-[0_22px_46px_rgba(0,0,0,.55),0_0_26px_rgba(246,213,106,.22),0_0_34px_rgba(52,211,153,.22)]" : "",
                      ].join(" ")}
                    >
                      <button type="button" onClick={() => onPlayerClick?.(player)} className="flex min-w-0 items-center gap-2 bg-transparent p-0 text-left">
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[radial-gradient(circle_at_50%_25%,#52776b,#173c34_48%,#07191a_78%)]">
                          {player.photo ? <img src={player.photo} alt="" className="h-full w-full object-cover object-top" draggable={false} /> : <div className="absolute bottom-[-7px] left-1/2 h-9 w-7 -translate-x-1/2 rounded-t-full bg-[radial-gradient(circle_at_50%_20%,#c59270_0_22%,#8d6149_23%_37%,#12352c_38%)]" />}
                        </div>
                        <span className="min-w-0"><strong className="block truncate text-[10px] font-black text-white">{player.name}</strong><small className="mt-0.5 block truncate text-[7px] font-bold text-white/35">{player.club} · {positionLabel[player.position]}</small></span>
                      </button>
                      <b className="text-[9px] font-black text-[#ffe676]">{player.price.toFixed(1)}M</b>
                      <span className="text-[9px] font-black text-white/70">{player.points}</span>
                      <button type="button" onClick={() => onQuickAdd(player)} className={["grid h-7 w-7 place-items-center rounded-full border text-sm font-black transition", selected ? "border-rose-300/25 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20" : "border-emerald-300/30 bg-emerald-300/10 text-emerald-200 hover:bg-emerald-300/20"].join(" ")} aria-label={`${player.name} ${selected ? "çıkar" : "ekle"}`}>{selected ? "−" : "+"}</button>
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
