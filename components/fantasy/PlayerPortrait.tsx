"use client";

import { useState } from "react";
import { getClubColors } from "@/lib/club-colors";

type PlayerPortraitProps = { name: string; club: string; src: string | null };

// Keyed by player/source at each call site so new photos can retry after a failure.
export default function PlayerPortrait({ name, club, src }: PlayerPortraitProps) {
  const [failed, setFailed] = useState(false);
  const colors = getClubColors(club);
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
    .map(part => Array.from(part)[0]).join("").toLocaleUpperCase("tr-TR");

  if (src && !failed) {
    return <img src={src} alt={name} className="h-full w-full object-cover object-[50%_18%]"
      draggable={false} decoding="async" onError={() => setFailed(true)} />;
  }

  return (
    <svg viewBox="0 0 66 62" width="100%" height="100%" aria-hidden="true" focusable="false" data-club={club}>
      <rect width="66" height="62" rx="6" fill="#edf2f5" />
      <path d="M22 9 12 13 4 26 15 32 19 25 19 55 47 55 47 25 51 32 62 26 54 13 44 9 39 14 27 14Z"
        fill={colors.primary} stroke="#243447" strokeOpacity=".22" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M33 14H39L44 9 54 13 62 26 51 32 47 25V55H33Z" fill={colors.secondary} />
      <path d="M27 10Q33 20 39 10" fill="none" stroke={colors.accent ?? colors.secondary} strokeWidth="2" />
      <rect x="22" y="25" width="22" height="17" rx="4" fill="#f7f9fc" fillOpacity=".96" />
      <text x="33" y="37" textAnchor="middle" fill="#243447" fontFamily="Arial,sans-serif"
        fontSize="11" fontWeight="700">{initials || "—"}</text>
    </svg>
  );
}
