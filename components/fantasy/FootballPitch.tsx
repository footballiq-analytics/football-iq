"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import PlayerCard, { FantasyPlayer, PlayerPosition } from "./PlayerCard";

export type PitchSlot = {
  id: string;
  index: number;
  position: PlayerPosition;
  player?: FantasyPlayer | null;
  invalidPosition?: boolean;
};

export type BenchPitchSlot = {
  id: string;
  kind: "GK" | "OUTFIELD";
  player?: FantasyPlayer | null;
};

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

export default function FootballPitch({
  formationLabel,
  formations,
  slots,
  benchSlots,
  captainId,
  tripleCaptainId,
  draggingPlayer,
  onFormationChange,
  onPlayerClick,
  onBenchPlayerClick,
}: FootballPitchProps) {
  return (
    <section className="relative mx-auto w-full max-w-[860px] overflow-visible rounded-[26px] border border-emerald-200/10 bg-[#06140f] p-2 shadow-[0_30px_90px_rgba(0,0,0,.46)] sm:p-2.5">
      <div className="pointer-events-none absolute inset-x-[8%] -top-8 h-20 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="relative h-[700px] overflow-hidden rounded-[22px] border border-emerald-100/20 bg-[linear-gradient(180deg,rgba(2,28,17,.12),rgba(0,12,7,.42)),repeating-linear-gradient(90deg,#0e6a3d_0_12.5%,#0b5c36_12.5%_25%)] shadow-[inset_0_0_90px_rgba(0,19,8,.58)] sm:h-[720px] lg:h-[740px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(184,255,213,.17),transparent_29%),linear-gradient(110deg,rgba(255,255,255,.035),transparent_23%,transparent_72%,rgba(255,255,255,.025))]" />
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,.012)_0_1px,transparent_1px_4px)] opacity-50" />
        <div className="pointer-events-none absolute inset-[3.2%] rounded-[8px] border-2 border-white/45 shadow-[0_0_18px_rgba(210,255,224,.08)]" />
        <div className="pointer-events-none absolute left-[3.2%] right-[3.2%] top-1/2 border-t-2 border-white/40" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[116px] w-[116px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45" />
        <div className="pointer-events-none absolute left-1/2 top-[3.2%] h-[78px] w-[200px] -translate-x-1/2 border-x-2 border-b-2 border-white/38" />
        <div className="pointer-events-none absolute bottom-[3.2%] left-1/2 h-[78px] w-[200px] -translate-x-1/2 border-x-2 border-t-2 border-white/38" />

        <div className="absolute left-[5%] top-[4.2%] z-40">
          <label className="block rounded-xl border border-white/10 bg-[#05231b]/82 p-1.5 shadow-[0_10px_28px_rgba(0,0,0,.28)] backdrop-blur-xl">
            <span className="block text-[6px] font-black tracking-[.14em] text-emerald-100/55">DİZİLİŞ</span>
            <select
              value={formationLabel}
              onChange={(event) => onFormationChange(event.target.value)}
              className="mt-0.5 h-7 min-w-[98px] rounded-lg border border-emerald-300/30 bg-[#071c18] px-2 text-[9px] font-black text-emerald-200 outline-none focus:border-emerald-300/70"
            >
              {formations.map((formation) => <option key={formation} value={formation}>{formation}</option>)}
            </select>
          </label>
        </div>

        <div className="relative z-10 flex h-full flex-col px-2 pb-[142px] pt-16 sm:px-4 sm:pb-[148px] lg:px-5">
          <div className="mb-1 flex justify-end px-2">
            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[7px] font-bold text-white/55 backdrop-blur-md">11 ASİL + 4 YEDEK</span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-evenly gap-1.5 py-1">
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
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={[
                              "relative grid h-[112px] max-h-[112px] min-h-[112px] min-w-0 place-items-center overflow-visible rounded-2xl px-0.5 py-1 transition",
                              draggingPlayer && canDrop ? "border border-dashed border-emerald-300/55 bg-emerald-300/10 shadow-[0_0_24px_rgba(52,211,153,.12)]" : "",
                              draggingPlayer && !canDrop ? "border border-dashed border-rose-300/35 bg-rose-400/10" : "",
                              snapshot.isDraggingOver ? "ring-2 ring-emerald-200/70" : "",
                              slot.invalidPosition ? "bg-rose-500/8 ring-1 ring-rose-400/30" : "",
                            ].join(" ")}
                          >
                            {slot.player ? (
                              <Draggable draggableId={`player:${slot.player.id}`} index={0}>
                                {(dragProvided, dragSnapshot) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
                                  >
                                    <PlayerCard
                                      compact
                                      player={slot.player!}
                                      captain={slot.player!.id === captainId}
                                      tripleCaptain={slot.player!.id === tripleCaptainId}
                                      isDragging={dragSnapshot.isDragging}
                                      invalidPosition={Boolean(slot.invalidPosition)}
                                      onClick={() => onPlayerClick?.(slot.player!)}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ) : (
                              <EmptySlot position={position} active={Boolean(draggingPlayer && canDrop)} invalid={Boolean(draggingPlayer && !canDrop)} />
                            )}
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
        </div>

        <div className="absolute inset-x-[3.2%] bottom-[3.2%] z-20 h-[128px] rounded-2xl border border-emerald-100/15 bg-[linear-gradient(180deg,rgba(7,31,24,.58),rgba(2,17,14,.76))] p-2 shadow-[0_18px_34px_rgba(0,0,0,.28),inset_0_1px_0_rgba(255,255,255,.05)] backdrop-blur-xl sm:h-[134px] sm:p-2.5">
          <div className="mb-1 flex items-center justify-between gap-3 px-1">
            <span className="text-[7px] font-black tracking-[.16em] text-emerald-300">YEDEK KULÜBESİ</span>
            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[7px] font-black text-white/55">{benchSlots.filter((slot) => slot.player).length}/4</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {benchSlots.map((slot, index) => {
              const valid = !draggingPlayer || (slot.kind === "GK" ? draggingPlayer.position === "GK" : draggingPlayer.position !== "GK");
              return (
                <Droppable key={slot.id} droppableId={slot.id} isDropDisabled={!valid}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={[
                        "relative grid h-[106px] max-h-[106px] min-h-[106px] min-w-0 place-items-center overflow-visible rounded-xl transition",
                        draggingPlayer && valid ? "border border-dashed border-emerald-300/50 bg-emerald-300/8" : "",
                        draggingPlayer && !valid ? "border border-dashed border-rose-300/35 bg-rose-400/10" : "",
                        snapshot.isDraggingOver ? "ring-2 ring-emerald-200/70" : "",
                      ].join(" ")}
                    >
                      {slot.player ? (
                        <Draggable draggableId={`player:${slot.player.id}`} index={0}>
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
                            >
                              <PlayerCard compact player={slot.player!} substitute tier="silver" isDragging={dragSnapshot.isDragging} onClick={() => onBenchPlayerClick?.(slot.player!)} />
                            </div>
                          )}
                        </Draggable>
                      ) : (
                        <div className="grid h-[96px] w-full max-w-[82px] place-items-center rounded-xl border border-dashed border-emerald-200/20 bg-black/10 px-2 text-center text-[7px] font-black tracking-[.08em] text-emerald-100/40">{slot.kind === "GK" ? "YEDEK GK" : `YEDEK ${index + 1}`}</div>
                      )}
                      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">{provided.placeholder}</div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptySlot({ position, active, invalid }: { position: PlayerPosition; active: boolean; invalid: boolean }) {
  return (
    <motion.div
      animate={active ? { scale: [1, 1.02, 1] } : undefined}
      transition={active ? { duration: 1.2, repeat: Infinity } : undefined}
      className={[
        "grid h-[100px] w-full max-w-[82px] place-items-center rounded-2xl border border-dashed px-2 text-center backdrop-blur-sm transition",
        active ? "border-emerald-200/65 bg-emerald-300/10 shadow-[0_0_22px_rgba(52,211,153,.16)]" : "",
        invalid ? "border-rose-300/45 bg-rose-400/10" : "",
        !active && !invalid ? "border-emerald-100/22 bg-black/10" : "",
      ].join(" ")}
    >
      <div><div className="mx-auto mb-1.5 h-8 w-7 rounded-[50%_50%_40%_40%] border border-emerald-100/16 bg-[linear-gradient(180deg,rgba(133,255,190,.08),rgba(0,0,0,.08))]" /><span className="block text-[6px] font-black tracking-[.1em] text-emerald-100/45">{lineLabel[position]}</span><small className="mt-0.5 block text-[5.5px] font-medium text-white/25">Buraya bırak</small></div>
    </motion.div>
  );
}
