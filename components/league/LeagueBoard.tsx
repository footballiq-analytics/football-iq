import { SUPER_LIG_CLUBS_2026_27 } from "@/data/superlig-2026";

export const leagueClubs=[...SUPER_LIG_CLUBS_2026_27].sort((a,b)=>a.localeCompare(b,"tr"));
export default function LeagueBoard({mode}:{mode:"fixtures"|"standings"}) {
 return <div className="fiq-league-board"><p className="fiq-league-note">18 takım · 2026–27 · Veri bekleniyor</p><p className="fiq-league-explanation">{mode==="standings"?"Takımlar alfabetik sıralıdır. Resmî puan ve sıralama verileri henüz bağlı değil.":"Takımların rakip, tarih ve saat bilgileri fikstür kaynağı bağlandığında gösterilecek."}</p><div className="fiq-league-table-wrap"><table><caption className="sr-only">Süper Lig {mode==="standings"?"puan durumu":"fikstür takımları"}</caption><thead><tr><th>Takım</th>{(mode==="standings"?["O","G","B","M","AV","P"]:["Rakip","Tarih / Saat"]).map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{leagueClubs.map(club=><tr key={club}><th scope="row"><span className="fiq-club-monogram" aria-hidden="true">{club.slice(0,1)}</span>{club}</th>{(mode==="standings"?["—","—","—","—","—","—"]:["Bekleniyor","Bekleniyor"]).map((x,i)=><td key={i}>{x}</td>)}</tr>)}</tbody></table></div></div>;
}
