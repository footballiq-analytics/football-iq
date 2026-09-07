"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

function Icon({name}:{name:string}){
  const common={width:20,height:20,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round" as const,strokeLinejoin:"round" as const};
  const paths:Record<string,ReactNode>={
    home:<><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></>,
    leagues:<><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M6 5H4v2a4 4 0 0 0 4 4"/><path d="M18 5h2v2a4 4 0 0 1-4 4"/><path d="M12 12v5"/><path d="M8 20h8"/></>,
    team:<><path d="M5 8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19 8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M1.5 20c.3-4 2.2-6 5.5-6"/><path d="M22.5 20c-.3-4-2.2-6-5.5-6"/><path d="M6.5 22c.4-5 2-7 5.5-7s5.1 2 5.5 7"/></>,
    news:<><path d="M4 5h16v14H4z"/><path d="M7 8h5v4H7z"/><path d="M14 8h3"/><path d="M14 11h3"/><path d="M7 15h10"/></>,
    profile:<><circle cx="12" cy="8" r="4"/><path d="M4 21c.7-5 3.2-7 8-7s7.3 2 8 7"/></>,
    bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M10 19a2 2 0 0 0 4 0"/></>,
    menu:<><path d="M4 7h16M4 12h16M4 17h16"/></>
  };
  return <svg {...common} aria-hidden="true">{paths[name]??paths.home}</svg>;
}

function Crown(){return <svg className="brand-crown" viewBox="0 0 32 24" aria-hidden="true"><path d="M3 20 1 6l8 6 7-10 7 10 8-6-2 14H3Z"/><path d="M4 23h24"/></svg>}

const desktopLinks=[["Ana Sayfa","/"],["Takım Kur","/team"],["Ligler","/leagues/super-lig"],["Maçlar","/today"],["Puan Durumu","/leaderboard"],["İstatistikler","/statistics"],["Haberler","/news"]] as const;

export function Header(){
  const [open,setOpen]=useState(false);
  const pathname=usePathname();
  return <>
    <header className="fiq-header">
      <Link href="/" className="fiq-logo" aria-label="FUTBOL IQ ana sayfa"><Crown/><span>FUTBOL <b>IQ</b></span></Link>
      <nav className="fiq-desktop-nav" aria-label="Ana navigasyon">{desktopLinks.map(([label,href])=><Link className={pathname===href||pathname.startsWith(href+"/")?"active":""} key={href} href={href}>{label}</Link>)}</nav>
      <div className="fiq-header-actions"><button className="icon-only" aria-label="Bildirimler"><Icon name="bell"/></button><Link className="profile-dot" href="/profile">DT</Link><button className="icon-only menu-trigger" onClick={()=>setOpen(true)} aria-label="Menüyü aç"><Icon name="menu"/></button></div>
    </header>
    {open&&<div className="mobile-drawer-backdrop" onClick={()=>setOpen(false)}><aside className="mobile-drawer" onClick={e=>e.stopPropagation()}><div className="drawer-logo"><Crown/><strong>FUTBOL <b>IQ</b></strong></div>{desktopLinks.map(([label,href])=><Link onClick={()=>setOpen(false)} key={href} href={href}>{label}</Link>)}<Link onClick={()=>setOpen(false)} href="/profile">Profil</Link></aside></div>}
  </>;
}

const mobileLinks=[
  ["home","Ana Sayfa","/"],
  ["leagues","Ligler","/leagues/super-lig"],
  ["team","Takım Kur","/team"],
  ["news","Haberler","/news"],
  ["profile","Profil","/profile"],
] as const;

export function BottomNav(){
  const pathname=usePathname();
  return <nav className="fiq-bottom-nav" aria-label="Mobil alt navigasyon">{mobileLinks.map(([icon,label,href])=>{const active=pathname===href||pathname.startsWith(href+"/");return <Link className={active?"active":""} href={href} key={href}><Icon name={icon}/><span>{label}</span></Link>})}</nav>;
}

export function Footer(){return <footer className="fiq-footer"><div><span className="footer-logo">FUTBOL <b>IQ</b></span><small>Strateji. Bilgi. Tutku.</small></div><p>Gerçek veri bağlantısı olmayan bölümler demo olarak işaretlenir. Tahminler kesin sonuç değildir.</p></footer>}
