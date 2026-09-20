import Link from "next/link";
import type { CSSProperties } from "react";
import { ScoutVisualButton } from "@/components/site-shell";
import { FANTASY_PLAYER_POOL } from "@/data/fantasy-player-pool";

const base=process.env.NEXT_PUBLIC_BASE_PATH??"";
const positions=[["GK","KL","Kaleci"],["DEF","DEF","Defans"],["MID","ORT","Orta Saha"],["FWD","FOR","Forvet"]] as const;
const weeklyBest=positions.map(([position,short,label])=>({
 position,short,label,
 player:[...FANTASY_PLAYER_POOL].filter(p=>p.position===position).sort((a,b)=>b.points-a.points||b.price-a.price)[0]
}));

function Shield({style}:{style?:CSSProperties}){return <div className="home-shield" style={style}><svg viewBox="0 0 50 60" aria-hidden="true"><circle cx="25" cy="19" r="8"/><path d="M9 50v-9c0-14 32-14 32 0v9Z"/></svg></div>}
function Stadium(){const spots=[[32,17],[50,12],[68,17],[27,39],[50,36],[73,39],[17,62],[39,60],[61,60],[83,62],[50,82]];return <div className="v31-squad-wrap"><div className="home-stadium" role="img" aria-label="4-3-3 dizilişinde temsili kadro"><span className="home-stadium-motto">KADRONU KUR<br/>SAHAYA ÇIK</span><div className="home-pitch"><svg className="home-pitch-lines" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="#d7f3c0" strokeWidth="2" opacity=".65"><path d="M116 12h368l103 373H13ZM64 201h472M239 12l-8 45h138l-8-45M192 385l12-77h192l12 77M260 12l-3 20h86l-3-20M242 385l4-34h108l4 34"/><ellipse cx="300" cy="201" rx="54" ry="31"/></g></svg>{spots.map(([x,y],i)=><Shield key={i} style={{left:`${x}%`,top:`${y}%`}}/>)}</div><div className="home-bench" style={{backgroundImage:`url(${base}/game-ui/dugout-realistic.webp)`}}>{Array.from({length:4},(_,i)=><Shield key={i}/>)}</div></div></div>}
function HomeNavIcon({emoji}:{emoji:string}){return <span className="v31-nav-icon" aria-hidden="true">{emoji}</span>}

export default function Home(){
 return <div className="fiq-home-v31" style={{"--home-athletes":`url(${base}/game-ui/home-athletes.webp)`,"--home-stadium":`url(${base}/game-ui/stadium-bowl.webp)`} as CSSProperties}>
  <header className="v31-topbar">
   <a href={`${base}/`} className="v31-brand" aria-label="FUTBOL IQ ana sayfa"><span className="v31-crown">♛</span><strong>FUTBOL <b>IQ</b></strong><small>FANTEZİ LİGİ</small></a>
   <nav className="v31-nav" aria-label="Ana sayfa menüsü">
    <a className="active" href={`${base}/`}><HomeNavIcon emoji="🏠"/>Ana Sayfa</a>
    <Link href="/team"><HomeNavIcon emoji="👕"/>Kadro Kur</Link>
    <a href={`${base}/tff-scout.html`}><HomeNavIcon emoji="📊"/>Analiz</a>
    <Link href="/today"><HomeNavIcon emoji="📅"/>Fikstür</Link>
    <Link href="/leagues/super-lig"><HomeNavIcon emoji="🏆"/>Puan Durumu</Link>
   </nav>
   <Link href="/team" className="v31-join">Hemen Katıl</Link>
  </header>

  <main className="v31-main">
   <section className="v31-hero-pair"><div className="v31-analysis"><ScoutVisualButton/></div><Stadium/></section>

   <section className="v31-actions" aria-label="Ana işlemler">
    <Link href="/team" className="v31-action-card v31-action-team">
     <span className="v31-action-emoji" aria-hidden="true">👕</span>
     <span><strong>KADRONU KUR</strong><small>Kendi kadronu oluştur</small></span>
     <b aria-hidden="true">›</b>
    </Link>
    <Link href="/rules" className="v31-action-card v31-action-rules">
     <span className="v31-action-emoji" aria-hidden="true">📄</span>
     <span><strong>OYUN KURALLARI</strong><small>Tüm kuralları incele</small></span>
     <b aria-hidden="true">›</b>
    </Link>
   </section>

   <section className="v31-rule-grid" aria-label="Oyun kuralları özeti">
    <article className="v31-rule v31-rule-budget"><span aria-hidden="true">₺</span><div><strong>₺ 100M</strong><small>Bütçe</small></div></article>
    <article className="v31-rule v31-rule-players"><span aria-hidden="true">👥</span><div><strong>15</strong><small>Oyuncu · 11 + 4</small></div></article>
    <article className="v31-rule v31-rule-club"><span aria-hidden="true">🛡️</span><div><small>Kulüp Başına</small><strong>En Fazla 3</strong></div></article>
    <article className="v31-rule v31-rule-captain"><span aria-hidden="true">👑</span><div><strong>Kaptan ×2</strong><small>Puan</small></div></article>
   </section>

   <section className="v31-weekly">
    <div className="v31-section-title">
     <div><span aria-hidden="true">🏆</span><div><h2>HAFTANIN OYUNCULARI</h2><p>Bu haftanın öne çıkan isimleri</p></div></div>
     <Link href="/team">Tümünü Gör <b aria-hidden="true">→</b></Link>
    </div>
    <div className="v31-player-grid">
     {weeklyBest.map(({short,label,player},i)=><Link href="/team" key={short} className={`v31-player v31-player-${i}`}>
       <span className="v31-pos">{short}</span>
       <div className="v31-player-photo" aria-hidden="true"/>
       <h3>{player?.name??label}</h3>
       <p>{player?.club??"Süper Lig"}</p>
       <strong>{player?.points&&player.points>0?player.points.toFixed(1):"—"}</strong>
       <small>Fantasy Puanı</small>
       <em>{player? `${player.price.toFixed(1)}M · ${label}` : label}</em>
      </Link>)}
    </div>
   </section>

   <section className="v31-benefits" aria-label="FUTBOL IQ avantajları">
    <div><span>📊</span><b>Veriye Dayalı<br/>Analizler</b></div>
    <div><span>🛡️</span><b>Stratejik<br/>Kararlar</b></div>
    <div><span>🏆</span><b>Rekabetçi<br/>Lig Deneyimi</b></div>
    <div><span>👥</span><b>Sen de Katıl<br/>Futbol IQ Ailesine</b></div>
   </section>

   <footer className="v31-footer"><strong>FUTBOL <b>IQ</b></strong><span>Sadece Bir Oyun Değil,<br/>Bir Zihin Oyunu</span></footer>
  </main>
 </div>
}