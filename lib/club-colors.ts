export type ClubColors = { primary: string; secondary: string; accent?: string };

// Club identity colours, not a claim to reproduce a particular season's kit.
const CLUB_COLORS: Record<string, ClubColors> = {
  "Galatasaray": { primary: "#a51c30", secondary: "#f5b625" },
  "Fenerbahçe": { primary: "#17264c", secondary: "#f7d832" },
  "Beşiktaş": { primary: "#23262b", secondary: "#ffffff" },
  "Trabzonspor": { primary: "#7a193e", secondary: "#77c4e2" },
  "Alanyaspor": { primary: "#197848", secondary: "#ef8626" },
  "Samsunspor": { primary: "#c92032", secondary: "#ffffff" },
  "Kocaelispor": { primary: "#167447", secondary: "#242729" },
  "İstanbul Başakşehir FK": { primary: "#ef782b", secondary: "#223457" },
  "Göztepe": { primary: "#c52131", secondary: "#f5ce30" },
  "Kasımpaşa": { primary: "#233c70", secondary: "#ffffff" },
  "Konyaspor": { primary: "#217849", secondary: "#ffffff" },
  "Gaziantep FK": { primary: "#cb2335", secondary: "#22252a" },
  "Çaykur Rizespor": { primary: "#187c4c", secondary: "#2479bc" },
  "Gençlerbirliği": { primary: "#bf2035", secondary: "#24262b" },
  "Amed SK": { primary: "#18894d", secondary: "#ce2939", accent: "#ffffff" },
  "Eyüpspor": { primary: "#693b86", secondary: "#f2ce3d" },
  "Erzurumspor FK": { primary: "#277dc1", secondary: "#ffffff" },
  "Çorum FK": { primary: "#c51f33", secondary: "#23252a" },
};

export function getClubColors(club: string): ClubColors {
  return CLUB_COLORS[club] ?? { primary: "#488779", secondary: "#d5e9de" };
}
