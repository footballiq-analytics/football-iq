"use client";

import { useState } from "react";

type PlayerPortraitProps = { name: string; src: string | null };

// The caller keys this component by player and source so a replacement photo retries.
export default function PlayerPortrait({ name, src }: PlayerPortraitProps) {
  const [failed, setFailed] = useState(false);
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
    .map(part => Array.from(part)[0]).join("").toLocaleUpperCase("tr-TR");

  if (src && !failed) {
    return <img src={src} alt={name} className="h-full w-full object-cover object-[50%_18%]"
      draggable={false} decoding="async" onError={() => setFailed(true)} />;
  }

  return (
    <svg viewBox="0 0 66 62" width="100%" height="100%" aria-hidden="true" focusable="false">
      <rect width="66" height="62" rx="6" fill="#eef5f1" />
      <path d="M22 9 12 13 4 26 15 32 19 25 19 55 47 55 47 25 51 32 62 26 54 13 44 9 39 14 27 14Z"
        fill="#d5e9de" stroke="#8eb6a1" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M27 10Q33 20 39 10" fill="none" stroke="#4d8068" strokeWidth="2" />
      <path d="M21 51H45" stroke="#b0d1bf" strokeWidth="2" />
      <text x="33" y="37" textAnchor="middle" fill="#285b43" fontFamily="Arial,sans-serif"
        fontSize="12" fontWeight="700">{initials || "—"}</text>
    </svg>
  );
}
