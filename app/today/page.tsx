import Link from "next/link";
import LeagueBoard from "@/components/league/LeagueBoard";
export default function TodayPage(){return <section className="fiq-league-page"><p className="eyebrow">SÜPER LİG</p><h1>Fikstür</h1><nav className="fiq-league-links"><Link href="/today" aria-current="page">Fikstür</Link><Link href="/leagues/super-lig">Puan Durumu</Link></nav><LeagueBoard mode="fixtures"/></section>}
