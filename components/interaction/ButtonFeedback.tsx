"use client";

import { useEffect } from "react";

/** Delegation also covers buttons mounted later inside menus and dialogs. */
export default function ButtonFeedback() {
 useEffect(() => {
  const timers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
  function flash(event: Event) {
   if (event instanceof KeyboardEvent && (event.repeat || !["Enter", " "].includes(event.key))) return;
   const origin = event.target;
   if (!(origin instanceof Element)) return;
   const button = origin.closest<HTMLElement>('button,[role="button"],a[href],select,summary,input[type="submit"],input[type="button"]');
   if (!button || button.matches(':disabled,[aria-disabled="true"]') || button.closest('[inert]')) return;
   const previous = timers.get(button);
   if (previous) clearTimeout(previous);
   button.dataset.fiqPressed = "true";
   timers.set(button, setTimeout(() => { delete button.dataset.fiqPressed; timers.delete(button); }, 240));
  }
  document.addEventListener("pointerdown", flash, true);
  document.addEventListener("keydown", flash, true);
  document.addEventListener("click", flash, true);
  return () => {
   document.removeEventListener("pointerdown", flash, true);
   document.removeEventListener("keydown", flash, true);
   document.removeEventListener("click", flash, true);
   timers.forEach((timer,button) => { clearTimeout(timer); delete button.dataset.fiqPressed; });
  };
 }, []);
 return null;
}
