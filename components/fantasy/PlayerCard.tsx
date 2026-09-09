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
  gold: "border-[#f3ca40]/95 bg-[linear-gradient(155deg,rgba(169,126,28,.98),rgba(83,53,9,.99)_37%,rgba(16,20,28,.995)_77%)] shadow-[0_18px_38px_rgba(0,0,0,.58),0_0_26px_rgba(243,202,64,.27),inset_0_1px_0_rgba(255,244,191,.52),inset_0_-1px_0_rgba(91,56,5,.7)]",
  silver: "border-slate-200/80 bg-[linear-gradient(155deg,rgba(137,150,158,.98),rgba(51,61,68,.99)_40%,rgba(14,18,24,.995)_78%)] shadow-[0_18px_38px_rgba(0,0,0,.55),0_0_22px_rgba(211,227,235,.19),inset_0_1px_0_rgba(255,255,255,.36)]",
  bronze: "border-[#c98957]/88 bg-[linear-gradient(155deg,rgba(145,86,44,.98),rgba(70,38,22,.99)_40%,rgba(16,18,22,.995)_78%)] shadow-[0_18px_38px_rgba(0,0,0,.55),0_0_22px_rgba(201,137,87,.2),inset_0_1px_0_rgba(255,220,191,.28)]",
};

const positionLabel: Record<PlayerPosition, string> = { GK: "KL", DEF: "DEF", MID: "ORT", FWD: "SNT" };

export default function PlayerCard({ player, tier = "gold", captain = false, tripleCaptain = false, substitute = false, compact = false, isDragging = false, invalidPosition = false, onClick }: PlayerCardProps) {
  const badge = tripleCaptain ? "3x" : captain ? "C" : null;

  return (
    <motion.article
      layout="position"
      animate={{ scale: isDragging ? 1.055 : 1, opacity: isDragging ? 0.98 : 1, y: 0, rotateX: isDragging ? 0 : 4 }}
      whileHover={!isDragging ? { y: -6, scale: 1.03, rotateX: 1.2 } : undefined}
      whileTap={!isDragging ? { scale: 0.985 } : undefined}
      transition={{ type: "spring", stiffness: 390, damping: 28, mass: 0.7 }}
      onClick={onClick}
      style={{ transformPerspective: 900, transformStyle: "preserve-3d" }}
      className={[
        "group relative isolate select-none overflow-visible border backdrop-blur-xl [transform-origin:50%_88%]",
        "[clip-path:polygon(13%_0,87%_0,100%_12%,97%_82%,84%_100%,16%_100%,3%_82%,0_12%)]",
        "before:pointer-events-none before:absolute before:inset-[3px] before:-z-10 before:[clip-path:inherit] before:border before:border-white/10 before:bg-[radial-gradient(circle_at_50%_4%,rgba(255,255,255,.28),transparent_29%),linear-gradient(115deg,rgba(255,255,255,.08),transparent_34%)]",
        "after:pointer-events-none after:absolute after:inset-x-[10%] after:-bottom-2 after:h-3 after:rounded-full after:bg-black/50 after:blur-[5px]",
        compact ? "h-[110px] w-[86px] p-1.5" : "h-[134px] w-[102px] p-2",
        invalidPosition ? "border-rose-300/90 bg-[linear-gradient(155deg,rgba(128,29,37,.99),rgba(67,13,20,.99)_55%,rgba(20,7,10,.99))] ring-2 ring-rose-400/75 shadow-[0_0_34px_rgba(244,63,94,.47),inset_0_0_32px_rgba(244,63,94,.18)]" : tierStyles[tier],
        captain || tripleCaptain ? "ring-1 ring-[#ffe889]/85 shadow-[0_18px_40px_rgba(0,0,0,.54),0_0_34px_rgba(255,211,74,.46)]" : "",
        isDragging ? "z-[9999] drop-shadow-[0_26px_34px_rgba(0,0,0,.60)]" : "",
        onClick ? "cursor-pointer" : "",
      ].join(" ")}
      aria-label={`${player.name} oyuncu kartı${invalidPosition ? ", geçersiz mevki" : ""}`}
    >
      <div className="pointer-events-none absolute inset-[1px] z-10 [clip-path:inherit] bg-[linear-gradient(120deg,transparent_8%,rgba(255,255,255,.18)_21%,transparent_34%,transparent_66%,rgba(243,202,64,.12)_82%,transparent_94%)] opacity-55 transition-opacity duration-300 group-hover:opacity-90" />
      <div className="pointer-events-none absolute left-[10%] right-[10%] top-[3px] z-20 h-px bg-[linear-gradient(90deg,transparent,rgba(255,249,214,.8),transparent)]" />

      {invalidPosition ? <span className="absolute -left-1.5 -top-1.5 z-50 rounded-full border border-rose-200/70 bg-rose-600 px-1.5 py-0.5 text-[6px] font-black tracking-[.08em] text-white shadow-[0_0_16px_rgba(244,63,94,.55)]">MEVKİ HATASI</span> : null}
      {badge ? <span className="absolute -right-2 -top-2 z-50 grid h-7 min-w-7 place-items-center rounded-full border border-[#fff2a0] bg-[radial-gradient(circle_at_35%_25%,#fff3a1,#d39b19_55%,#6e4506)] px-1 text-[10px] font-black text-[#201500] shadow-[0_0_22px_rgba(255,215,74,.76)]">{badge}</span> : null}
      {substitute ? <span className="absolute right-1.5 top-1.5 z-40 rounded-full border border-[#f3ca40]/30 bg-[#101521]/88 px-1.5 py-0.5 text-[6px] font-black tracking-[.09em] text-[#f7d85e]">YEDEK</span> : null}

      <div className="absolute left-1.5 top-1.5 z-40 rounded-md border border-white/10 bg-[#0b1329]/84 px-1 py-0.5 text-[6.5px] font-black text-[#f7d85e] shadow-[0_3px_8px_rgba(0,0,0,.32)] backdrop-blur-md">{positionLabel[player.position]}</div>
      <div className="absolute left-1.5 top-7 z-40 grid h-4 w-4 place-items-center rounded-full border border-white/12 bg-[#080d1a]/82 shadow-[0_3px_8px_rgba(0,0,0,.32)] backdrop-blur-md">
        {player.clubLogo ? <img src={player.clubLogo} alt="" className="h-3 w-3 object-contain" draggable={false} /> : <span className="h-2 w-2 rounded-full bg-[#f3ca40]/65" />}
      </div>

      <div className="pointer-events-none relative z-20 mx-auto -mt-5 h-[80px] w-[74px] overflow-visible [transform:translateZ(14px)]">
        {player.photo ? (
          <img src={player.photo} alt={player.name} className="absolute bottom-0 left-1/2 h-[88px] w-[80px] max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_10px_12px_rgba(0,0,0,.58)]" draggable={false} />
        ) : (
          <div className="absolute bottom-0 left-1/2 h-[76px] w-[60px] -translate-x-1/2 rounded-t-[48%] bg-[radial-gradient(circle_at_50%_23%,#c59270_0_17%,#8d6149_18%_30%,#16382f_31%_66%,#091c18_67%)] opacity-95 drop-shadow-[0_9px_11px_rgba(0,0,0,.52)]" />
        )}
      </div>

      <div className="relative z-30 -mt-1 min-w-0 text-center [transform:translateZ(18px)]">
        <div className="rounded-md border border-white/10 bg-[#080d1a]/90 px-1 py-0.5 shadow-[0_6px_14px_rgba(0,0,0,.32)] backdrop-blur-md"><strong className="block truncate text-[9px] font-black leading-tight tracking-[-.02em] text-white">{player.name}</strong></div>
        <div className="mt-1 grid grid-cols-2 gap-1 text-[7px] font-black leading-none">
          <span className="rounded border border-[#f3ca40]/12 bg-black/34 px-1 py-[3px] text-[#ffe676]">{player.price.toFixed(1)}M</span>
          <span className="rounded border border-emerald-300/10 bg-black/34 px-1 py-[3px] text-[#00e676]">{player.points} P</span>
        </div>
      </div>
    </motion.article>
  );
}
