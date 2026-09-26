export function buildMemorialUrl(slug: string, publicSiteUrl: string, fallbackOrigin: string): string {
  const siteUrl = (publicSiteUrl || fallbackOrigin).replace(/\/+$/, '');
  return new URL(`/memorial/${encodeURIComponent(slug)}`, `${siteUrl}/`).toString();
}