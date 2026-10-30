/** Group the six independent public experiences only in the administration menu. */
export const PROFESSIONAL_EXPERIENCE_SLUGS = [
  "invest-rs",
  "prefeitura-sp",
  "vale",
  "globo-sportv",
  "inpress",
  "cdi",
] as const

export function isExperienceSection(slug: string): boolean {
  return (PROFESSIONAL_EXPERIENCE_SLUGS as readonly string[]).includes(slug)
}

export type AdminSectionNavigationEntry<T> =
  | { kind: "section"; section: T }
  | { kind: "experiences"; sections: T[] }

/** Insert one navigation group where the first matching public section appears. */
export function buildAdminSectionNavigation<T extends { slug: string }>(
  sections: readonly T[],
): AdminSectionNavigationEntry<T>[] {
  const experiences = sections.filter((section) => isExperienceSection(section.slug))
  const navigation: AdminSectionNavigationEntry<T>[] = []
  let groupAdded = false
  for (const section of sections) {
    if (isExperienceSection(section.slug)) {
      if (!groupAdded) {
        navigation.push({ kind: "experiences", sections: experiences })
        groupAdded = true
      }
    } else {
      navigation.push({ kind: "section", section })
    }
  }
  return navigation
}
