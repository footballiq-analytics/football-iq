import type { Formation } from "@/store/useTeamStore";
export type SavedSquad = { formation: Formation; startingIds: (string|null)[]; benchIds: (string|null)[]; captain: string|null; viceCaptain: string|null; coachId: string|null };
export function persistSquad(storage: Pick<Storage,"setItem"|"getItem">, key: string, squad: SavedSquad) {
 const encoded=JSON.stringify(squad);
 storage.setItem(key,encoded);
 if(storage.getItem(key)!==encoded)throw new Error("Kayıt doğrulanamadı");
}
