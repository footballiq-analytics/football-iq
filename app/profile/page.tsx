import Link from "next/link";

const items=[
  ["Takımım","Kadronu ve kaptanlarını yönet","/team"],
  ["Transfer Merkezi","Oyuncu pazarını aç","/transfers"],
  ["Liglerim","Özel ve genel liglerini görüntüle","/leagues/super-lig"],
  ["Canlı Skorlar","Maçlar ve fikstür","/today"],
  ["Ödüller","Haftalık başarı alanı","#"],
  ["Arkadaşlarını Davet Et","Özel lig davet sistemi","#"],
  ["Ayarlar","Hesap ve uygulama tercihleri","#"],
  ["Yardım","Kurallar ve destek","/rules"],
] as const;

export default function ProfilePage(){return <div className="ref-profile-page"><section className="profile-hero-ref"><span className="demo-chip">DEMO PROFİL</span><div className="profile-main-ref"><div className="avatar-ref">DT</div><div><p className="eyebrow">PROFİL / LİGİM</p><h1>Davut T.</h1><span className="member-badge">PRO ÜYE</span></div></div><div className="profile-stats-ref"><div><small>Kadro Değeri</small><strong>94.8 M₺</strong></div><div><small>Haftalık Puan</small><strong>68</strong></div><div><small>Genel Sıra</small><strong>12.480</strong></div></div></section><section className="profile-menu-ref">{items.map(([title,desc,href],index)=><Link key={title} href={href} className={href==="#"?"disabled-row":""}><span className="menu-index">{String(index+1).padStart(2,"0")}</span><div><strong>{title}</strong><small>{desc}</small></div><b>›</b></Link>)}</section><p className="profile-note">Hesap senkronizasyonu henüz bağlı değil. Bu ekran şu anda tasarım ve gezinme demosudur.</p></div>}
