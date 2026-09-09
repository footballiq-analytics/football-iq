"use client";

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type LongPressOptions = {
  delay?: number;
  moveTolerance?: number;
};

export function useLongPress(onLongPress?: () => void, options: LongPressOptions = {}) {
  const delay = options.delay ?? 500;
  const moveTolerance = options.moveTolerance ?? 10;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const triggeredRef = useRef(false);

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    startRef.current = null;
  };

  const onPointerDown = (event: ReactPointerEvent) => {
    if (!onLongPress || event.button !== 0) return;
    triggeredRef.current = false;
    startRef.current = { x: event.clientX, y: event.clientY };
    timerRef.current = setTimeout(() => {
      triggeredRef.current = true;
      onLongPress();
      clear();
    }, delay);
  };

  const onPointerMove = (event: ReactPointerEvent) => {
    const start = startRef.current;
    if (!start) return;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > moveTolerance) clear();
  };

  const onPointerUp = () => clear();
  const onPointerCancel = () => clear();
  const onPointerLeave = () => clear();
  const onClickCapture = (event: ReactPointerEvent) => {
    if (!triggeredRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    triggeredRef.current = false;
  };

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onPointerLeave, onClickCapture };
}
