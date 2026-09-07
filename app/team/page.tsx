const squad = [
  ["Osimhen", "Galatasaray", "FWD", "11.5K", "C"],
  ["Vlahović", "Beşiktaş", "FWD", "11.0K", ""],
  ["Y. En-Nesyri", "Fenerbahçe", "FWD", "9.2K", ""],
  ["Talisca", "Fenerbahçe", "MID", "9.0K", ""],
  ["Rafa Silva", "Beşiktaş", "MID", "8.6K", ""],
  ["Torreira", "Galatasaray", "MID", "7.4K", ""],
  ["Davinson", "Galatasaray", "DEF", "7.1K", ""],
  ["Svensson", "Beşiktaş", "DEF", "5.9K", ""],
  ["Emirhan", "Beşiktaş", "DEF", "5.4K", ""],
  ["Mert Müldür", "Fenerbahçe", "DEF", "5.2K", ""],
  ["Uğurcan", "Galatasaray", "GK", "6.3K", ""],
] as const;

const market = [
  ["Osimhen", "Galatasaray", "Forvet", "11.5K", "9.2"],
  ["Vlahović", "Beşiktaş", "Forvet", "11.0K", "8.9"],
  ["Y. En-Nesyri", "Fenerbahçe", "Forvet", "9.2K", "8.1"],
  ["Talisca", "Fenerbahçe", "Orta Saha", "9.0K", "7.9"],
  ["Rafa Silva", "Beşiktaş", "Orta Saha", "8.6K", "7.6"],
  ["Torreira", "Galatasaray", "Orta Saha", "7.4K", "7.0"],
  ["Davinson", "Galatasaray", "Defans", "7.1K", "6.9"],
  ["Svensson", "Beşiktaş", "Defans", "5.9K", "6.5"],
  ["Mert Müldür", "Fenerbahçe", "Defans", "5.2K", "6.3"],
  ["Mert Günok", "Beşiktaş", "Kaleci", "5.8K", "6.4"],
] as const;

export default function TeamBuilderPage() {
  return (
    <div className="fantasy-page">
      <section className="team-head">
        <div>
          <p className="eyebrow">FANTASY MERKEZİ</p>
          <h1>Takımını Kur</h1>
          <p>90K bütçeni yönet, aynı kulüpten en fazla 4 oyuncu seç ve kaptanınla puanını ikiye katla.</p>
        </div>
        <div className="team-summary">
          <div><small>Hafta</small><strong>12</strong></div>
          <div><small>Başlangıç Bütçesi</small><strong>90K</strong></div>
          <div><small>Kulüp Limiti</small><strong>4</strong></div>
          <div><small>Kaptan</small><strong>x2</strong></div>
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
          <div className="budget-bar"><span>Başlangıç bütçesi</span><strong>90K</strong><i><b style={{width:"76%"}} /></i></div>
          <p className="subtle">Fiyatlar FUTBOL IQ oyun içi değerleridir; gerçek transfer piyasa değerleri değildir.</p>
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
        <div className="bench-grid">{[["Mert", "4.8K"],["Emirhan", "4.4K"],["Muçi", "6.2K"],["Semih", "6.0K"]].map(([name, price]) => <div className="bench-card" key={name}><div className="avatar">{name[0]}</div><strong>{name}</strong><span>{price}</span></div>)}</div>
      </section>

      <section className="fantasy-grid">
        <article className="fantasy-card"><p className="eyebrow">OYUN KURALI</p><h2>90K bütçe · 4 oyuncu limiti</h2><p>Her gerçek kulüpten en fazla dört futbolcu kadroya eklenebilir.</p><span className="status-pill">AKTİF KURAL</span></article>
        <article className="fantasy-card"><p className="eyebrow">KAPTAN</p><h2>x2 puan</h2><p>Kaptan olarak seçilen oyuncunun haftalık fantasy puanı ikiyle çarpılır.</p><span className="status-pill">AKTİF KURAL</span></article>
      </section>
    </div>
  );
}

function PlayerCard({ player }: { player: readonly [string,string,string,string,string] }) {
  return <button className="fantasy-player"><span className="player-badge">{player[2]}</span>{player[4] && <span className="captain">{player[4]} ×2</span>}<div className="player-photo">{player[0].slice(0,1)}</div><strong>{player[0]}</strong><small>{player[1]}</small><b>{player[3]}</b></button>;
}
