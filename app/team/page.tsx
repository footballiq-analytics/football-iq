"use client";

import { useMemo, useState } from "react";

type Position = "GK" | "DEF" | "MID" | "FWD";
type Player = {
  id: number;
  name: string;
  club: string;
  position: Position;
  price: number;
  points: number;
  form: number;
};

const players: Player[] = [
  { id: 1, name: "Osimhen", club: "Galatasaray", position: "FWD", price: 11.5, points: 82, form: 9.2 },
  { id: 2, name: "Vlahović", club: "Beşiktaş", position: "FWD", price: 11.0, points: 77, form: 8.9 },
  { id: 3, name: "En-Nesyri", club: "Fenerbahçe", position: "FWD", price: 9.2, points: 69, form: 8.1 },
  { id: 4, name: "Rafa Silva", club: "Beşiktaş", position: "MID", price: 8.6, points: 66, form: 7.8 },
  { id: 5, name: "Talisca", club: "Fenerbahçe", position: "MID", price: 9.0, points: 64, form: 7.7 },
  { id: 6, name: "Torreira", club: "Galatasaray", position: "MID", price: 7.4, points: 60, form: 7.3 },
  { id: 7, name: "Gedson", club: "Beşiktaş", position: "MID", price: 7.2, points: 58, form: 7.1 },
  { id: 8, name: "Fred", club: "Fenerbahçe", position: "MID", price: 7.8, points: 57, form: 7.0 },
  { id: 9, name: "Davinson", club: "Galatasaray", position: "DEF", price: 7.1, points: 55, form: 6.9 },
  { id: 10, name: "Svensson", club: "Beşiktaş", position: "DEF", price: 5.9, points: 49, form: 6.5 },
  { id: 11, name: "Mert Müldür", club: "Fenerbahçe", position: "DEF", price: 5.2, points: 46, form: 6.3 },
  { id: 12, name: "Abdülkerim", club: "Galatasaray", position: "DEF", price: 6.5, points: 51, form: 6.6 },
  { id: 13, name: "Uğurcan", club: "Galatasaray", position: "GK", price: 6.3, points: 48, form: 6.4 },
  { id: 14, name: "Mert Günok", club: "Beşiktaş", position: "GK", price: 5.8, points: 45, form: 6.2 },
  { id: 15, name: "İrfan Can", club: "Fenerbahçe", position: "GK", price: 5.2, points: 42, form: 6.0 },
  { id: 16, name: "Semih", club: "Beşiktaş", position: "FWD", price: 6.0, points: 44, form: 6.1 },
  { id: 17, name: "Muçi", club: "Beşiktaş", position: "MID", price: 6.2, points: 43, form: 6.0 },
  { id: 18, name: "Eren", club: "Trabzonspor", position: "DEF", price: 4.8, points: 41, form: 5.9 },
  { id: 19, name: "Okay", club: "Trabzonspor", position: "MID", price: 5.4, points: 39, form: 5.8 },
  { id: 20, name: "Onuachu", club: "Trabzonspor", position: "FWD", price: 8.1, points: 54, form: 6.8 },
];

const initialXI = [1, 2, 3, 4, 6, 8, 9, 10, 11, 18, 14];
const initialBench = [15, 12, 17, 20];
const jokerCards = [
  ["Yedek Güç", "4 yedeğin puanı da haftalık toplam puana eklenir."],
  ["Kaptan Çiftle", "Kaptanın puan çarpanı o hafta 3x olur."],
  ["Sınırsız Transfer", "Transfer sayısı sınırı ve transfer cezası o hafta kaldırılır."],
  ["Altın Yedek", "Oynamayan asilin yerine uygun yedek otomatik devreye girer."],
] as const;

export default function TeamBuilderPage() {
  const [xi, setXi] = useState<number[]>(initialXI);
  const [bench, setBench] = useState<number[]>(initialBench);
  const [captain, setCaptain] = useState(1);
  const [viceCaptain, setViceCaptain] = useState(2);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<"ALL" | Position>("ALL");
  const [message, setMessage] = useState("Kadron hazır. Oyuncu kartlarına dokunarak kaptan ve ikinci kaptanı yönetebilirsin.");

  const selected = [...xi, ...bench];
  const squadPlayers = selected.map((id) => players.find((p) => p.id === id)!).filter(Boolean);
  const spent = squadPlayers.reduce((sum, p) => sum + p.price, 0);
  const remaining = 100 - spent;

  const filteredPlayers = useMemo(() => players.filter((p) => {
    const matchesQuery = `${p.name} ${p.club}`.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr"));
    const matchesPosition = position === "ALL" || p.position === position;
    return matchesQuery && matchesPosition;
  }), [query, position]);

  function clubCount(club: string) {
    return squadPlayers.filter((p) => p.club === club).length;
  }

  function addPlayer(player: Player) {
    if (selected.includes(player.id)) return setMessage(`${player.name} zaten kadroda.`);
    if (selected.length >= 15) return setMessage("Kadro 15 oyuncuya ulaştı. Önce bir oyuncu çıkarmalısın.");
    if (clubCount(player.club) >= 3) return setMessage(`${player.club} için 3 oyuncu sınırına ulaştın.`);
    if (remaining < player.price) return setMessage(`${player.name} için bütçe yetersiz.`);

    if (xi.length < 11) setXi((v) => [...v, player.id]);
    else setBench((v) => [...v, player.id]);
    setMessage(`${player.name} kadroya eklendi.`);
  }

  function removePlayer(id: number) {
    const name = players.find((p) => p.id === id)?.name ?? "Oyuncu";
    setXi((v) => v.filter((x) => x !== id));
    setBench((v) => v.filter((x) => x !== id));
    if (captain === id) setCaptain(0);
    if (viceCaptain === id) setViceCaptain(0);
    setMessage(`${name} kadrodan çıkarıldı.`);
  }

  function setRole(id: number) {
    if (captain !== id) {
      setCaptain(id);
      if (viceCaptain === id) setViceCaptain(0);
      return setMessage(`${players.find((p) => p.id === id)?.name} kaptan seçildi. Haftalık puanı x2.`);
    }
    setViceCaptain(id);
    setCaptain(0);
    setMessage(`${players.find((p) => p.id === id)?.name} ikinci kaptan seçildi.`);
  }

  return (
    <div className="fantasy-page pro-team-page">
      <section className="stadium-strip">
        <div>
          <span className="live-dot" /> TRENDYOL SÜPER LİG FANTASY
        </div>
        <strong>HAFTA 5 · KADRO KİLİDİNE 2 GÜN 6 SAAT</strong>
      </section>

      <section className="team-command-bar">
        <div>
          <p className="eyebrow">KADROM</p>
          <h1>Takımını Kur</h1>
          <p>15 kişilik kadronu kur, kaptanını belirle ve haftaya hazır ol.</p>
        </div>
        <div className="command-kpis">
          <div><small>Bütçe</small><strong>100.0 M₺</strong></div>
          <div><small>Harcanan</small><strong>{spent.toFixed(1)} M₺</strong></div>
          <div><small>Kalan</small><strong className={remaining < 0 ? "danger-text" : "money-text"}>{remaining.toFixed(1)} M₺</strong></div>
          <div><small>Kadro</small><strong>{selected.length}/15</strong></div>
        </div>
      </section>

      <div className="rule-ribbon">
        <span>✓ Kulüp başına en fazla 3 oyuncu</span>
        <span>✓ 11 Asil + 4 Yedek</span>
        <span>✓ Kaptan x2</span>
        <span>✓ VC, kaptan oynamazsa x2 devralır</span>
      </div>

      <section className="pro-builder-grid">
        <div className="squad-column">
          <div className="squad-toolbar">
            <div className="formation-switch"><button className="active">4-3-3</button><button>4-4-2</button><button>3-5-2</button></div>
            <button className="ghost-action">↻ Otomatik Kadro</button>
          </div>

          <div className="stadium-pitch-wrap">
            <div className="stadium-glow" />
            <div className="pro-pitch">
              <div className="pitch-markings" />
              <div className="pitch-row attack">{xi.slice(0, 3).map((id) => <PitchPlayer key={id} id={id} captain={captain} vice={viceCaptain} onRole={setRole} onRemove={removePlayer} />)}</div>
              <div className="pitch-row midfield">{xi.slice(3, 6).map((id) => <PitchPlayer key={id} id={id} captain={captain} vice={viceCaptain} onRole={setRole} onRemove={removePlayer} />)}</div>
              <div className="pitch-row defense">{xi.slice(6, 10).map((id) => <PitchPlayer key={id} id={id} captain={captain} vice={viceCaptain} onRole={setRole} onRemove={removePlayer} />)}</div>
              <div className="pitch-row goal">{xi.slice(10, 11).map((id) => <PitchPlayer key={id} id={id} captain={captain} vice={viceCaptain} onRole={setRole} onRemove={removePlayer} />)}</div>
            </div>
          </div>

          <div className="bench-zone">
            <div className="bench-title"><div><p className="eyebrow">YEDEK KULÜBESİ</p><h2>1 Kaleci + 3 Saha Oyuncusu</h2></div><span>{bench.length}/4</span></div>
            <div className="pro-bench-grid">
              {bench.map((id, index) => <BenchPlayer key={id} id={id} order={index + 1} onRemove={removePlayer} />)}
            </div>
          </div>

          <div className="status-message">{message}</div>
        </div>

        <aside className="player-market-pro">
          <div className="market-heading">
            <div><p className="eyebrow">TRANSFER MERKEZİ</p><h2>Oyuncular</h2></div>
            <span>{players.length} oyuncu</span>
          </div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="pro-search" placeholder="Oyuncu veya takım ara..." />
          <div className="position-tabs">
            {(["ALL", "GK", "DEF", "MID", "FWD"] as const).map((pos) => <button key={pos} className={position === pos ? "active" : ""} onClick={() => setPosition(pos)}>{pos === "ALL" ? "Tümü" : pos}</button>)}
          </div>
          <div className="market-label-row"><span>Oyuncu</span><span>Fiyat</span><span>Form</span><span /></div>
          <div className="pro-market-list">
            {filteredPlayers.map((player) => {
              const isSelected = selected.includes(player.id);
              return <div className={`pro-market-row ${isSelected ? "selected" : ""}`} key={player.id}>
                <div className="market-identity"><div className={`club-dot club-${player.club.slice(0, 2).toLowerCase()}`}>{player.name[0]}</div><div><strong>{player.name}</strong><small>{player.club} · {player.position}</small></div></div>
                <b>{player.price.toFixed(1)}M</b>
                <span>{player.form.toFixed(1)}</span>
                <button onClick={() => isSelected ? removePlayer(player.id) : addPlayer(player)} aria-label={isSelected ? `${player.name} çıkar` : `${player.name} ekle`}>{isSelected ? "−" : "+"}</button>
              </div>;
            })}
          </div>
        </aside>
      </section>

      <section className="joker-section">
        <div className="joker-heading"><div><p className="eyebrow">HAFTALIK AVANTAJLAR</p><h2>Joker Hakları</h2></div><p>Her joker kullanım hakkı veri modelinde ayrı takip edilir ve aktif hafta için uygulanır.</p></div>
        <div className="joker-grid">
          {jokerCards.map(([title, desc], i) => <article className="joker-card" key={title}><span className="joker-number">0{i + 1}</span><div><strong>{title}</strong><p>{desc}</p></div><button>Detay</button></article>)}
        </div>
      </section>
    </div>
  );
}

function PitchPlayer({ id, captain, vice, onRole, onRemove }: { id: number; captain: number; vice: number; onRole: (id: number) => void; onRemove: (id: number) => void }) {
  const p = players.find((x) => x.id === id)!;
  return <div className="pro-player-card">
    <button className="role-button" onClick={() => onRole(id)}>{captain === id ? "C ×2" : vice === id ? "VC" : p.position}</button>
    <button className="remove-mini" onClick={() => onRemove(id)}>×</button>
    <div className="player-cutout">{p.name[0]}</div>
    <strong>{p.name}</strong>
    <small>{p.club}</small>
    <b>{p.price.toFixed(1)}M</b>
  </div>;
}

function BenchPlayer({ id, order, onRemove }: { id: number; order: number; onRemove: (id: number) => void }) {
  const p = players.find((x) => x.id === id)!;
  return <div className="pro-bench-card"><span className="bench-order">{order}</span><div className="bench-avatar">{p.name[0]}</div><div><strong>{p.name}</strong><small>{p.club} · {p.position}</small></div><b>{p.price.toFixed(1)}M</b><button onClick={() => onRemove(id)}>×</button></div>;
}
