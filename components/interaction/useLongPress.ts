"use client";

import { useRef } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";

type LongPressOptions = {
  delay?: number;
  moveTolerance?: number;
};

type PressStart = {
  x: number;
  y: number;
  pointerId: number;
  pointerType: string;
};

export function useLongPress(onLongPress?: () => void, options: LongPressOptions = {}) {
  const delay = options.delay ?? 500;
  const moveTolerance = options.moveTolerance ?? 10;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<PressStart | null>(null);
  const triggeredRef = useRef(false);
  const suppressContextMenuRef = useRef(false);

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    startRef.current = null;
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (!onLongPress || event.button !== 0 || !event.isPrimary) return;

    clear();
    triggeredRef.current = false;
    suppressContextMenuRef.current = event.pointerType === "touch";
    startRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
      pointerType: event.pointerType,
    };

    timerRef.current = setTimeout(() => {
      const start = startRef.current;
      if (!start || start.pointerId !== event.pointerId) return;
      triggeredRef.current = true;
      onLongPress();
      clear();
    }, delay);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const start = startRef.current;
    if (!start || start.pointerId !== event.pointerId) return;

    // iPad/Safari'de sürükleme başlarken uzun basmanın da tetiklenmesini engelle.
    // Touch için toleransı DnD aktivasyon mesafesinin altında tutuyoruz.
    const tolerance = start.pointerType === "touch"
      ? Math.min(moveTolerance, 6)
      : moveTolerance;

    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > tolerance) {
      suppressContextMenuRef.current = false;
      clear();
    }
  };

  const finish = () => {
    suppressContextMenuRef.current = false;
    clear();
  };

  const onPointerUp = () => finish();
  const onPointerCancel = () => finish();
  const onPointerLeave = () => finish();
  const onLostPointerCapture = () => finish();

  const onClickCapture = (event: ReactMouseEvent<HTMLElement>) => {
    if (!triggeredRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    triggeredRef.current = false;
  };

  const onContextMenu = (event: ReactMouseEvent<HTMLElement>) => {
    if (!suppressContextMenuRef.current && !triggeredRef.current) return;
    event.preventDefault();
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
    onLostPointerCapture,
    onClickCapture,
    onContextMenu,
  };
}
