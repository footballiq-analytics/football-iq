export type MediaRightsStatus = "owned" | "licensed" | "unverified";

export type FantasyMediaMetadata = {
  rights?: MediaRightsStatus;
  source?: string;
  licenseExpiresAt?: string;
};

const isRenderableRights = (rights?: MediaRightsStatus) => rights === "owned" || rights === "licensed";

export function resolveFantasyMedia(url?: string, metadata?: FantasyMediaMetadata): string | null {
  if (!url || !isRenderableRights(metadata?.rights)) return null;
  return url;
}

export function hasRenderableFantasyMedia(url?: string, metadata?: FantasyMediaMetadata): boolean {
  return Boolean(resolveFantasyMedia(url, metadata));
}
