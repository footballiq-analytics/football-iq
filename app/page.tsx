import Link from "next/link";
import type { CSSProperties } from "react";
import { leagueClubs } from "@/components/league/LeagueBoard";
const base=process.env.NEXT_PUBLIC_BASE_PATH??"";
const sections=[
 {number:"01",title:"Kadrom",description:"İlk 11’ini ve yedeklerini seç. Transferlerini bütçene göre planla.",href:"/team",action:"Kadroya git"},
 {number:"02",title:"Fikstür",description:"Süper Lig takımlarını ve maç programı için hazırlanan merkezi incele.",href:"/today",action:"Fikstürü aç"},
 {number:"03",title:"Puan Durumu",description:"Ligdeki 18 takımı tek tabloda gör. Puan verileri bağlantı bekliyor.",href:"/leagues/super-lig",action:"Takımları gör"},
];
export default function Home(){return <div className="fiq-home">
 <section className="fiq-home-hero" style={{"--home-stadium":`url(${base}/game-ui/stadium-bowl.webp)`} as CSSProperties}>
  <div><span className="fiq-home-kicker">FUTBOL IQ · FANTEZİ FUTBOL</span><h1>Oyunu oku.<br/><em>Kadronu kur.</em></h1><p>Süper Lig için futbol bilginle karar ver. 100M bütçeni yönet, kaptanını seç ve kendi takımını oluştur.</p><div className="fiq-home-actions"><Link href="/team">KADROMU AÇ →</Link><Link href="/today">FİKSTÜRÜ İNCELE</Link></div></div>
  <div className="fiq-home-rules" aria-label="Temel kadro kuralları">{[["100M","Futbolcu bütçesi"],["11 + 4","İlk 11 ve yedekler"],["3","Kulüp başına oyuncu sınırı"],["C / C2","Kaptan ve ikinci kaptan"]].map(([value,label])=><div key={label}><b>{value}</b><span>{label}</span></div>)}</div>
 </section>
 <section className="fiq-home-section"><h2>Futbol merkezine gir</h2><div className="fiq-home-grid">{sections.map(x=><Link href={x.href} key={x.title} className="fiq-home-tile"><span>{x.number} / FUTBOL IQ</span><h3>{x.title}</h3><p>{x.description}</p><b>{x.action} →</b></Link>)}</div></section>
 <section className="fiq-home-section"><h2>18 takım, tek lig</h2><div className="fiq-home-clubs">{leagueClubs.map(club=><span key={club}>{club}</span>)}</div></section>
 <section className="fiq-home-section fiq-home-roadmap"><span className="fiq-home-kicker">GELİŞTİRME ÖNİZLEMESİ</span><h2>Sırada oyuncu ve maç analizleri var</h2><p>Kadro kurma ve transfer ekranı kullanılabilir. Canlı fikstür, haftalık puanlar ve Football IQ analizleri veri bağlantısı tamamlandığında eklenecek.</p></section>
 </div>}
