"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import PlayerCard, { FantasyPlayer, PlayerPosition } from "./PlayerCard";

export type PitchSlot = { id: string; index: number; position: PlayerPosition; player?: FantasyPlayer | null; invalidPosition?: boolean };
export type BenchPitchSlot = { id: string; kind: "GK" | "OUTFIELD"; player?: FantasyPlayer | null };

type FootballPitchProps = {
  formationLabel: string;
  formations: readonly string[];
  slots: PitchSlot[];
  benchSlots: BenchPitchSlot[];
  captainId?: string | number | null;
  tripleCaptainId?: string | number | null;
  draggingPlayer?: FantasyPlayer | null;
  onFormationChange: (formation: string) => void;
  onPlayerClick?: (player: FantasyPlayer) => void;
  onBenchPlayerClick?: (player: FantasyPlayer) => void;
};

const lineOrder: PlayerPosition[] = ["FWD", "MID", "DEF", "GK"];
const lineLabel: Record<PlayerPosition, string> = { FWD: "FORVET", MID: "ORTA SAHA", DEF: "DEFANS", GK: "KALECİ" };

export default function FootballPitch({ formationLabel, formations, slots, benchSlots, captainId, tripleCaptainId, draggingPlayer, onFormationChange, onPlayerClick, onBenchPlayerClick }: FootballPitchProps) {
  return (
    <section className="relative mx-auto w-full max-w-[920px] overflow-visible rounded-[28px] border border-cyan-300/15 bg-[linear-gradient(180deg,#07131d,#03090f)] p-2 shadow-[0_34px_100px_rgba(0,0,0,.62)] sm:p-2.5">
      <div className="pointer-events-none absolute inset-x-[4%] -top-10 h-24 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-8 top-12 h-24 w-24 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 top-8 h-24 w-24 rounded-full bg-white/20 blur-3xl" />

      <div className="relative h-[610px] overflow-hidden rounded-[22px] border border-[#dfffe9]/25 bg-[linear-gradient(180deg,rgba(0,35,15,.10),rgba(0,18,7,.34)),repeating-linear-gradient(90deg,#2f8b2f_0_12.5%,#257b2a_12.5%_25%)] shadow-[inset_0_0_110px_rgba(0,21,5,.55),0_22px_46px_rgba(0,0,0,.34)] sm:h-[630px] lg:h-[650px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-8%,rgba(255,255,255,.28),transparent_32%),linear-gradient(105deg,rgba(255,255,255,.06),transparent_20%,transparent_76%,rgba(255,255,255,.035))]" />
        <div className="pointer-events-none absolute inset-[2.8%] rounded-[6px] border-2 border-white/70 shadow-[0_0_18px_rgba(255,255,255,.12)]" />
        <div className="pointer-events-none absolute left-[2.8%] right-[2.8%] top-1/2 border-t-2 border-white/65" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/65" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
        <div className="pointer-events-none absolute left-1/2 top-[2.8%] h-[82px] w-[220px] -translate-x-1/2 border-x-2 border-b-2 border-white/60" />
        <div className="pointer-events-none absolute bottom-[2.8%] left-1/2 h-[82px] w-[220px] -translate-x-1/2 border-x-2 border-t-2 border-white/60" />

        <div className="absolute left-[4%] top-[3.2%] z-40">
          <select value={formationLabel} onChange={(event) => onFormationChange(event.target.value)} className="h-10 min-w-[116px] rounded-full border border-[#f5d052]/80 bg-[linear-gradient(180deg,rgba(16,27,36,.96),rgba(7,15,23,.98))] px-4 text-[13px] font-black text-white outline-none shadow-[0_0_16px_rgba(245,208,82,.14)]">
            {formations.map((formation) => <option key={formation} value={formation}>{formation}</option>)}
          </select>
        </div>

        <div className="absolute right-[4%] top-[3.4%] z-30 text-right drop-shadow-[0_4px_18px_rgba(0,0,0,.45)]">
          <div className="text-[22px] leading-none text-[#f7d447]">♛</div><b className="block text-[12px] font-black tracking-[.06em] text-[#f7d447]">FUTBOL IQ</b><small className="text-[7px] font-black tracking-[.28em] text-white/55">FANTASY</small>
        </div>

        <div className="relative z-10 flex h-full flex-col px-2 pb-5 pt-16 sm:px-4 lg:px-5">
          <div className="flex min-h-0 flex-1 flex-col justify-evenly gap-1 py-1">
            {lineOrder.map((position) => {
              const lineSlots = slots.filter((slot) => slot.position === position);
              if (!lineSlots.length) return null;
              return (
                <motion.div layout="position" key={position} className="grid h-[112px] w-full shrink-0 items-center justify-items-center gap-1 sm:gap-2" style={{ gridTemplateColumns: `repeat(${lineSlots.length}, minmax(0, 1fr))` }}>
                  {lineSlots.map((slot) => {
                    const canDrop = !draggingPlayer || draggingPlayer.position === slot.position;
                    return (
                      <Droppable key={slot.id} droppableId={slot.id} isDropDisabled={!canDrop}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className={["relative grid h-[112px] min-h-[112px] min-w-0 place-items-center overflow-visible rounded-2xl transition duration-150", draggingPlayer && canDrop ? "border border-dashed border-emerald-200/55 bg-emerald-300/[.08]" : "", draggingPlayer && !canDrop ? "border border-dashed border-rose-300/30 bg-rose-400/[.08]" : "", snapshot.isDraggingOver ? "ring-2 ring-[#f4d35e]/75 shadow-[0_0_22px_rgba(244,211,94,.22)]" : "", slot.invalidPosition ? "bg-rose-500/10 ring-1 ring-rose-400/30" : ""].join(" ")}>
                            {draggingPlayer && canDrop ? <GhostCard player={draggingPlayer} /> : null}
                            {slot.player ? (
                              <Draggable draggableId={`player:${slot.player.id}`} index={0}>
                                {(dragProvided, dragSnapshot) => (
                                  <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps} style={dragProvided.draggableProps.style} className={["z-20 cursor-grab active:cursor-grabbing", dragSnapshot.isDragging ? "z-[9999] will-change-transform" : ""].join(" ")}>
                                    <PlayerCard compact player={slot.player!} captain={slot.player!.id === captainId} tripleCaptain={slot.player!.id === tripleCaptainId} isDragging={dragSnapshot.isDragging} invalidPosition={Boolean(slot.invalidPosition)} onClick={() => onPlayerClick?.(slot.player!)} />
                                  </div>
                                )}
                              </Draggable>
                            ) : !draggingPlayer ? <EmptySlot position={position} /> : null}
                            <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">{provided.placeholder}</div>
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </motion.div>
              );
            })}
          </div>

          <Droppable droppableId="joker-slot" isDropDisabled>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="absolute bottom-[4.5%] right-[4%] z-30 grid h-[88px] w-[76px] place-items-center rounded-2xl border-2 border-dashed border-[#f7d447]/80 bg-[linear-gradient(180deg,rgba(83,61,5,.28),rgba(29,22,3,.38))] text-center shadow-[0_0_24px_rgba(247,212,71,.16)] backdrop-blur-md">
                <div><span className="mx-auto grid h-8 w-8 place-items-center text-[24px] text-[#f7d447]">★</span><b className="mt-1 block text-[9px] tracking-[.06em] text-[#f7d447]">JOKER</b></div><div className="hidden">{provided.placeholder}</div>
              </div>
            )}
          </Droppable>
        </div>
      </div>

      <div className="relative mt-2 overflow-hidden rounded-[22px] border border-white/15 bg-[linear-gradient(180deg,#17232a,#0b1419_36%,#07100c_37%,#0b2d16_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.12),inset_0_-22px_40px_rgba(0,0,0,.42),0_18px_40px_rgba(0,0,0,.42)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[38%] before:bg-[linear-gradient(105deg,rgba(255,255,255,.10),transparent_18%,transparent_78%,rgba(255,255,255,.06))]">
        <div className="pointer-events-none absolute inset-x-[2%] bottom-2 h-[36%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(70,157,74,.42),rgba(16,49,19,.2)_55%,transparent_70%)] blur-sm" />
        <div className="relative mb-2 flex items-center justify-between"><span className="rounded-full bg-black/25 px-3 py-1 text-[9px] font-black tracking-[.12em] text-white">YEDEK KULÜBESİ</span><span className="text-[8px] font-black text-white/45">{benchSlots.filter((slot) => slot.player).length}/4</span></div>
        <div className="relative grid grid-cols-4 gap-1.5 sm:gap-3">
          {benchSlots.map((slot, index) => {
            const valid = !draggingPlayer || (slot.kind === "GK" ? draggingPlayer.position === "GK" : draggingPlayer.position !== "GK");
            return (
              <Droppable key={slot.id} droppableId={slot.id} isDropDisabled={!valid}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className={["relative grid h-[116px] min-w-0 place-items-center overflow-visible rounded-xl border border-white/[.05] bg-black/10 transition duration-150", draggingPlayer && valid ? "border-emerald-300/45 bg-emerald-300/[.07]" : "", draggingPlayer && !valid ? "border-rose-300/30 bg-rose-400/[.06]" : "", snapshot.isDraggingOver ? "ring-2 ring-[#f4d35e]/70" : ""].join(" ")}>
                    {draggingPlayer && valid ? <GhostCard player={draggingPlayer} substitute /> : null}
                    {slot.player ? (
                      <Draggable draggableId={`player:${slot.player.id}`} index={0}>
                        {(dragProvided, dragSnapshot) => (
                          <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps} style={dragProvided.draggableProps.style} className={["z-20 cursor-grab active:cursor-grabbing", dragSnapshot.isDragging ? "z-[9999] will-change-transform" : ""].join(" ")}>
                            <PlayerCard compact player={slot.player!} substitute tier="gold" isDragging={dragSnapshot.isDragging} onClick={() => onBenchPlayerClick?.(slot.player!)} />
                          </div>
                        )}
                      </Draggable>
                    ) : !draggingPlayer ? <div className="grid h-[102px] w-full max-w-[82px] place-items-center rounded-xl border border-dashed border-white/15 bg-black/10 px-2 text-center text-[7px] font-black tracking-[.08em] text-white/30">{slot.kind === "GK" ? "YEDEK KL" : `Y${index + 1}`}</div> : null}
                    <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">{provided.placeholder}</div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GhostCard({ player, substitute = false }: { player: FantasyPlayer; substitute?: boolean }) {
  return <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[106px] w-[82px] -translate-x-1/2 -translate-y-1/2 rounded-[18px] border-2 border-dashed border-[#f4d35e]/75 bg-[linear-gradient(155deg,rgba(255,222,100,.13),rgba(5,40,24,.24))] opacity-70 shadow-[0_0_28px_rgba(244,211,94,.16)]"><div className="grid h-full place-items-center text-center"><div><div className="mx-auto h-12 w-10 rounded-[50%_50%_40%_40%] bg-white/10"/><b className="mt-1 block max-w-[72px] truncate px-1 text-[7px] text-white/60">{substitute ? "YEDEK · " : ""}{player.position}</b></div></div></div>;
}

function EmptySlot({ position }: { position: PlayerPosition }) {
  return <div className="grid h-[100px] w-full max-w-[82px] place-items-center rounded-2xl border border-dashed border-white/16 bg-black/10 px-2 text-center"><div><div className="mx-auto mb-1.5 h-8 w-7 rounded-[50%_50%_40%_40%] border border-white/14"/><span className="block text-[6px] font-black tracking-[.1em] text-white/35">{lineLabel[position]}</span></div></div>;
}
