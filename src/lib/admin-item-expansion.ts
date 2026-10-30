/** Keep the expanded editor attached to an item after reorder or removal. */
export function nextExpandedItem(current: number | null, index: number): number | null {
  return current === index ? null : index
}

export function expandedAfterMove(
  current: number | null,
  source: number,
  target: number,
): number | null {
  if (current === source) return target
  if (current === target) return source
  return current
}

export function expandedAfterRemoval(current: number | null, removed: number): number | null {
  if (current === null || current === removed) return null
  return current > removed ? current - 1 : current
}
