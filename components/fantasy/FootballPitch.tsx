"use client";

import { motion } from "framer-motion";
import PlayerCard, { FantasyPlayer, PlayerPosition } from "./PlayerCard";

export type PitchSlot = {
  index: number;
  position: PlayerPosition;
  player?: FantasyPlayer | null;
};

type FootballPitchProps = {
  formationLabel: string;
  slots: PitchSlot[];
  bench: (FantasyPlayer | null)[];
  captainId?: number | null;
  tripleCaptainId?: number | null;
  draggingPlayer?: FantasyPlayer | null;
  onDropPlayer?: (slotIndex: number, player: FantasyPlayer) => void;
  onPlayerClick?: (player: FantasyPlayer) => void;
  onBenchPlayerClick?: (player: FantasyPlayer) => void;
  onPlayerDragStart?: (event: React.DragEvent<HTMLElement>, player: FantasyPlayer, slotIndex: number) => void;
};

const lineOrder: PlayerPosition[] = ["FWD", "MID", "DEF", "GK"];

const lineLabel: Record<PlayerPosition, string> = {
  FWD: "FORVET",
  MID: "ORTA SAHA",
  DEF: "DEFANS",
  GK: "KALECİ",
};

export default function FootballPitch({
  formationLabel,
  slots,
  bench,
  captainId,
  tripleCaptainId,
  draggingPlayer,
  onDropPlayer,
  onPlayerClick,
  onBenchPlayerClick,
  onPlayerDragStart,
}: FootballPitchProps) {
  function acceptDrop(event: React.DragEvent<HTMLDivElement>, slot: PitchSlot) {
    event.preventDefault();
    if (!draggingPlayer || draggingPlayer.position !== slot.position) return;
    onDropPlayer?.(slot.index, draggingPlayer);
  }

  return (
    <section className="relative mx-auto w-full max-w-[860px] overflow-visible rounded-[30px] border border-emerald-200/10 bg-[#06140f] p-2 shadow-[0_30px_90px_rgba(0,0,0,.46)] sm:p-3">
      <div className="pointer-events-none absolute inset-x-[8%] -top-8 h-20 rounded-full bg-emerald-300/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[24px] border border-emerald-100/20 bg-[linear-gradient(180deg,rgba(2,28,17,.12),rgba(0,12,7,.42)),repeating-linear-gradient(90deg,#0e6a3d_0_12.5%,#0b5c36_12.5%_25%)] shadow-[inset_0_0_90px_rgba(0,19,8,.58)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(184,255,213,.17),transparent_29%),linear-gradient(110deg,rgba(255,255,255,.035),transparent_23%,transparent_72%,rgba(255,255,255,.025))]" />
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,.012)_0_1px,transparent_1px_4px)] opacity-50" />

        <div className="pointer-events-none absolute inset-[3.2%] rounded-[8px] border-2 border-white/45 shadow-[0_0_18px_rgba(210,255,224,.08)]" />
        <div className="pointer-events-none absolute left-[3.2%] right-[3.2%] top-1/2 border-t-2 border-white/40" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[124px] w-[124px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45" />
        <div className="pointer-events-none absolute left-1/2 top-[3.2%] h-[84px] w-[210px] -translate-x-1/2 border-x-2 border-b-2 border-white/38" />
        <div className="pointer-events-none absolute bottom-[3.2%] left-1/2 h-[84px] w-[210px] -translate-x-1/2 border-x-2 border-t-2 border-white/38" />

        <div className="relative z-10 flex min-h-[760px] flex-col px-2 pb-[150px] pt-5 sm:px-4 sm:pb-[162px] sm:pt-6 lg:min-h-[820px] lg:px-6">
          <div className="mb-2 flex items-center justify-between px-2">
            <div>
              <span className="text-[9px] font-black tracking-[.14em] text-emerald-200/65">DİZİLİŞ</span>
              <h2 className="mt-0.5 text-lg font-black tracking-[-.04em] text-white">{formationLabel}</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[8px] font-bold text-white/55 backdrop-blur-md">
              11 ASİL + 4 YEDEK
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-evenly gap-3 py-1">
            {lineOrder.map((position) => {
              const lineSlots = slots.filter((slot) => slot.position === position);
              if (!lineSlots.length) return null;

              return (
                <motion.div
                  layout
                  key={position}
                  className="grid w-full items-center justify-items-center gap-1 sm:gap-3"
                  style={{ gridTemplateColumns: `repeat(${lineSlots.length}, minmax(0, 1fr))` }}
                >
                  {lineSlots.map((slot) => {
                    const canDrop = draggingPlayer?.position === slot.position;

                    return (
                      <motion.div
                        layout
                        key={slot.index}
                        onDragOver={(event) => {
                          if (canDrop) event.preventDefault();
                        }}
                        onDrop={(event) => acceptDrop(event, slot)}
                        className={[
                          "relative grid min-h-[112px] min-w-0 place-items-center rounded-2xl px-0.5 py-1 transition",
                          canDrop
                            ? "bg-emerald-300/8 ring-1 ring-inset ring-emerald-300/25 shadow-[0_0_24px_rgba(52,211,153,.10)]"
                            : "",
                        ].join(" ")}
                      >
                        {slot.player ? (
                          <PlayerCard
                            compact
                            player={slot.player}
                            captain={slot.player.id === captainId}
                            tripleCaptain={slot.player.id === tripleCaptainId}
                            draggable
                            onClick={() => onPlayerClick?.(slot.player!)}
                            onDragStart={(event) => onPlayerDragStart?.(event, slot.player!, slot.index)}
                          />
                        ) : (
                          <EmptySlot position={position} active={Boolean(canDrop)} />
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="absolute inset-x-[3.2%] bottom-[3.2%] z-20 rounded-2xl border border-emerald-100/15 bg-[linear-gradient(180deg,rgba(7,31,24,.58),rgba(2,17,14,.76))] p-2.5 shadow-[0_18px_34px_rgba(0,0,0,.28),inset_0_1px_0_rgba(255,255,255,.05)] backdrop-blur-xl sm:p-3">
          <div className="mb-2 flex items-center justify-between gap-3 px-1">
            <div>
              <span className="text-[8px] font-black tracking-[.16em] text-emerald-300">YEDEK KULÜBESİ</span>
              <p className="mt-0.5 text-[8px] font-medium text-white/45">Sahanın içine entegre 4 yedek oyuncu</p>
            </div>
            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[8px] font-black text-white/55">
              {bench.filter(Boolean).length}/4
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
            {bench.map((player, index) => (
              <motion.div layout key={player?.id ?? `bench-${index}`} className="grid min-w-0 place-items-center">
                {player ? (
                  <PlayerCard
                    compact
                    player={player}
                    substitute
                    onClick={() => onBenchPlayerClick?.(player)}
                    tier="silver"
                  />
                ) : (
                  <div className="grid h-[106px] w-full max-w-[82px] place-items-center rounded-2xl border border-dashed border-emerald-200/20 bg-black/10 px-2 text-center text-[7px] font-black tracking-[.08em] text-emerald-100/40">
                    YEDEK {index + 1}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptySlot({ position, active }: { position: PlayerPosition; active: boolean }) {
  return (
    <motion.div
      animate={active ? { scale: [1, 1.025, 1] } : undefined}
      transition={active ? { duration: 1.2, repeat: Infinity } : undefined}
      className={[
        "grid h-[106px] w-full max-w-[82px] place-items-center rounded-2xl border border-dashed px-2 text-center backdrop-blur-sm transition",
        active
          ? "border-emerald-200/65 bg-emerald-300/10 shadow-[0_0_22px_rgba(52,211,153,.16)]"
          : "border-emerald-100/22 bg-black/10",
      ].join(" ")}
    >
      <div>
        <div className="mx-auto mb-2 h-10 w-8 rounded-[50%_50%_40%_40%] border border-emerald-100/16 bg-[linear-gradient(180deg,rgba(133,255,190,.08),rgba(0,0,0,.08))]" />
        <span className="block text-[6.5px] font-black tracking-[.1em] text-emerald-100/45">{lineLabel[position]}</span>
        <small className="mt-0.5 block text-[6px] font-medium text-white/25">Buraya bırak</small>
      </div>
    </motion.div>
  );
}
