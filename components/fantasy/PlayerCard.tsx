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

const clubThemes: Record<string,string> = {
  Galatasaray: "border-[#ffd21c]/95 bg-[linear-gradient(150deg,#f6c800_0%,#c62828_48%,#6f1111_100%)] shadow-[0_18px_38px_rgba(0,0,0,.58),0_0_28px_rgba(255,205,30,.30),inset_0_1px_0_rgba(255,246,181,.40)]",
  Fenerbahçe: "border-[#ffd51e]/95 bg-[linear-gradient(150deg,#f5ce16_0%,#153a76_50%,#07172f_100%)] shadow-[0_18px_38px_rgba(0,0,0,.58),0_0_28px_rgba(255,213,30,.26),inset_0_1px_0_rgba(255,247,190,.38)]",
  Beşiktaş: "border-white/90 bg-[linear-gradient(150deg,#f5f5f5_0%,#555_23%,#111_58%,#020202_100%)] shadow-[0_18px_38px_rgba(0,0,0,.62),0_0_24px_rgba(255,255,255,.18),inset_0_1px_0_rgba(255,255,255,.50)]",
  Trabzonspor: "border-[#7fc7f1]/90 bg-[linear-gradient(150deg,#7cc8ef_0%,#7f183b_48%,#351020_100%)] shadow-[0_18px_38px_rgba(0,0,0,.58),0_0_25px_rgba(105,190,240,.22)]",
  "Corendon Alanyaspor": "border-[#ff7a22]/90 bg-[linear-gradient(150deg,#ff7a22_0%,#1b1b1b_48%,#060606_100%)] shadow-[0_18px_38px_rgba(0,0,0,.58),0_0_24px_rgba(255,122,34,.22)]",
  Alanyaspor: "border-[#ff7a22]/90 bg-[linear-gradient(150deg,#ff7a22_0%,#1b1b1b_48%,#060606_100%)] shadow-[0_18px_38px_rgba(0,0,0,.58),0_0_24px_rgba(255,122,34,.22)]",
  Göztepe: "border-[#f0d325]/90 bg-[linear-gradient(150deg,#e9d31f_0%,#c91524_50%,#620b12_100%)] shadow-[0_18px_38px_rgba(0,0,0,.58),0_0_24px_rgba(240,211,37,.22)]",
  Samsunspor: "border-white/85 bg-[linear-gradient(150deg,#f5f5f5_0%,#d21d2b_46%,#6e0f17_100%)] shadow-[0_18px_38px_rgba(0,0,0,.58),0_0_24px_rgba(215,35,48,.24)]",
  Konyaspor: "border-[#d8fff0]/85 bg-[linear-gradient(150deg,#f5fff9_0%,#0b8d54_46%,#06492f_100%)] shadow-[0_18px_38px_rgba(0,0,0,.58),0_0_24px_rgba(38,190,119,.22)]",
  "Tümosan Konyaspor": "border-[#d8fff0]/85 bg-[linear-gradient(150deg,#f5fff9_0%,#0b8d54_46%,#06492f_100%)] shadow-[0_18px_38px_rgba(0,0,0,.58),0_0_24px_rgba(38,190,119,.22)]",
  Kasımpaşa: "border-white/85 bg-[linear-gradient(150deg,#f6f6f6_0%,#1f4f9a_48%,#0b2248_100%)] shadow-[0_18px_38px_rgba(0,0,0,.58),0_0_24px_rgba(75,133,214,.22)]",
  "İstanbul Başakşehir FK": "border-[#ff8a2a]/90 bg-[linear-gradient(150deg,#ff8a2a_0%,#173d73_48%,#09192f_100%)] shadow-[0_18px_38px_rgba(0,0,0,.58),0_0_24px_rgba(255,138,42,.22)]",
};

const positionLabel: Record<PlayerPosition, string> = { GK: "KL", DEF: "DEF", MID: "ORT", FWD: "FOR" };

export default function PlayerCard({ player, tier = "gold", captain = false, tripleCaptain = false, substitute = false, compact = false, isDragging = false, invalidPosition = false, onClick }: PlayerCardProps) {
  const badge = tripleCaptain ? "3×" : captain ? "C" : null;
  const clubStyle = clubThemes[player.club] ?? tierStyles[tier];

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
        "group relative isolate select-none overflow-visible [transform-origin:50%_88%]",
        compact ? "h-[110px] w-[86px]" : "h-[134px] w-[102px]",
        captain || tripleCaptain ? "drop-shadow-[0_0_18px_rgba(255,210,54,.55)]" : "",
        isDragging ? "z-[9999] drop-shadow-[0_26px_34px_rgba(0,0,0,.60)]" : "",
        onClick ? "cursor-pointer" : "",
      ].join(" ")}
      aria-label={`${player.name} oyuncu kartı${invalidPosition ? ", geçersiz mevki" : ""}`}
    >
      <div
        className={[
          "absolute inset-0 overflow-hidden border backdrop-blur-xl",
          "[clip-path:polygon(13%_0,87%_0,100%_12%,97%_82%,84%_100%,16%_100%,3%_82%,0_12%)]",
          invalidPosition
            ? "border-rose-300/90 bg-[linear-gradient(155deg,rgba(128,29,37,.99),rgba(67,13,20,.99)_55%,rgba(20,7,10,.99))] ring-2 ring-rose-400/75 shadow-[0_0_34px_rgba(244,63,94,.47)]"
            : clubStyle,
          captain || tripleCaptain ? "ring-2 ring-[#ffe889]/90 shadow-[0_18px_40px_rgba(0,0,0,.54),0_0_42px_rgba(255,211,74,.58)]" : "",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-[1px] z-10 bg-[linear-gradient(120deg,transparent_8%,rgba(255,255,255,.22)_21%,transparent_34%,transparent_66%,rgba(255,255,255,.10)_82%,transparent_94%)] opacity-55 transition-opacity group-hover:opacity-90" />
        <div className="pointer-events-none absolute inset-0 z-[11] bg-[linear-gradient(180deg,rgba(255,255,255,.08),transparent_26%,rgba(0,0,0,.18)_80%,rgba(0,0,0,.35))]" />
        {substitute ? <span className="absolute right-1.5 top-1.5 z-40 rounded-full border border-[#f3ca40]/30 bg-[#101521]/88 px-1.5 py-0.5 text-[6px] font-black tracking-[.09em] text-[#f7d85e]">YEDEK</span> : null}
        <div className="absolute left-1.5 top-1.5 z-40 rounded-md border border-white/25 bg-[#07111d]/90 px-1.5 py-[2px] text-[8px] font-black leading-none tracking-[.04em] text-white shadow-[0_3px_9px_rgba(0,0,0,.45)] backdrop-blur-md">{positionLabel[player.position]}</div>
        {player.clubLogo ? <div className="absolute left-1.5 top-7 z-40 grid h-4 w-4 place-items-center"><img src={player.clubLogo} alt="" className="h-4 w-4 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,.45)]" draggable={false} /></div> : null}
        <div className="pointer-events-none relative z-20 mx-auto -mt-3 h-[78px] w-[74px] overflow-visible pt-1 [transform:translateZ(14px)]">
          {player.photo ? <img src={player.photo} alt={player.name} className="absolute bottom-0 left-1/2 h-[88px] w-[80px] max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_10px_12px_rgba(0,0,0,.58)]" draggable={false} /> : <div className="absolute bottom-0 left-1/2 h-[76px] w-[60px] -translate-x-1/2 rounded-t-[48%] bg-[radial-gradient(circle_at_50%_23%,#c59270_0_17%,#8d6149_18%_30%,#16382f_31%_66%,#091c18_67%)] opacity-95 drop-shadow-[0_9px_11px_rgba(0,0,0,.52)]" />}
        </div>
        <div className="relative z-30 -mt-1 min-w-0 px-1.5 text-center [transform:translateZ(18px)]">
          <div className="rounded-md border border-white/15 bg-[#080d1a]/88 px-1 py-0.5"><strong className="block truncate text-[9px] font-black leading-tight text-white">{player.name}</strong></div>
          <div className="mt-1 grid grid-cols-2 gap-1 text-[7px] font-black leading-none"><span className="rounded border border-white/15 bg-black/40 px-1 py-[3px] text-[#ffe676]">{player.price.toFixed(1)}M</span><span className="rounded border border-emerald-300/10 bg-black/40 px-1 py-[3px] text-[#00e676]">{player.points} P</span></div>
        </div>
      </div>

      {invalidPosition ? <span className="absolute -left-1.5 -top-1.5 z-[80] rounded-full border border-rose-200/70 bg-rose-600 px-1.5 py-0.5 text-[6px] font-black text-white shadow-[0_0_16px_rgba(244,63,94,.55)]">MEVKİ HATASI</span> : null}
      {badge ? (
        <span className="absolute -right-[18px] -top-[18px] z-[100] grid h-10 w-10 place-items-center rounded-full border-2 border-[#fff8c7] bg-[radial-gradient(circle_at_32%_22%,#fffef0_0%,#ffe66d_28%,#d69b13_64%,#6a3f03_100%)] text-[15px] font-black text-[#211400] shadow-[0_0_0_3px_rgba(255,223,91,.20),0_0_12px_rgba(255,245,180,.9),0_0_30px_rgba(255,199,30,.9),0_8px_16px_rgba(0,0,0,.55)]">
          {badge}
        </span>
      ) : null}
    </motion.article>
  );
}
