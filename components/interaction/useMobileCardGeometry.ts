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
   const rowWidth=squad.querySelector(".fiq-pitch-formation")?.getBoundingClientRect().width??width*.79;
   const railsHeight=squad.querySelector(".fiq-pitch-rails")?.getBoundingClientRect().height??28;
   const statusHeight=squad.querySelector(".fiq-team-status")?.getBoundingClientRect().height??14;
   // Four field rows plus the bench, with room for the roof and vertical gaps.
   const cardHeight = short ? Math.max(1, Math.min(57, Math.floor((height - railsHeight - statusHeight - 58) / 5))) : Math.max(52, Math.min(tabletLandscape ? 92 : 104, Math.floor((height - 110) / 5)));
   const cardWidth = short ? Math.max(1, Math.min(44, Math.floor((rowWidth - 12) / 9))) : Math.max(44, Math.min(tabletLandscape ? 72 : 76, Math.floor(width * .92 / 5 - 7)));
   const phonePortrait = window.matchMedia("(max-width:600px) and (orientation:portrait)").matches;
   document.body.style.setProperty(properties[0], `${short ? cardWidth : phonePortrait ? Math.round(cardWidth * .9) : cardWidth}px`);
   document.body.style.setProperty(properties[1], `${short ? cardHeight : phonePortrait ? Math.round(cardHeight * .9) : cardHeight}px`);
  }
  const observer = new ResizeObserver(update);
  observer.observe(squad);
  const field=squad.querySelector(".fiq-pitch-formation");
  if(field)observer.observe(field);
  window.addEventListener("resize", update);
  update();
  return () => {
   observer.disconnect();window.removeEventListener("resize", update);
   properties.forEach((p,i) => old[i] ? document.body.style.setProperty(p, old[i]) : document.body.style.removeProperty(p));
  };
 }, []);
}
