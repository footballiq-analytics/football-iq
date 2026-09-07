import Link from "next/link";

const features=[
  ["Kendi Ligini Kur","Arkadaşlarını davet et, özel liginde yarış."],
  ["Gerçek Maç Verileri","Canlı veri bağlantısı geldiğinde otomatik güncellenir."],
  ["Haftalık Ödüller","Haftalık başarılar ve ödül alanı için hazır yapı."],
  ["Arkadaşlarınla Yarış","Özel ligler ve genel sıralama tek yerde."],
] as const;

const matches=[
  ["Fenerbahçe","Galatasaray","20:00","/matches/fenerbahce-galatasaray"],
  ["Beşiktaş","Trabzonspor","17:00","/matches/besiktas-trabzonspor"],
] as const;

export default function Home(){return <div className="ref-home">
  <section className="ref-hero">
    <div className="hero-stadium-lines"/>
    <div className="ref-hero-copy">
      <span className="demo-chip">DEMO VERİ</span>
      <p className="eyebrow">TRENDYOL SÜPER LİG FANTASY</p>
      <h1>Futbolu Daha <em>Akıllı</em> Yaşa</h1>
      <p>Takımını kur, gerçek maç performanslarından puan kazan, arkadaşlarınla ve Türkiye ile yarış.</p>
      <Link href="/team" className="ref-primary">Hemen Oyna</Link>
    </div>
    <div className="hero-ball" aria-hidden="true"><span/></div>
  </section>

  <section className="feature-grid-ref">{features.map(([title,desc],index)=><article className="feature-card-ref" key={title}><span className="feature-index">0{index+1}</span><div><h2>{title}</h2><p>{desc}</p></div></article>)}</section>

  <section className="home-week-section">
    <div className="ref-section-heading"><div><p className="eyebrow">BU HAFTA</p><h2>Öne Çıkan Maçlar</h2></div><Link href="/today">Tüm maçlar</Link></div>
    <div className="featured-match-grid">{matches.map(([home,away,time,href])=><Link href={href} className="featured-match" key={home}><div className="match-league-row"><span>Süper Lig</span><b>{time}</b></div><div className="match-clubs"><div><span className="crest crest-fb">F</span><strong>{home}</strong></div><small>VS</small><div><span className="crest crest-gs">G</span><strong>{away}</strong></div></div><div className="match-foot"><span>Maç detayını aç</span><b>→</b></div></Link>)}</div>
  </section>
</div>}
