"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import PlayerCard, { FantasyPlayer, PlayerPosition } from "./PlayerCard";

export type PitchSlot = { id: string; index: number; position: PlayerPosition; player?: FantasyPlayer | null; invalidPosition?: boolean };
export type BenchPitchSlot = { id: string; position: PlayerPosition; player?: FantasyPlayer | null };

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
const shortPosition: Record<PlayerPosition, string> = { GK: "GK", DEF: "DF", MID: "OT", FWD: "F" };
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (name: string) => `${base}/game-ui/${name}`;

export default function FootballPitch({ formationLabel, formations, slots, benchSlots, captainId, tripleCaptainId, draggingPlayer, onFormationChange, onPlayerClick, onBenchPlayerClick }: Props) {
  return (
    <section className="relative mx-auto w-full max-w-[920px] overflow-visible rounded-[30px] border border-cyan-300/15 bg-[linear-gradient(180deg,#0b1329,#080d1a)] p-2 shadow-[0_36px_110px_rgba(0,0,0,.70)] sm:p-2.5">
      <div className="pointer-events-none absolute -inset-x-3 -top-4 h-10 rounded-[50%] border-t border-cyan-200/35 bg-[linear-gradient(90deg,transparent,rgba(38,214,255,.2),rgba(243,202,64,.12),rgba(38,214,255,.2),transparent)] blur-[1px]" />
      <div className="pointer-events-none absolute inset-x-[4%] -top-12 h-28 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative h-[610px] overflow-hidden rounded-[24px] border border-[#dfffe9]/25 bg-[#155d29] shadow-[inset_0_0_120px_rgba(0,20,5,.60),0_24px_48px_rgba(0,0,0,.42)] sm:h-[630px] lg:h-[650px]">
        <img src={asset("pitch-texture.svg")} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" draggable={false} />
        <img src={asset("stadium-lights.svg")} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-screen" draggable={false} />
        <div className="pointer-events-none absolute inset-x-[3%] top-0 h-1 rounded-full bg-[linear-gradient(90deg,transparent,#2de8ff_20%,#fff_50%,#f3ca40_80%,transparent)] opacity-65 shadow-[0_0_18px_rgba(45,232,255,.5)]" />
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

        <div className="absolute left-1/2 top-16 z-10 flex h-[calc(100%-84px)] w-[94%] -translate-x-1/2 flex-col pb-5">
          <div className="flex min-h-0 flex-1 flex-col justify-evenly gap-1 py-1">
            {lineOrder.map((position) => {
              const lineSlots = slots.filter((slot) => slot.position === position);
              if (!lineSlots.length) return null;
              return (
                <motion.div layout="position" key={position} className="grid h-[112px] w-full shrink-0 items-center justify-items-center gap-1 sm:gap-2" style={{ gridTemplateColumns: `repeat(${lineSlots.length}, minmax(0, 1fr))` }}>
                  {lineSlots.map((slot) => <FieldSlot key={slot.id} slot={slot} draggingPlayer={draggingPlayer} captainId={captainId} tripleCaptainId={tripleCaptainId} onPlayerClick={onPlayerClick} />)}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-[4.5%] right-[4%] z-30 grid h-[88px] w-[76px] place-items-center rounded-2xl border-2 border-dashed border-[#f3ca40]/85 bg-[linear-gradient(180deg,rgba(89,66,8,.32),rgba(28,21,3,.42))] text-center shadow-[0_0_26px_rgba(243,202,64,.18),inset_0_0_18px_rgba(243,202,64,.05)] backdrop-blur-xl">
          <div><span className="mx-auto grid h-8 w-8 place-items-center text-[24px] text-[#f3ca40]">★</span><b className="mt-1 block text-[9px] tracking-[.06em] text-[#f3ca40]">JOKER</b></div>
        </div>
      </div>

      <div className="relative mt-2 overflow-hidden rounded-[26px] border border-white/18 bg-[linear-gradient(180deg,rgba(12,24,34,.97),rgba(7,15,21,.98)_48%,rgba(10,36,18,.99))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_22px_48px_rgba(0,0,0,.48)] backdrop-blur-xl">
        <img src={asset("dugout-glass.svg")} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-fill opacity-90" draggable={false} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(21,78,34,.72),rgba(7,34,15,.92))]" />
        <div className="relative mb-2 flex items-center justify-between gap-3"><span className="rounded-full border border-white/10 bg-[#0b1329]/75 px-3 py-1 text-[9px] font-black tracking-[.12em] text-white backdrop-blur-lg">YEDEK KULÜBESİ</span><span className="rounded-full border border-white/8 bg-black/25 px-2 py-1 text-[8px] font-black text-white/45">{benchSlots.filter((slot) => slot.player).length}/4</span></div>

        <div className="relative grid grid-cols-[74px_repeat(4,minmax(0,1fr))] items-end gap-1.5 max-[620px]:grid-cols-[58px_repeat(4,minmax(0,1fr))] sm:gap-3">
          <CoachCard />
          {benchSlots.map((slot) => <BenchSlot key={slot.id} slot={slot} draggingPlayer={draggingPlayer} onPlayerClick={onBenchPlayerClick} />)}
        </div>
      </div>
    </section>
  );
}

function FieldSlot({ slot, draggingPlayer, captainId, tripleCaptainId, onPlayerClick }: { slot: PitchSlot; draggingPlayer?: FantasyPlayer | null; captainId?: string | number | null; tripleCaptainId?: string | number | null; onPlayerClick?: (player: FantasyPlayer) => void }) {
  const canDrop = !draggingPlayer || draggingPlayer.position === slot.position;
  const { setNodeRef, isOver } = useDroppable({ id: slot.id, disabled: !canDrop, data: { targetPosition: slot.position, targetType: "field" } });
  return (
    <div ref={setNodeRef} className={["relative grid h-[112px] min-h-[112px] min-w-0 place-items-center rounded-2xl transition duration-150", draggingPlayer && canDrop ? "border border-dashed border-emerald-200/55 bg-emerald-300/[.08]" : "", draggingPlayer && !canDrop ? "border border-dashed border-rose-300/30 bg-rose-400/[.08]" : "", isOver ? "ring-2 ring-[#f3ca40]/80 shadow-[0_0_24px_rgba(243,202,64,.24)]" : "", slot.invalidPosition ? "bg-rose-500/10 ring-1 ring-rose-400/30" : ""].join(" ")}>
      {draggingPlayer && canDrop ? <GhostCard player={draggingPlayer} active={isOver} /> : null}
      {slot.player ? <DraggablePlayer player={slot.player} sourceSlotId={slot.id} captain={slot.player.id === captainId} tripleCaptain={slot.player.id === tripleCaptainId} invalidPosition={Boolean(slot.invalidPosition)} onClick={() => onPlayerClick?.(slot.player!)} /> : !draggingPlayer ? <EmptySlot position={slot.position} /> : null}
    </div>
  );
}

function BenchSlot({ slot, draggingPlayer, onPlayerClick }: { slot: BenchPitchSlot; draggingPlayer?: FantasyPlayer | null; onPlayerClick?: (player: FantasyPlayer) => void }) {
  const canDrop = !draggingPlayer || draggingPlayer.position === slot.position;
  const { setNodeRef, isOver } = useDroppable({ id: slot.id, disabled: !canDrop, data: { targetPosition: slot.position, targetType: "bench" } });
  const code = shortPosition[slot.position];
  return (
    <div ref={setNodeRef} className={["relative grid h-[118px] min-w-0 place-items-center overflow-visible rounded-xl border bg-[#080d1a]/16 transition duration-150 backdrop-blur-sm", draggingPlayer && canDrop ? "border-emerald-300/45 bg-emerald-300/[.07]" : "border-white/[.07]", draggingPlayer && !canDrop ? "border-rose-300/30 bg-rose-400/[.06]" : "", isOver ? "ring-2 ring-[#f3ca40]/75 shadow-[0_0_24px_rgba(243,202,64,.18)]" : ""].join(" ")}>
      <span className="absolute right-1.5 top-1.5 z-40 grid h-6 min-w-6 place-items-center rounded-md border border-[#f3ca40]/45 bg-[#0a1020]/92 px-1 text-[7px] font-black text-[#ffe26a] shadow-[0_0_12px_rgba(243,202,64,.16)]">{code}</span>
      {draggingPlayer && canDrop ? <GhostCard player={draggingPlayer} substitute active={isOver} /> : null}
      {slot.player ? <DraggablePlayer player={slot.player} sourceSlotId={slot.id} substitute onClick={() => onPlayerClick?.(slot.player!)} /> : !draggingPlayer ? <BenchSeat label={code} /> : null}
    </div>
  );
}

function DraggablePlayer({ player, sourceSlotId, captain = false, tripleCaptain = false, substitute = false, invalidPosition = false, onClick }: { player: FantasyPlayer; sourceSlotId: string; captain?: boolean; tripleCaptain?: boolean; substitute?: boolean; invalidPosition?: boolean; onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: `player:${player.id}`, data: { sourceSlotId, playerId: String(player.id), sourceType: sourceSlotId.startsWith("bench-") ? "bench" : "field" } });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 9999, touchAction: "none" as const } : { touchAction: "none" as const };
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={["relative z-20 cursor-grab select-none active:cursor-grabbing", isDragging ? "opacity-25" : ""].join(" ")}>
      <PlayerCard compact player={player} captain={captain} tripleCaptain={tripleCaptain} substitute={substitute} tier="gold" invalidPosition={invalidPosition} onClick={onClick} />
    </div>
  );
}

function CoachCard() {
  return (
    <div className="relative mx-auto h-[94px] w-[68px] overflow-hidden rounded-[16px] border border-violet-300/45 bg-[linear-gradient(160deg,#27224d,#16142f_47%,#083c47)] shadow-[0_12px_26px_rgba(0,0,0,.44),0_0_18px_rgba(125,211,252,.12),inset_0_1px_0_rgba(255,255,255,.12)]">
      <span className="absolute left-1.5 top-1.5 z-20 rounded-full border border-cyan-200/30 bg-[#0a1221]/80 px-1.5 py-0.5 text-[6px] font-black text-cyan-200">TD</span>
      <div className="absolute left-1/2 top-[18px] h-[50px] w-[42px] -translate-x-1/2 rounded-t-[46%] bg-[radial-gradient(circle_at_50%_20%,#d0a17f_0_17%,#8f674f_18%_31%,#20334f_32%_66%,#11182d_67%)]" />
      <div className="absolute inset-x-1.5 bottom-1.5 rounded-md bg-[#080d1a]/88 px-1 py-1 text-center"><b className="block text-[6.5px] font-black text-white">TEKNİK DİREKTÖR</b><small className="block text-[5.5px] font-bold text-cyan-200/70">YÖNETİM</small></div>
    </div>
  );
}

function BenchSeat({ label }: { label: string }) {
  return <div className="relative grid h-[102px] w-full max-w-[82px] place-items-end overflow-hidden rounded-[16px] border border-white/12 bg-[linear-gradient(180deg,#17293a,#0c1925_48%,#07101a)] px-2 pb-3 text-center shadow-[inset_0_2px_0_rgba(255,255,255,.08),inset_0_-16px_22px_rgba(0,0,0,.45),0_8px_16px_rgba(0,0,0,.25)]"><div className="absolute left-1/2 top-3 h-12 w-[72%] -translate-x-1/2 rounded-[12px_12px_6px_6px] border border-cyan-200/10 bg-[linear-gradient(180deg,#142c41,#0a1824)]"/><span className="relative z-10 rounded bg-black/28 px-2 py-1 text-[8px] font-black tracking-[.08em] text-[#ffe26a]">{label}</span></div>;
}

function GhostCard({ player, substitute = false, active = false }: { player: FantasyPlayer; substitute?: boolean; active?: boolean }) {
  return <div className={["pointer-events-none absolute left-1/2 top-1/2 z-10 h-[108px] w-[84px] -translate-x-1/2 -translate-y-1/2 rounded-[18px] border-2 border-dashed bg-[linear-gradient(155deg,rgba(243,202,64,.12),rgba(0,230,118,.09),rgba(5,18,28,.20))] backdrop-blur-sm transition", active ? "border-[#ffe47a] opacity-80 shadow-[0_0_36px_rgba(243,202,64,.38)]" : "border-[#f3ca40]/55 opacity-45"].join(" ")}><div className="grid h-full place-items-center"><b className="text-[7px] text-white/60">{substitute ? "YEDEK · " : ""}{shortPosition[player.position]}</b></div></div>;
}

function EmptySlot({ position }: { position: PlayerPosition }) {
  return <div className="grid h-[100px] w-full max-w-[82px] place-items-center rounded-2xl border border-dashed border-white/16 bg-[#080d1a]/10 px-2 text-center backdrop-blur-sm"><div><div className="mx-auto mb-1.5 h-8 w-7 rounded-[50%_50%_40%_40%] border border-white/14"/><span className="block text-[6px] font-black tracking-[.1em] text-white/35">{lineLabel[position]}</span></div></div>;
}

function PitchMarkings() {
  return <><div className="pointer-events-none absolute inset-[2.8%] rounded-[6px] border-2 border-white/72"/><div className="pointer-events-none absolute left-[2.8%] right-[2.8%] top-1/2 border-t-2 border-white/65"/><div className="pointer-events-none absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/65"/><div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"/><div className="pointer-events-none absolute left-1/2 top-[2.8%] h-[82px] w-[220px] -translate-x-1/2 border-x-2 border-b-2 border-white/60"/><div className="pointer-events-none absolute bottom-[2.8%] left-1/2 h-[82px] w-[220px] -translate-x-1/2 border-x-2 border-t-2 border-white/60"/></>;
}
