/**
 * Conservative content restoration. A revision is an AFTER-update snapshot;
 * restoring it must never roll back publication, visibility, IDs or Storage.
 */
export type RestorableEntity = "content_blocks" | "sections"

type Row = Record<string, unknown>

export function isRestorableEntity(value: string): value is RestorableEntity {
  return value === "content_blocks" || value === "sections"
}

export function prepareContentRestoration(
  entityType: string,
  entityId: string,
  snapshot: unknown,
  current: Row,
): { patch: Row; changedFields: string[] } {
  if (!isRestorableEntity(entityType)) {
    throw new Error("Esta revisão é somente para consulta. Mídias e Storage não são revertidos.")
  }
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    throw new Error("A revisão não contém um registro válido.")
  }
  const old = snapshot as Row
  if (old.id !== entityId || current.id !== entityId) {
    throw new Error("A revisão não pertence ao registro atual.")
  }
  if (typeof current.updated_at !== "string" || !current.updated_at) {
    throw new Error("Não foi possível conferir a versão atual do registro.")
  }
  const fields = entityType === "content_blocks" ? ["content_json"] : ["title", "eyebrow", "intro"]
  const patch: Row = {}
  for (const field of fields) {
    if (!(field in old)) throw new Error("A revisão não possui todos os campos recuperáveis.")
    const value = old[field]
    if (field === "content_json") {
      if (!value || typeof value !== "object" || Array.isArray(value))
        throw new Error("A revisão contém dados de bloco inválidos.")
    } else if (
      (field === "title" && (typeof value !== "string" || !value.trim())) ||
      (field !== "title" && value !== null && typeof value !== "string")
    ) {
      throw new Error("A revisão contém campos textuais inválidos.")
    }
    if (JSON.stringify(value) !== JSON.stringify(current[field])) patch[field] = value
  }
  return { patch, changedFields: Object.keys(patch) }
}
