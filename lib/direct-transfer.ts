export type TransferAssessment = { eligible: boolean; reason: string | null };

/** Eligibility means a direct add now, without assuming a sale or replacement. */
export function assessDirectTransfer(input: {
  alreadySelected: boolean;
  squadSize: number;
  clubCount: number;
  availableSlots: number;
  price: number;
  remainingBudget: number;
}): TransferAssessment {
  const { alreadySelected, squadSize, clubCount, availableSlots, price, remainingBudget } = input;
  const reason = alreadySelected ? "KADRODA"
    : squadSize >= 15 ? "KADRO DOLU"
    : clubCount >= 3 ? "3 OYUNCU SINIRI"
    : availableSlots <= 0 ? "BOŞ MEVKİ YOK"
    : !Number.isFinite(price) || !Number.isFinite(remainingBudget) || price < 0 || price > remainingBudget + 0.0001 ? "BÜTÇE YETERSİZ"
    : null;
  return { eligible: reason === null, reason };
}
