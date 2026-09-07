import Link from "next/link";

const fixtures = [
  ["Fenerbahçe", "Galatasaray", "Bugün 20:00"],
  ["Beşiktaş", "Trabzonspor", "Yarın 19:00"],
  ["Başakşehir", "Kasımpaşa", "Yarın 20:00"],
];

const popular = [
  ["Osimhen", "Galatasaray", "%68"],
  ["Y. En-Nesyri", "Fenerbahçe", "%62"],
  ["Rafa Silva", "Beşiktaş", "%49"],
  ["Uğurcan", "Trabzonspor", "%47"],
];

export default function Home() {
  return (
    <div className="fantasy-home">
      <section className="fantasy-hero">
        <div className="hero-copy">
          <p className="eyebrow">FANTASY FOOTBALL · FUTBOL IQ</p>
          <h1>Futbolu Daha <em>Akıllı</em> Yaşa.</h1>
          <p>Takımını kur, bütçeni yönet, gerçek performanslardan puan kazan ve arkadaşlarınla yarış.</p>
          <div className="hero-actions"><Link className="primary-cta" href="/team">Takımını Kur →</Link><Link className="secondary-cta" href="/rules">Nasıl Oynanır?</Link></div>
          <div className="hero-benefits"><span>⚽ Gerçek maç verileri</span><span>🏆 Özel ligler</span><span>📊 FUTBOL IQ Score</span><span>📱 Her ekranda uyumlu</span></div>
        </div>
        <div className="hero-board">
          <div className="hero-board-top"><span>12. HAFTA</span><b>₺100M BÜTÇE</b></div>
          <div className="mini-pitch">
            <div className="mini-row three"><i>YEN</i><i>ICR</i><i>RAF</i></div>
            <div className="mini-row three"><i>FRE</i><i>TOR</i><i>GED</i></div>
            <div className="mini-row four"><i>FER</i><i>DAV</i><i>SVE</i><i>NUY</i></div>
            <div className="mini-row one"><i>UĞR</i></div>
          </div>
          <Link href="/team">Kadroyu düzenle</Link>
        </div>
      </section>

      <section className="home-kpis">
        <div><strong>92</strong><span>Kadro IQ</span></div><div><strong>82</strong><span>Haftalık Puan</span></div><div><strong>1.245</strong><span>Genel Sıra</span></div><div><strong>2</strong><span>Ücretsiz Transfer</span></div>
      </section>

      <section className="fantasy-dashboard">
        <article className="fantasy-card">
          <div className="section-head"><div><p className="eyebrow">TRENDYOL SÜPER LİG</p><h2>Bu Hafta</h2></div><Link href="/today">Tüm maçlar →</Link></div>
          <div className="fixture-list">{fixtures.map(([home,away,time]) => <div className="fixture-row" key={`${home}-${away}`}><span>{time}</span><strong>{home}</strong><b>–</b><strong>{away}</strong></div>)}</div>
          <p className="data-note">Demo fikstür — gerçek veri bağlantısı aktif olduğunda otomatik güncellenecek.</p>
        </article>

        <article className="fantasy-card">
          <div className="section-head"><div><p className="eyebrow">OYUNCULAR</p><h2>Haftanın Gözdesi</h2></div><Link href="/transfers">Tümünü gör →</Link></div>
          <div className="popular-list">{popular.map(([name,club,rate],index) => <div className="popular-row" key={name}><b>{index+1}</b><div className="avatar">{name[0]}</div><span><strong>{name}</strong><small>{club}</small></span><em>{rate}</em></div>)}</div>
        </article>

        <article className="fantasy-card leaderboard-card">
          <div className="section-head"><div><p className="eyebrow">REKABET</p><h2>Genel Sıralama</h2></div><Link href="/leaderboard">Tüm sıralama →</Link></div>
          {["KartalPencesi", "Cimbom1905", "Firtina61", "AnadoluGucu", "BogazinEfendisi"].map((team,index)=><div className="leader-row" key={team}><b>{index+1}</b><span>{team}</span><strong>{1243-index*31}</strong></div>)}
          <div className="leader-row you"><b>—</b><span>Senin Takımın</span><strong>—</strong></div>
        </article>
      </section>

      <section className="promo-grid">
        <article className="promo-card big"><p className="eyebrow">KADRO</p><h2>Hayalindeki Kadroyu Kur</h2><p>Bütçeni yönet, doğru transferleri yap, haftanın yıldızlarını erken keşfet.</p><Link className="primary-cta" href="/team">Hemen Oyna →</Link></article>
        <article className="promo-card"><p className="eyebrow">NEDEN FUTBOL IQ?</p><h2>Sadece puan değil, futbol zekâsı.</h2><p>Form, fikstür, performans ve stratejiyi tek bir fantasy deneyiminde birleştiriyoruz.</p></article>
      </section>
    </div>
  );
}
