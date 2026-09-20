"use client";
import PlayerPortrait from "./PlayerPortrait";
import { formatFantasyPrice } from "@/lib/fantasy-price";


import { motion } from "framer-motion";
import { resolveFantasyMedia, type FantasyMediaMetadata } from "@/lib/fantasy-media";

export type CardTier = "gold" | "silver" | "bronze";
export type PlayerPosition = "GK" | "DEF" | "MID" | "FWD";

export type FantasyPlayer = {
  id: string | number;
  name: string;
  club: string;
  clubLogo?: string;
  clubLogoMedia?: FantasyMediaMetadata;
  photo?: string;
  photoMedia?: FantasyMediaMetadata;
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
  viceCaptain?: boolean;
  tripleCaptain?: boolean;
  substitute?: boolean;
  compact?: boolean;
  isDragging?: boolean;
  invalidPosition?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
};

const tierStyles: Record<CardTier, string> = {
  gold: "border-[#d7b86a]/50 bg-[#111827] shadow-[0_8px_18px_rgba(0,0,0,.34)]",
  silver: "border-[#8fa1b5]/45 bg-[#111827] shadow-[0_8px_18px_rgba(0,0,0,.32)]",
  bronze: "border-[#b7825f]/45 bg-[#111827] shadow-[0_8px_18px_rgba(0,0,0,.32)]",
};

const positionLabel: Record<PlayerPosition, string> = { GK: "KL", DEF: "DEF", MID: "ORT", FWD: "FOR" };

export default function PlayerCard({ player, tier = "gold", captain = false, viceCaptain = false, tripleCaptain = false, substitute = false, compact = false, isDragging = false, invalidPosition = false, onClick, onRemove }: PlayerCardProps) {
  const badge = tripleCaptain ? "3×" : captain ? "C" : viceCaptain ? "C2" : null;
  const leadershipGlow = viceCaptain
    ? "drop-shadow-[0_0_18px_rgba(67,155,255,.58)]"
    : captain || tripleCaptain
      ? "drop-shadow-[0_0_18px_rgba(255,210,54,.55)]"
      : "";
  const safePhoto = resolveFantasyMedia(player.photo, player.photoMedia);

  return (
    <motion.article
      layout={isDragging ? false : "position"}
      animate={{ scale: 1, opacity: isDragging ? 0.98 : 1, y: 0, rotateX: 0 }}
      whileHover={undefined}
      whileTap={!isDragging ? { scale: 0.985 } : undefined}
      transition={{ type: "spring", stiffness: 390, damping: 28, mass: 0.7 }}
      onClick={onClick}
      style={{ transformPerspective: 900, transformStyle: "preserve-3d" }}
      className={[
        "fiq-player-card group relative isolate select-none overflow-visible [transform-origin:50%_88%]",
        compact ? "h-[110px] w-[86px]" : "h-[134px] w-[102px]",
        leadershipGlow,
        isDragging ? "z-[9999] drop-shadow-[0_26px_34px_rgba(0,0,0,.60)]" : "",
        onClick ? "cursor-pointer" : "",
      ].join(" ")}
      aria-label={`${player.name} oyuncu kartı${invalidPosition ? ", geçersiz mevki" : ""}`}
    >
      <div
        className={[
          "fiq-card-face absolute inset-0 overflow-hidden rounded-[12px] border",
          "[clip-path:none]",
          invalidPosition
            ? "border-rose-300/90 bg-[linear-gradient(155deg,rgba(128,29,37,.99),rgba(67,13,20,.99)_55%,rgba(20,7,10,.99))] ring-2 ring-rose-400/75 shadow-[0_0_34px_rgba(244,63,94,.47)]"
            : tierStyles[tier],
          viceCaptain
            ? "ring-2 ring-[#80bdff]/90 shadow-[0_18px_40px_rgba(0,0,0,.54),0_0_42px_rgba(60,147,255,.52)]"
            : captain || tripleCaptain
              ? "ring-2 ring-[#ffe889]/90 shadow-[0_18px_40px_rgba(0,0,0,.54),0_0_42px_rgba(255,211,74,.58)]"
              : "",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 z-[11] bg-[linear-gradient(180deg,rgba(255,255,255,.02),transparent_42%,rgba(4,9,16,.70)_78%,rgba(4,9,16,.95))]" />
        {substitute ? <span className="fiq-card-substitute absolute right-1.5 top-1.5 z-40 rounded-full border border-[#f3ca40]/30 bg-[#101521]/88 px-1.5 py-0.5 text-[6px] font-black tracking-[.09em] text-[#f7d85e]">YEDEK</span> : null}
        <div className="fiq-card-position absolute left-1.5 top-1.5 z-40 min-w-[30px] rounded-md border-2 border-[#ffe778]/90 bg-[#02070c]/95 px-2 py-[3px] text-center text-[9px] font-black leading-none tracking-[.045em] text-white shadow-[0_0_0_1px_rgba(0,0,0,.8),0_4px_10px_rgba(0,0,0,.55),0_0_10px_rgba(243,202,64,.18)] backdrop-blur-md">{positionLabel[player.position]}</div>
        <div className="fiq-card-portrait pointer-events-none relative z-20 mx-auto mt-1 h-[72px] w-[72px] overflow-hidden rounded-[44%_44%_38%_38%/38%_38%_58%_58%] [transform:translateZ(8px)]">
          <PlayerPortrait key={`${player.id}:${safePhoto??""}`} name={player.name} club={player.club} src={safePhoto}/>
        </div>
        <div className="fiq-card-info relative z-30 -mt-1 min-w-0 px-1.5 text-center [transform:translateZ(18px)]">
          <div className="rounded-md border border-white/15 bg-[#080d1a]/88 px-1 py-0.5"><strong title={player.name} className="fiq-card-name block truncate text-[9px] font-black leading-tight text-white">{player.name}</strong></div>
          <div className="fiq-card-stats mt-1 grid grid-cols-2 gap-1 text-[7px] font-black leading-none"><span className="rounded border border-white/15 bg-black/40 px-1 py-[3px] text-[#ffe676]">{formatFantasyPrice(player.price)}M</span><span className="rounded border border-emerald-300/10 bg-black/40 px-1 py-[3px] text-[#00e676]">{player.points} P</span></div>
        </div>
      </div>

      {invalidPosition ? <span className="absolute -left-1.5 -top-1.5 z-[80] rounded-full border border-rose-200/70 bg-rose-600 px-1.5 py-0.5 text-[6px] font-black text-white shadow-[0_0_16px_rgba(244,63,94,.55)]">MEVKİ HATASI</span> : null}
      {badge ? (
        <span className={[
          "fiq-card-captain absolute -right-2 -top-2 z-[100] grid h-7 w-7 place-items-center rounded-full border text-[10px] font-black shadow-[0_4px_10px_rgba(0,0,0,.45)]",
          viceCaptain && !captain && !tripleCaptain
            ? "border-[#d7ecff] bg-[radial-gradient(circle_at_32%_22%,#f6fbff_0%,#86c4ff_28%,#378de8_64%,#0c3d78_100%)] text-[#031b36] shadow-[0_0_0_3px_rgba(88,169,255,.20),0_0_12px_rgba(188,225,255,.9),0_0_30px_rgba(57,146,239,.85),0_8px_16px_rgba(0,0,0,.55)]"
            : "border-[#fff8c7] bg-[radial-gradient(circle_at_32%_22%,#fffef0_0%,#ffe66d_28%,#d69b13_64%,#6a3f03_100%)] text-[#211400] shadow-[0_0_0_3px_rgba(255,223,91,.20),0_0_12px_rgba(255,245,180,.9),0_0_30px_rgba(255,199,30,.9),0_8px_16px_rgba(0,0,0,.55)]",
        ].join(" ")}>
          {badge}
        </span>
      ) : null}
      {onRemove && !isDragging ? <button type="button" data-card-remove="true" className="fiq-card-remove" aria-label={`${player.name} kadrodan çıkar`} title="Kadrodan çıkar" onPointerDown={e=>e.stopPropagation()} onMouseDown={e=>e.stopPropagation()} onTouchStart={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()} onClick={e=>{e.preventDefault();e.stopPropagation();onRemove()}}>×</button> : null}
    </motion.article>
  );
}

