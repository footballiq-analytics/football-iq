"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";

const links = [
  ["Ana Sayfa", "/"],
  ["Kadrom", "/team"],
  ["Transfer", "/transfers"],
  ["Fikstür / Canlı", "/today"],
  ["Ligler", "/leagues/super-lig"],
  ["Sıralamalar", "/leaderboard"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useTheme();

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    addEventListener("keydown", close);
    return () => removeEventListener("keydown", close);
  }, []);

  return (
    <>
      <header className="header fantasy-header">
        <Link href="/" className="brand fantasy-brand"><span>♛</span> FUTBOL <b>IQ</b></Link>
        <nav aria-label="Ana navigasyon">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <button className="icon-button theme" onClick={toggle} aria-label="Tema değiştir">{dark ? "☀" : "◐"}</button>
        <Link href="/profile" className="profile-chip" aria-label="Profil">DT</Link>
        <button className="icon-button mobile-only" onClick={() => setOpen(true)} aria-label="Menüyü aç">☰</button>
      </header>
      {open && (
        <div className="drawer-layer" onClick={() => setOpen(false)}>
          <aside className="drawer" aria-label="Mobil menü" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-top"><span className="brand fantasy-brand">♛ FUTBOL <b>IQ</b></span><button className="icon-button" aria-label="Menüyü kapat" onClick={() => setOpen(false)}>×</button></div>
            {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
            <Link href="/rules" onClick={() => setOpen(false)}>Nasıl Oynanır?</Link>
            <Link href="/statistics" onClick={() => setOpen(false)}>İstatistikler</Link>
          </aside>
        </div>
      )}
    </>
  );
}

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Mobil alt navigasyon">
      {[
        ["⚽", "Kadrom", "/team"],
        ["⇄", "Transfer", "/transfers"],
        ["●", "Fikstür/Canlı", "/today"],
        ["♜", "Ligler", "/leagues/super-lig"],
        ["●", "Profil", "/profile"],
      ].map(([icon, label, href]) => <Link key={label} href={href}><span>{icon}</span>{label}</Link>)}
    </nav>
  );
}

export function Footer() {
  return (
    <footer>
      <div><strong>FUTBOL IQ</strong><p>Strateji. Bilgi. Tutku.</p></div>
      <nav aria-label="Footer"><Link href="/rules">Nasıl Oynanır?</Link><Link href="/statistics">İstatistikler</Link><a href="#">Gizlilik</a><a href="#">Kullanım Şartları</a><a href="#">İletişim</a></nav>
      <p className="disclaimer">FUTBOL IQ özgün bir fantasy football ürünüdür. Gerçek futbol verisi kullanılmadığında ilgili alanlar açıkça demo veya veri bekleniyor olarak işaretlenir.</p>
    </footer>
  );
}
