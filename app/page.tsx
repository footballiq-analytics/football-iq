import Link from "next/link";
import { ScoutVisualButton } from "@/components/site-shell";
import { FANTASY_PLAYER_POOL } from "@/data/fantasy-player-pool";

const base=process.env.NEXT_PUBLIC_BASE_PATH??"";
const positions=[["GK","KL","Kaleci"],["DEF","DEF","Defans"],["MID","ORT","Orta Saha"],["FWD","FOR","Forvet"]] as const;
const weeklyBest=positions.map(([position,short,label])=>({
 position,short,label,
 player:[...FANTASY_PLAYER_POOL].filter(p=>p.position===position).sort((a,b)=>b.points-a.points||b.price-a.price)[0]
}));

function HomeNavIcon({emoji}:{emoji:string}){return <span className="v31-nav-icon" aria-hidden="true">{emoji}</span>}

export default function Home(){
 return <div className="fiq-home-v31">
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
   <section className="v31-analysis"><ScoutVisualButton/></section>

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