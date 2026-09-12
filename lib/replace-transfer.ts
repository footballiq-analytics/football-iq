import { formatFantasyPrice } from "@/lib/fantasy-price";
import type { Player, StartingSlot, BenchSlot } from "@/store/useTeamStore";

type Squad = { players: Record<string, Player>; startingSlots: StartingSlot[]; benchSlots: BenchSlot[] };
type Result = { success: boolean; update: Partial<Squad> & { toast: string } };

/** Called inside the store updater: the outgoing player funds this one swap only. */
export function buildTransferReplacement(state: Squad, incoming: Player, target: string, expectedOutgoing: string): Result {
 const reject = (toast: string): Result => ({ success: false, update: { toast } });
 const allSlots = [...state.startingSlots, ...state.benchSlots];
 const slot = allSlots.find(s => s.id === target);
 if (!slot || slot.playerId !== expectedOutgoing) return reject("Transfer iptal edildi · hedef oyuncu değişti.");
 if (slot.position !== incoming.position) return reject("Oyuncu yalnızca aynı mevkideki oyuncuyla değiştirilebilir.");
 if (allSlots.some(s => s.playerId === incoming.id)) return reject(`${incoming.name} zaten kadroda.`);
 const outgoing = state.players[expectedOutgoing];
 if (!outgoing) return reject("Transfer iptal edildi · çıkacak oyuncu bulunamadı.");
 const retained = allSlots.filter(s => s.id !== target && s.playerId).map(s => state.players[s.playerId!]);
 if (retained.some(p => !p)) return reject("Transfer iptal edildi · kadro verisi geçersiz.");
 if (retained.filter(p => p.club === incoming.club).length >= 3) return reject(`${incoming.club} için 3 oyuncu sınırına ulaştın.`);
 const amounts = [...retained.map(p => p.price), outgoing.price, incoming.price];
 if (amounts.some(n => !Number.isFinite(n) || n < 0)) return reject("Transfer iptal edildi · fiyat bilgisi geçersiz.");
 // Integer hundredths of M avoid rounding errors at an exact-budget boundary.
 const cents = (n: number) => Math.round(n * 100);
 const spent = retained.reduce((sum,p) => sum + cents(p.price), 0) + cents(outgoing.price);
 const available = 10000 - spent + cents(outgoing.price);
 const balance = available - cents(incoming.price);
 if (balance < 0) return reject(`Değişim için bütçe yetersiz · mevcut bütçe + ${formatFantasyPrice(outgoing.price)}M = ${formatFantasyPrice(available/100)}M.`);
 const replace = <T extends StartingSlot | BenchSlot>(s: T): T => s.id === target ? { ...s, playerId: incoming.id } : s;
 return { success: true, update: {
  players: { ...state.players, [incoming.id]: incoming },
  startingSlots: state.startingSlots.map(replace),
  benchSlots: state.benchSlots.map(replace),
  toast: `${outgoing.name} → ${incoming.name} · ${formatFantasyPrice(outgoing.price)}M iade edildi · ${formatFantasyPrice(balance/100)}M kaldı.`,
 } };
}
