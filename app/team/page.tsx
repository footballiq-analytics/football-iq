const squad = [
  ["Y. En-Nesyri", "Fenerbahçe", "FWD", "₺11.0M", "C"],
  ["Icardi", "Galatasaray", "FWD", "₺12.0M", ""],
  ["Rafa Silva", "Beşiktaş", "FWD", "₺10.5M", ""],
  ["Fred", "Fenerbahçe", "MID", "₺9.5M", ""],
  ["Torreira", "Galatasaray", "MID", "₺9.0M", ""],
  ["Gedson", "Beşiktaş", "MID", "₺8.5M", ""],
  ["Ferdi", "Fenerbahçe", "DEF", "₺8.0M", ""],
  ["Davinson", "Galatasaray", "DEF", "₺8.5M", ""],
  ["Svensson", "Beşiktaş", "DEF", "₺7.5M", ""],
  ["N. Uysal", "Beşiktaş", "DEF", "₺7.0M", ""],
  ["Uğurcan", "Trabzonspor", "GK", "₺7.5M", ""],
] as const;

const market = [
  ["Osimhen", "Galatasaray", "Forvet", "₺12.5M", "9.2"],
  ["Y. En-Nesyri", "Fenerbahçe", "Forvet", "₺11.0M", "8.1"],
  ["Icardi", "Galatasaray", "Forvet", "₺12.0M", "7.8"],
  ["Rafa Silva", "Beşiktaş", "Forvet", "₺10.5M", "7.6"],
  ["Gedson", "Beşiktaş", "Orta Saha", "₺8.5M", "7.4"],
  ["Fred", "Fenerbahçe", "Orta Saha", "₺9.5M", "7.2"],
  ["Torreira", "Galatasaray", "Orta Saha", "₺9.0M", "7.0"],
  ["Ferdi", "Fenerbahçe", "Defans", "₺8.0M", "6.8"],
] as const;

export default function TeamBuilderPage() {
  return (
    <div className="fantasy-page">
      <section className="team-head">
        <div>
          <p className="eyebrow">FANTASY MERKEZİ</p>
          <h1>Takımını Kur</h1>
          <p>Stratejini kur, bütçeni yönet, haftanın kadrosunu hazırla.</p>
        </div>
        <div className="team-summary">
          <div><small>Hafta</small><strong>12</strong></div>
          <div><small>Bütçe</small><strong>₺100M</strong></div>
          <div><small>Kalan</small><strong>₺2.5M</strong></div>
          <div><small>Transfer</small><strong>2 gün 6 sa.</strong></div>
        </div>
      </section>

      <section className="builder-layout">
        <div className="pitch-panel">
          <div className="pitch-toolbar">
            <button className="active">Saha Dizilişi</button>
            <button>Liste Görünümü</button>
            <select aria-label="Diziliş"><option>4-3-3</option><option>4-4-2</option><option>3-5-2</option><option>4-2-3-1</option></select>
          </div>
          <div className="pitch" aria-label="Fantasy takım sahası">
            <div className="pitch-lines" />
            <div className="players-row forwards">{squad.slice(0,3).map((p) => <PlayerCard key={p[0]} player={p}/>)}</div>
            <div className="players-row mids">{squad.slice(3,6).map((p) => <PlayerCard key={p[0]} player={p}/>)}</div>
            <div className="players-row defs">{squad.slice(6,10).map((p) => <PlayerCard key={p[0]} player={p}/>)}</div>
            <div className="players-row keeper">{squad.slice(10,11).map((p) => <PlayerCard key={p[0]} player={p}/>)}</div>
          </div>
          <div className="budget-bar"><span>Kadro değeri</span><strong>₺97.5M / ₺100M</strong><i><b style={{width:"97.5%"}} /></i></div>
        </div>

        <aside className="market-panel">
          <div className="market-tabs"><button className="active">Tümü</button><button>Kaleci</button><button>Defans</button><button>Orta Saha</button><button>Forvet</button></div>
          <input className="player-search" placeholder="Oyuncu ara..." aria-label="Oyuncu ara" />
          <div className="market-filters"><button>Takım: Tümü</button><button>Fiyat</button><button>Puan</button></div>
          <div className="market-list">
            {market.map((p) => <div className="market-player" key={p[0]}><div className="avatar">{p[0].slice(0,1)}</div><div><strong>{p[0]}</strong><small>{p[1]} · {p[2]}</small></div><span>{p[3]}</span><b>{p[4]}</b><button aria-label={`${p[0]} oyuncusunu ekle`}>+</button></div>)}
          </div>
        </aside>
      </section>

      <section className="bench-section">
        <div className="section-head"><div><p className="eyebrow">KADRO</p><h2>Yedek Kulübesi</h2></div><span>4 / 4</span></div>
        <div className="bench-grid">{["Mert", "Emirhan", "Muçi", "Talisca"].map((name, index) => <div className="bench-card" key={name}><div className="avatar">{name[0]}</div><strong>{name}</strong><span>₺{6 + index}.0M</span></div>)}</div>
      </section>

      <section className="fantasy-grid">
        <article className="fantasy-card"><p className="eyebrow">BU HAFTA</p><h2>Fikstür</h2><p>Gerçek veri sağlayıcısı bağlandığında haftanın maçları burada gösterilecek.</p><span className="status-pill">VERİ BAĞLANTISI BEKLENİYOR</span></article>
        <article className="fantasy-card"><p className="eyebrow">KADRO ANALİZİ</p><h2>92 / 100</h2><p>Dengeli pozisyon dağılımı ve kontrollü bütçe kullanımı.</p><div className="analysis-bars"><span>Forvet <b>3/3</b></span><span>Orta Saha <b>3/3</b></span><span>Defans <b>4/4</b></span><span>Kaleci <b>1/1</b></span></div></article>
      </section>
    </div>
  );
}

function PlayerCard({ player }: { player: readonly [string,string,string,string,string] }) {
  return <button className="fantasy-player"><span className="player-badge">{player[2]}</span>{player[4] && <span className="captain">{player[4]}</span>}<div className="player-photo">{player[0].slice(0,1)}</div><strong>{player[0]}</strong><small>{player[1]}</small><b>{player[3]}</b></button>;
}
