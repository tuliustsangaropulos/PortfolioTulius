// The derivatives are SHA-256 verified copies of the published CMS photograph.
// Keep this value aligned with ApprovedProfileImage in PublicSite.tsx.
export const APPROVED_PROFILE_PORTRAIT =
  "https://zfnrhzplwpjpdljraypt.supabase.co/storage/v1/object/public/portfolio-public/b171afda-2708-44eb-b3e5-ab2b7ff13236-tulius_site.png"

const imagePreload = /<link\b(?=[^>]*\brel=["']preload["'])(?=[^>]*\bas=["']image["'])[^>]*\/?\s*>/i

// Preserve responsive WebP preloading for the approved portrait. If the editor
// publishes a different portrait, preload that actual CMS asset instead.
// If the published image is unknown, remove the stale preload entirely.
export function syncProfilePreload(html, publishedPortrait) {
  const existing = html.match(imagePreload)?.[0]
  if (!existing) throw new Error("Missing first-fold image preload in built HTML")
  if (
    publishedPortrait === APPROVED_PROFILE_PORTRAIT &&
    existing.includes('type="image/webp"') &&
    existing.includes('imagesrcset="/media/tulius-site-600.webp 600w, /media/tulius-site-900.webp 900w"') &&
    existing.includes("imagesizes=")
  ) {
    return { html, strategy: "responsive-webp" }
  }
  const replacement = publishedPortrait
    ? '<link rel="preload" as="image" href="' +
      publishedPortrait.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;") +
      '" fetchpriority="high" />'
    : ""
  return {
    html: html.replace(imagePreload, replacement),
    strategy: publishedPortrait ? "cms-image" : "omitted",
  }
}
