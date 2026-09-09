"use client";

import { motion } from "framer-motion";

export type CardTier = "gold" | "silver" | "bronze";
export type PlayerPosition = "GK" | "DEF" | "MID" | "FWD";

export type FantasyPlayer = {
  id: string | number;
  name: string;
  club: string;
  clubLogo?: string;
  photo?: string;
  position: PlayerPosition;
  price: number;
  points: number;
  matches?: number;
  selected?: number;
};

type PlayerCardProps = {
  player: FantasyPlayer;
  tier?: CardTier;
  captain?: boolean;
  tripleCaptain?: boolean;
  substitute?: boolean;
  compact?: boolean;
  isDragging?: boolean;
  invalidPosition?: boolean;
  onClick?: () => void;
};

const tierStyles: Record<CardTier, string> = {
  gold:
    "border-[#f6d56a]/90 bg-[linear-gradient(155deg,rgba(108,80,16,.98),rgba(34,25,8,.98)_52%,rgba(9,13,15,.98))] shadow-[0_14px_32px_rgba(0,0,0,.48),0_0_22px_rgba(246,213,106,.26),inset_0_1px_0_rgba(255,244,191,.42)]",
  silver:
    "border-slate-200/75 bg-[linear-gradient(155deg,rgba(104,119,127,.96),rgba(31,40,47,.98)_52%,rgba(9,13,17,.98))] shadow-[0_14px_32px_rgba(0,0,0,.48),0_0_18px_rgba(211,227,235,.18),inset_0_1px_0_rgba(255,255,255,.32)]",
  bronze:
    "border-[#c98957]/80 bg-[linear-gradient(155deg,rgba(109,63,34,.97),rgba(43,24,15,.98)_52%,rgba(10,12,14,.98))] shadow-[0_14px_32px_rgba(0,0,0,.48),0_0_18px_rgba(201,137,87,.18),inset_0_1px_0_rgba(255,220,191,.24)]",
};

export default function PlayerCard({
  player,
  tier = "gold",
  captain = false,
  tripleCaptain = false,
  substitute = false,
  compact = false,
  isDragging = false,
  invalidPosition = false,
  onClick,
}: PlayerCardProps) {
  const badge = tripleCaptain ? "3x" : captain ? "C" : null;

  return (
    <motion.article
      layout="position"
      animate={{
        scale: isDragging ? 1.05 : 1,
        opacity: isDragging ? 0.82 : 1,
        y: 0,
      }}
      whileHover={!isDragging ? { y: -4, scale: 1.02 } : undefined}
      whileTap={!isDragging ? { scale: 0.985 } : undefined}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      onClick={onClick}
      className={[
        "relative isolate select-none overflow-visible border backdrop-blur-xl",
        "[clip-path:polygon(14%_0,86%_0,100%_13%,96%_82%,83%_100%,17%_100%,4%_82%,0_13%)]",
        "before:pointer-events-none before:absolute before:inset-[3px] before:-z-10 before:[clip-path:inherit] before:border before:border-white/10 before:bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,.16),transparent_32%)]",
        compact ? "h-[106px] w-[82px] p-1.5" : "h-[128px] w-[98px] p-2",
        invalidPosition
          ? "border-rose-300/90 bg-[linear-gradient(155deg,rgba(115,26,34,.98),rgba(62,13,20,.98)_55%,rgba(20,7,10,.99))] ring-2 ring-rose-400/75 shadow-[0_0_30px_rgba(244,63,94,.42),inset_0_0_28px_rgba(244,63,94,.16)]"
          : tierStyles[tier],
        captain || tripleCaptain
          ? "ring-1 ring-[#ffe889]/80 shadow-[0_15px_35px_rgba(0,0,0,.5),0_0_28px_rgba(255,211,74,.42)]"
          : "",
        isDragging ? "z-50 shadow-[0_18px_44px_rgba(0,0,0,.55),0_0_34px_rgba(245,208,74,.32),0_0_42px_rgba(52,211,153,.28)]" : "",
        onClick ? "cursor-pointer" : "",
      ].join(" ")}
      aria-label={`${player.name} oyuncu kartı${invalidPosition ? ", geçersiz mevki" : ""}`}
    >
      {invalidPosition ? (
        <span className="absolute -left-1.5 -top-1.5 z-30 rounded-full border border-rose-200/70 bg-rose-600 px-1.5 py-0.5 text-[6px] font-black tracking-[.08em] text-white shadow-[0_0_16px_rgba(244,63,94,.55)]">
          MEVKİ HATASI
        </span>
      ) : null}

      {badge ? (
        <span className="absolute -right-2 -top-2 z-20 grid h-7 min-w-7 place-items-center rounded-full border border-[#fff2a0] bg-[radial-gradient(circle_at_35%_25%,#fff3a1,#d39b19_55%,#6e4506)] px-1 text-[10px] font-black text-[#201500] shadow-[0_0_20px_rgba(255,215,74,.72)]">
          {badge}
        </span>
      ) : null}

      {substitute ? (
        <span className="absolute left-1.5 top-1.5 z-20 rounded-full border border-emerald-300/35 bg-emerald-950/80 px-1.5 py-0.5 text-[7px] font-black tracking-[.08em] text-emerald-200">
          YEDEK
        </span>
      ) : null}

      <div className="relative mx-auto mt-1 h-[62px] w-[62px] overflow-hidden rounded-[45%_45%_36%_36%] border border-white/15 bg-[radial-gradient(circle_at_50%_22%,rgba(95,175,140,.55),rgba(8,33,29,.92)_62%,rgba(3,10,13,.98))] shadow-[inset_0_-18px_24px_rgba(0,0,0,.42),0_6px_14px_rgba(0,0,0,.28)]">
        {player.photo ? (
          <img src={player.photo} alt={player.name} className="h-full w-full object-cover object-top" draggable={false} />
        ) : (
          <div className="flex h-full w-full items-end justify-center">
            <div className="mb-[-8px] h-[54px] w-[48px] rounded-t-[48%] bg-[radial-gradient(circle_at_50%_23%,#c59270_0_18%,#8d6149_19%_31%,#12352c_32%_67%,#081914_68%)] opacity-90" />
          </div>
        )}
        <div className={[
          "pointer-events-none absolute inset-0",
          invalidPosition
            ? "bg-[linear-gradient(115deg,rgba(255,80,100,.28),transparent_35%,rgba(120,0,20,.16))]"
            : "bg-[linear-gradient(115deg,rgba(255,255,255,.16),transparent_28%,transparent_72%,rgba(255,255,255,.05))]",
        ].join(" ")} />
      </div>

      <div className="mt-1.5 min-w-0 text-center">
        <strong className="block truncate text-[9px] font-black leading-tight tracking-[-.02em] text-white drop-shadow-sm">{player.name}</strong>
        <div className="mt-1 flex items-center justify-center gap-1 text-[6.5px] font-bold text-white/70">
          {player.clubLogo ? (
            <img src={player.clubLogo} alt="" className="h-3 w-3 rounded-full object-contain" draggable={false} />
          ) : (
            <span className="h-2.5 w-2.5 rounded-full border border-white/15 bg-white/10" />
          )}
          <span className="max-w-[48px] truncate">{player.club}</span>
        </div>
        <div className="mt-1.5 grid grid-cols-3 gap-0.5 border-t border-white/10 pt-1 text-[6.5px] font-black">
          <span className="text-[#ffe676]">{player.price.toFixed(1)}M</span>
          <span className="text-white/85">{player.points} P</span>
          <span className={invalidPosition ? "text-rose-200" : "text-emerald-300"}>{player.position}</span>
        </div>
      </div>
    </motion.article>
  );
}
