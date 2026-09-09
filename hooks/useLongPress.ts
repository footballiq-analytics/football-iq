"use client";
import { useRef } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";

type Options = { delay?: number; moveTolerance?: number };

export function useLongPress(callback?: () => void, options: Options = {}) {
  const { delay = 500, moveTolerance = 9 } = options;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const fired = useRef(false);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    start.current = null;
  };

  return {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      fired.current = false;
      start.current = { x: event.clientX, y: event.clientY };
      if (!callback) return;
      timer.current = setTimeout(() => {
        fired.current = true;
        callback();
        if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(10);
      }, delay);
    },
    onPointerMove: (event: ReactPointerEvent<HTMLElement>) => {
      if (!start.current) return;
      const dx = event.clientX - start.current.x;
      const dy = event.clientY - start.current.y;
      if (Math.hypot(dx, dy) > moveTolerance) clear();
    },
    onPointerUp: clear,
    onPointerCancel: clear,
    onPointerLeave: clear,
    onClickCapture: (event: ReactMouseEvent<HTMLElement>) => {
      if (!fired.current) return;
      event.preventDefault();
      event.stopPropagation();
      fired.current = false;
    },
  };
}
