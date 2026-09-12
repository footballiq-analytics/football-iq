"use client";

import { useEffect } from "react";

/** Measure the available squad area; source cards and the portal overlay share these sizes. */
export function useMobileCardGeometry() {
 useEffect(() => {
  const squad = document.querySelector<HTMLElement>(".fiq-team-squad");
  if (!squad) return;
  const properties = ["--fiq-mobile-card-width", "--fiq-mobile-card-height"];
  const old = properties.map(p => document.body.style.getPropertyValue(p));
  function update() {
   if (!squad) return;
   const tabletLandscape = window.matchMedia("(orientation:landscape) and (min-height:601px) and (any-pointer:coarse)").matches;
   const compact = window.matchMedia("(max-width:900px), (orientation:landscape) and (max-height:600px)").matches;
   if (!compact && !tabletLandscape) { properties.forEach(p => document.body.style.removeProperty(p)); return; }
   const short = window.matchMedia("(orientation:landscape) and (max-height:600px)").matches;
   const { width, height } = squad.getBoundingClientRect();
   // Reserve the rails, roof, status and gaps before allocating the four/five card rows.
   const cardHeight = short ? Math.max(34, Math.min(52, Math.floor((height - 64) / 4))) : Math.max(52, Math.min(tabletLandscape ? 92 : 104, Math.floor((height - 110) / 5)));
   const cardWidth = short ? Math.max(30, Math.min(56, Math.floor((width - 8) * .79 / 5 - 8))) : Math.max(44, Math.min(tabletLandscape ? 72 : 76, Math.floor(width * .92 / 5 - 7)));
   document.body.style.setProperty(properties[0], `${cardWidth}px`);
   document.body.style.setProperty(properties[1], `${cardHeight}px`);
  }
  const observer = new ResizeObserver(update);
  observer.observe(squad);
  window.addEventListener("resize", update);
  update();
  return () => {
   observer.disconnect();window.removeEventListener("resize", update);
   properties.forEach((p,i) => old[i] ? document.body.style.setProperty(p, old[i]) : document.body.style.removeProperty(p));
  };
 }, []);
}
