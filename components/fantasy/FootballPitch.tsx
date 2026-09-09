"use client";

import { Draggable, Droppable, type DraggableProvided, type DraggableStateSnapshot } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import PlayerCard, { FantasyPlayer, PlayerPosition } from "./PlayerCard";

export type PitchSlot = { id: string; index: number; position: PlayerPosition; player?: FantasyPlayer | null; invalidPosition?: boolean };
export type BenchPitchSlot = { id: string; kind: "GK" | "OUTFIELD"; player?: FantasyPlayer | null };

type Props = {
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
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (name: string) => `${base}/game-ui/${name}`;

export default function FootballPitch({ formationLabel, formations, slots, benchSlots, captainId, tripleCaptainId, draggingPlayer, onFormationChange, onPlayerClick, onBenchPlayerClick }: Props) {
  return (
    <section className="relative mx-auto w-full max-w-[920px] overflow-visible rounded-[30px] border border-cyan-300/15 bg-[linear-gradient(180deg,#0b1329,#080d1a)] p-2 shadow-[0_36px_110px_rgba(0,0,0,.70)] sm:p-2.5">
      <div className="pointer-events-none absolute inset-x-[4%] -top-12 h-28 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative h-[610px] overflow-hidden rounded-[24px] border border-[#dfffe9]/25 bg-[#155d29] shadow-[inset_0_0_120px_rgba(0,20,5,.60),0_24px_48px_rgba(0,0,0,.42)] sm:h-[630px] lg:h-[650px]">
        <img src={asset("pitch-texture.svg")} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" draggable={false} />
        <img src={asset("stadium-lights.svg")} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-screen" draggable={false} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,10,20,.12),transparent_18%,transparent_75%,rgba(0,8,12,.18))]" />

        <PitchMarkings />

        <div className="absolute left-[4%] top-[3.2%] z-40">
          <select value={formationLabel} onChange={(e) => onFormationChange(e.target.value)} className="h-10 min-w-[116px] rounded-full border border-[#f3ca40]/85 bg-[linear-gradient(180deg,rgba(16,27,36,.96),rgba(7,15,23,.98))] px-4 text-[13px] font-black text-white outline-none shadow-[0_0_18px_rgba(243,202,64,.16),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl">
            {formations.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div className="absolute right-[4%] top-[3.4%] z-30 text-right drop-shadow-[0_4px_18px_rgba(0,0,0,.45)]">
          <div className="text-[22px] leading-none text-[#f3ca40]">♛</div><b className="block text-[12px] font-black tracking-[.06em] text-[#f3ca40]">FUTBOL IQ</b><small className="text-[7px] font-black tracking-[.28em] text-white/55">FANTASY</small>
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
                          <div ref={provided.innerRef} {...provided.droppableProps} className={["relative grid h-[112px] min-h-[112px] min-w-0 place-items-center overflow-visible rounded-2xl transition duration-150", draggingPlayer && canDrop ? "border border-dashed border-emerald-200/55 bg-emerald-300/[.08]" : "", draggingPlayer && !canDrop ? "border border-dashed border-rose-300/30 bg-rose-400/[.08]" : "", snapshot.isDraggingOver ? "ring-2 ring-[#f3ca40]/80 shadow-[0_0_24px_rgba(243,202,64,.24)]" : "", slot.invalidPosition ? "bg-rose-500/10 ring-1 ring-rose-400/30" : ""].join(" ")}>
                            {draggingPlayer && canDrop ? <GhostCard player={draggingPlayer} /> : null}
                            {slot.player ? (
                              <Draggable draggableId={`player:${slot.player.id}`} index={0}>
                                {(dragProvided, dragSnapshot) => (
                                  <DragPortal isDragging={dragSnapshot.isDragging}>
                                    <DragFrame provided={dragProvided} snapshot={dragSnapshot}>
                                      <PlayerCard compact player={slot.player!} captain={slot.player!.id === captainId} tripleCaptain={slot.player!.id === tripleCaptainId} isDragging={dragSnapshot.isDragging} invalidPosition={Boolean(slot.invalidPosition)} onClick={() => onPlayerClick?.(slot.player!)} />
                                    </DragFrame>
                                  </DragPortal>
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

          <div className="absolute bottom-[4.5%] right-[4%] z-30 grid h-[88px] w-[76px] place-items-center rounded-2xl border-2 border-dashed border-[#f3ca40]/85 bg-[linear-gradient(180deg,rgba(89,66,8,.32),rgba(28,21,3,.42))] text-center shadow-[0_0_26px_rgba(243,202,64,.18),inset_0_0_18px_rgba(243,202,64,.05)] backdrop-blur-xl">
            <div><span className="mx-auto grid h-8 w-8 place-items-center text-[24px] text-[#f3ca40] drop-shadow-[0_0_10px_rgba(243,202,64,.45)]">★</span><b className="mt-1 block text-[9px] tracking-[.06em] text-[#f3ca40]">JOKER</b></div>
          </div>
        </div>
      </div>

      <div className="relative mt-2 overflow-hidden rounded-[26px] border border-white/18 bg-[linear-gradient(180deg,rgba(12,24,34,.97),rgba(7,15,21,.98)_48%,rgba(10,36,18,.99))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_22px_48px_rgba(0,0,0,.48)] backdrop-blur-xl">
        <img src={asset("dugout-glass.svg")} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-fill opacity-90" draggable={false} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(21,78,34,.72),rgba(7,34,15,.92))]" />
        <div className="relative mb-2 flex items-center justify-between gap-3"><span className="rounded-full border border-white/10 bg-[#0b1329]/75 px-3 py-1 text-[9px] font-black tracking-[.12em] text-white backdrop-blur-lg">YEDEK KULÜBESİ</span><span className="rounded-full border border-white/8 bg-black/25 px-2 py-1 text-[8px] font-black text-white/45">{benchSlots.filter((slot) => slot.player).length}/4</span></div>

        <div className="relative grid grid-cols-[88px_repeat(4,minmax(0,1fr))] items-end gap-1.5 max-[620px]:grid-cols-[72px_repeat(4,minmax(0,1fr))] sm:gap-3">
          <CoachCard />
          {benchSlots.map((slot, index) => {
            const valid = !draggingPlayer || (slot.kind === "GK" ? draggingPlayer.position === "GK" : draggingPlayer.position !== "GK");
            return (
              <Droppable key={slot.id} droppableId={slot.id} isDropDisabled={!valid}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className={["relative grid h-[116px] min-w-0 place-items-center overflow-visible rounded-xl border border-white/[.07] bg-[#080d1a]/16 transition duration-150 backdrop-blur-sm", draggingPlayer && valid ? "border-emerald-300/45 bg-emerald-300/[.07]" : "", draggingPlayer && !valid ? "border-rose-300/30 bg-rose-400/[.06]" : "", snapshot.isDraggingOver ? "ring-2 ring-[#f3ca40]/75 shadow-[0_0_24px_rgba(243,202,64,.18)]" : ""].join(" ")}>
                    {draggingPlayer && valid ? <GhostCard player={draggingPlayer} substitute /> : null}
                    {slot.player ? (
                      <Draggable draggableId={`player:${slot.player.id}`} index={0}>
                        {(dragProvided, dragSnapshot) => (
                          <DragPortal isDragging={dragSnapshot.isDragging}>
                            <DragFrame provided={dragProvided} snapshot={dragSnapshot}>
                              <PlayerCard compact player={slot.player!} substitute tier="gold" isDragging={dragSnapshot.isDragging} onClick={() => onBenchPlayerClick?.(slot.player!)} />
                            </DragFrame>
                          </DragPortal>
                        )}
                      </Draggable>
                    ) : !draggingPlayer ? <div className="grid h-[102px] w-full max-w-[82px] place-items-center rounded-xl border border-dashed border-white/16 bg-[#080d1a]/18 px-2 text-center text-[7px] font-black tracking-[.08em] text-white/30 backdrop-blur-sm">{slot.kind === "GK" ? "YEDEK KL" : `Y${index + 1}`}</div> : null}
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

function PitchMarkings() {
  return <><div className="pointer-events-none absolute inset-[2.8%] rounded-[6px] border-2 border-white/72 shadow-[0_0_18px_rgba(255,255,255,.12)]"/><div className="pointer-events-none absolute left-[2.8%] right-[2.8%] top-1/2 border-t-2 border-white/65"/><div className="pointer-events-none absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/65"/><div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"/><div className="pointer-events-none absolute left-1/2 top-[2.8%] h-[82px] w-[220px] -translate-x-1/2 border-x-2 border-b-2 border-white/60"/><div className="pointer-events-none absolute bottom-[2.8%] left-1/2 h-[82px] w-[220px] -translate-x-1/2 border-x-2 border-t-2 border-white/60"/></>;
}

function DragPortal({ isDragging, children }: { isDragging: boolean; children: React.ReactNode }) {
  if (!isDragging || typeof document === "undefined") return <>{children}</>;
  return createPortal(children, document.body);
}

function DragFrame({ provided, snapshot, children }: { provided: DraggableProvided; snapshot: DraggableStateSnapshot; children: React.ReactNode }) {
  return <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ ...provided.draggableProps.style, zIndex: snapshot.isDragging ? 99999 : undefined }} className={["z-20 cursor-grab touch-none active:cursor-grabbing", snapshot.isDragging ? "will-change-transform drop-shadow-[0_22px_28px_rgba(0,0,0,.55)]" : ""].join(" ")}>{children}</div>;
}

function CoachCard() {
  return <div className="relative h-[116px] overflow-visible rounded-[18px] border border-[#f3ca40]/45 bg-[linear-gradient(160deg,#283846,#111b24_43%,#5a420f_44%,#241b09)] shadow-[0_14px_30px_rgba(0,0,0,.46),0_0_20px_rgba(243,202,64,.12),inset_0_1px_0_rgba(255,255,255,.12)]"><div className="absolute inset-x-0 top-0 h-8 rounded-t-[18px] bg-[linear-gradient(180deg,rgba(255,255,255,.14),transparent)]"/><span className="absolute left-2 top-2 z-20 rounded-full border border-[#f3ca40]/40 bg-[#0b1329]/72 px-1.5 py-0.5 text-[6px] font-black tracking-[.08em] text-[#f3ca40] backdrop-blur-md">TD</span><div className="absolute left-1/2 top-[18px] h-[68px] w-[56px] -translate-x-1/2 overflow-visible"><div className="absolute bottom-0 left-1/2 h-[64px] w-[52px] -translate-x-1/2 rounded-t-[46%] bg-[radial-gradient(circle_at_50%_20%,#d0a17f_0_17%,#8f674f_18%_31%,#17222a_32%_66%,#0c1216_67%)] drop-shadow-[0_8px_10px_rgba(0,0,0,.48)]"/></div><div className="absolute inset-x-2 bottom-2 rounded-md bg-[#080d1a]/86 px-1 py-1 text-center backdrop-blur-md"><b className="block truncate text-[8px] font-black text-white">Teknik Direktör</b><small className="mt-0.5 block text-[6px] font-bold text-[#f3ca40]/70">Yönetim Kartı</small></div></div>;
}

function GhostCard({ player, substitute = false }: { player: FantasyPlayer; substitute?: boolean }) {
  return <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[108px] w-[84px] -translate-x-1/2 -translate-y-1/2 rounded-[18px] border-2 border-dashed border-[#f3ca40]/70 bg-[linear-gradient(155deg,rgba(243,202,64,.12),rgba(0,230,118,.09),rgba(5,18,28,.20))] opacity-60 shadow-[0_0_28px_rgba(243,202,64,.16)] backdrop-blur-sm"><div className="grid h-full place-items-center text-center"><div><div className="mx-auto h-12 w-10 rounded-[48%_48%_40%_40%] bg-white/10"/><b className="mt-1 block max-w-[72px] truncate px-1 text-[7px] text-white/60">{substitute ? "YEDEK · " : ""}{player.position}</b></div></div></div>;
}

function EmptySlot({ position }: { position: PlayerPosition }) {
  return <div className="grid h-[100px] w-full max-w-[82px] place-items-center rounded-2xl border border-dashed border-white/16 bg-[#080d1a]/10 px-2 text-center backdrop-blur-sm"><div><div className="mx-auto mb-1.5 h-8 w-7 rounded-[50%_50%_40%_40%] border border-white/14"/><span className="block text-[6px] font-black tracking-[.1em] text-white/35">{lineLabel[position]}</span></div></div>;
}
