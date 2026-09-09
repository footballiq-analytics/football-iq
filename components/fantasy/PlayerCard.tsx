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
  gold: "border-[#f3ca40]/90 bg-[linear-gradient(155deg,rgba(147,107,20,.98),rgba(74,48,9,.98)_38%,rgba(18,21,27,.99)_76%)] shadow-[0_16px_36px_rgba(0,0,0,.55),0_0_24px_rgba(243,202,64,.25),inset_0_1px_0_rgba(255,244,191,.48)]",
  silver: "border-slate-200/75 bg-[linear-gradient(155deg,rgba(124,137,145,.98),rgba(48,58,64,.98)_40%,rgba(15,19,25,.99)_76%)] shadow-[0_16px_36px_rgba(0,0,0,.52),0_0_20px_rgba(211,227,235,.18),inset_0_1px_0_rgba(255,255,255,.34)]",
  bronze: "border-[#c98957]/85 bg-[linear-gradient(155deg,rgba(132,78,40,.98),rgba(66,35,20,.98)_40%,rgba(17,18,22,.99)_76%)] shadow-[0_16px_36px_rgba(0,0,0,.52),0_0_20px_rgba(201,137,87,.19),inset_0_1px_0_rgba(255,220,191,.26)]",
};

export default function PlayerCard({ player, tier = "gold", captain = false, tripleCaptain = false, substitute = false, compact = false, isDragging = false, invalidPosition = false, onClick }: PlayerCardProps) {
  const badge = tripleCaptain ? "3x" : captain ? "C" : null;

  return (
    <motion.article
      layout="position"
      animate={{ scale: isDragging ? 1.055 : 1, opacity: isDragging ? 0.96 : 1, y: 0, rotateX: isDragging ? 0 : 4 }}
      whileHover={!isDragging ? { y: -5, scale: 1.025, rotateX: 1.5 } : undefined}
      whileTap={!isDragging ? { scale: 0.985 } : undefined}
      transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.72 }}
      onClick={onClick}
      style={{ transformPerspective: 850, transformStyle: "preserve-3d" }}
      className={[
        "relative isolate select-none overflow-visible border backdrop-blur-xl [transform-origin:50%_85%]",
        "[clip-path:polygon(13%_0,87%_0,100%_12%,97%_82%,84%_100%,16%_100%,3%_82%,0_12%)]",
        "before:pointer-events-none before:absolute before:inset-[3px] before:-z-10 before:[clip-path:inherit] before:border before:border-white/10 before:bg-[radial-gradient(circle_at_50%_5%,rgba(255,255,255,.22),transparent_31%),linear-gradient(115deg,rgba(255,255,255,.07),transparent_32%)]",
        "after:pointer-events-none after:absolute after:inset-x-[10%] after:-bottom-2 after:h-3 after:rounded-full after:bg-black/45 after:blur-[5px]",
        compact ? "h-[108px] w-[84px] p-1.5" : "h-[132px] w-[100px] p-2",
        invalidPosition ? "border-rose-300/90 bg-[linear-gradient(155deg,rgba(122,28,36,.99),rgba(65,13,20,.99)_55%,rgba(20,7,10,.99))] ring-2 ring-rose-400/75 shadow-[0_0_32px_rgba(244,63,94,.45),inset_0_0_30px_rgba(244,63,94,.18)]" : tierStyles[tier],
        captain || tripleCaptain ? "ring-1 ring-[#ffe889]/80 shadow-[0_17px_38px_rgba(0,0,0,.52),0_0_30px_rgba(255,211,74,.43)]" : "",
        isDragging ? "z-[9999] drop-shadow-[0_24px_32px_rgba(0,0,0,.58)]" : "",
        onClick ? "cursor-pointer" : "",
      ].join(" ")}
      aria-label={`${player.name} oyuncu kartı${invalidPosition ? ", geçersiz mevki" : ""}`}
    >
      {invalidPosition ? <span className="absolute -left-1.5 -top-1.5 z-40 rounded-full border border-rose-200/70 bg-rose-600 px-1.5 py-0.5 text-[6px] font-black tracking-[.08em] text-white shadow-[0_0_16px_rgba(244,63,94,.55)]">MEVKİ HATASI</span> : null}
      {badge ? <span className="absolute -right-2 -top-2 z-40 grid h-7 min-w-7 place-items-center rounded-full border border-[#fff2a0] bg-[radial-gradient(circle_at_35%_25%,#fff3a1,#d39b19_55%,#6e4506)] px-1 text-[10px] font-black text-[#201500] shadow-[0_0_20px_rgba(255,215,74,.72)]">{badge}</span> : null}
      {substitute ? <span className="absolute left-1.5 top-1.5 z-30 rounded-full border border-[#f3ca40]/35 bg-[#101521]/88 px-1.5 py-0.5 text-[6.5px] font-black tracking-[.09em] text-[#f7d85e]">YEDEK</span> : null}

      <div className="absolute left-1.5 top-1.5 z-30 rounded-md border border-white/10 bg-[#0b1329]/80 px-1 py-0.5 text-[6.5px] font-black text-[#f7d85e] shadow-sm backdrop-blur-md">{player.position}</div>
      <div className="absolute left-1.5 top-7 z-30 grid h-4 w-4 place-items-center rounded-full border border-white/10 bg-[#080d1a]/75 backdrop-blur-md">
        {player.clubLogo ? <img src={player.clubLogo} alt="" className="h-3 w-3 object-contain" draggable={false} /> : <span className="h-2 w-2 rounded-full bg-[#f3ca40]/60" />}
      </div>

      <div className="pointer-events-none relative mx-auto -mt-4 h-[76px] w-[72px] overflow-visible">
        {player.photo ? (
          <img src={player.photo} alt={player.name} className="absolute bottom-0 left-1/2 h-[82px] w-[76px] max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_8px_10px_rgba(0,0,0,.52)]" draggable={false} />
        ) : (
          <div className="absolute bottom-0 left-1/2 h-[72px] w-[58px] -translate-x-1/2 rounded-t-[48%] bg-[radial-gradient(circle_at_50%_23%,#c59270_0_17%,#8d6149_18%_30%,#16382f_31%_66%,#091c18_67%)] opacity-95 drop-shadow-[0_7px_9px_rgba(0,0,0,.48)]" />
        )}
      </div>

      <div className="relative z-20 -mt-1 min-w-0 text-center">
        <div className="rounded-md border border-white/10 bg-[#080d1a]/88 px-1 py-0.5 shadow-[0_5px_12px_rgba(0,0,0,.28)] backdrop-blur-md"><strong className="block truncate text-[9px] font-black leading-tight tracking-[-.02em] text-white">{player.name}</strong></div>
        <div className="mt-1 grid grid-cols-2 gap-1 text-[6.5px] font-black">
          <span className="rounded bg-black/28 px-1 py-0.5 text-[#ffe676]">{player.price.toFixed(1)}M</span>
          <span className="rounded bg-black/28 px-1 py-0.5 text-[#00e676]">{player.points} P</span>
        </div>
      </div>
    </motion.article>
  );
}
