const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://urbanhousein.com";

export function buildLocationMarkUrl(token: string) {
  const trimmed = token.trim();
  if (!trimmed) return "/mark-location";

  if (typeof window !== "undefined") {
    return `${window.location.origin}/mark-location/${encodeURIComponent(trimmed)}`;
  }

  const base = SITE_URL.replace(/\/$/, "");
  return `${base}/mark-location/${encodeURIComponent(trimmed)}`;
}
