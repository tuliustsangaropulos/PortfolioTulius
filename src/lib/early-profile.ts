/** Only the first public fold is safe to compose before the full navigation is ready. */
export function shouldRenderEarlyProfile(includeDrafts: boolean, hash: string): boolean {
  if (includeDrafts) return false
  return hash === "" || hash === "#perfil" || hash === "#perfil-a" || hash === "#perfil-b"
}
