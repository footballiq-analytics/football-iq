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


/** Evaluate the retained squad, refunding only the selected outgoing player. */
export function assessReplacementTransfer(input: Parameters<typeof assessDirectTransfer>[0] & {
 outgoing?: {position:string;price:number;club:string}; candidatePosition:string;
 candidateClub?:string;
}):TransferAssessment {
 const out=input.outgoing;
 if(!out||out.position!==input.candidatePosition)return {eligible:false,reason:"AYNI MEVKİ GEREKLİ"};
 return assessDirectTransfer({...input,squadSize:input.squadSize-1,
 clubCount:input.clubCount-(out.club===input.candidateClub?1:0),availableSlots:1,
 remainingBudget:Math.round((input.remainingBudget+out.price)*100)/100});
}
