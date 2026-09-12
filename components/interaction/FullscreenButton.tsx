"use client";

import { useEffect, useRef, useState } from "react";

type FullscreenDocument = Document & {
 webkitFullscreenElement?: Element;
 webkitExitFullscreen?: () => Promise<void> | void;
};
type FullscreenRoot = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };

export default function FullscreenButton() {
 const [active, setActive] = useState(false);
 const [message, setMessage] = useState("");
 const help = useRef<HTMLDialogElement>(null);
 useEffect(() => {
  const doc = document as FullscreenDocument;
  const sync = () => setActive(Boolean(doc.fullscreenElement || doc.webkitFullscreenElement));
  sync();
  document.addEventListener("fullscreenchange", sync);
  document.addEventListener("webkitfullscreenchange", sync);
  return () => {
   document.removeEventListener("fullscreenchange", sync);
   document.removeEventListener("webkitfullscreenchange", sync);
  };
 }, []);
 useEffect(() => { if (message && !help.current?.open) help.current?.showModal(); }, [message]);
 async function toggle() {
  const doc = document as FullscreenDocument;
  const root = document.documentElement as FullscreenRoot;
  try {
   if (doc.fullscreenElement || doc.webkitFullscreenElement) {
    if (doc.exitFullscreen) await doc.exitFullscreen();
    else await doc.webkitExitFullscreen?.();
   } else if (root.requestFullscreen && document.fullscreenEnabled) {
    await root.requestFullscreen();
   } else if (root.webkitRequestFullscreen) {
    await root.webkitRequestFullscreen();
   } else {
    const installed = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    setMessage(installed ? "Zaten uygulama görünümündesin; tarayıcı araç çubukları kapalı." : "Bu tarayıcı sayfayı düğmeyle tam ekran açmayı desteklemiyor. iPhone/iPad’de Safari’nin Paylaş menüsünden Ana Ekrana Ekle seçeneğini kullanıp siteyi bu simgeden açabilirsin. Diğer cihazlarda tarayıcının Uygulamayı yükle veya Ana ekrana ekle seçeneğini kullanabilirsin.");
   }
  } catch {
   setMessage("Tarayıcı tam ekran isteğini kabul etmedi. Sayfayı doğrudan Safari veya Chrome’da açıp tekrar deneyebilirsin.");
  }
 }
 return <>
  <button type="button" className="fiq-fullscreen-button" onClick={toggle} aria-pressed={active} aria-label={active ? "Tam ekrandan çık" : "Tam ekranı aç"} title={active ? "Tam ekrandan çık" : "Tam ekran"}>
   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={active ? "M9 3v6H3m12-6v6h6M9 21v-6H3m12 6v-6h6" : "M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6"}/></svg>
   <span>{active ? "ÇIK" : "TAM EKRAN"}</span>
  </button>
  <dialog ref={help} className="fiq-fullscreen-help" onClose={() => setMessage("")} aria-labelledby="fiq-fullscreen-title">
   <h2 id="fiq-fullscreen-title">Tam ekran</h2><p>{message}</p>
   <button type="button" onClick={() => help.current?.close()}>TAMAM</button>
  </dialog>
 </>;
}
