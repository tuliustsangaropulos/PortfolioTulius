// Motion timing uses milliseconds; translation distance uses CSS pixels.
// Keep defaults unset so existing styles in index.css remain in effect.
function boundedMotionNumber(
  config: Record<string, unknown>,
  key: string,
  max: number,
): number | undefined {
  const value = config[key]
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(max, value))
    : undefined
}

export function placementMotionVariables(config: Record<string, unknown> = {}) {
  const duration = boundedMotionNumber(config, "duration", 1200)
  const delay = boundedMotionNumber(config, "delay", 600)
  const distance = boundedMotionNumber(config, "distance", 48)
  return {
    "--placement-duration": duration == null ? undefined : `${duration}ms`,
    "--placement-delay": delay == null ? undefined : `${delay}ms`,
    "--placement-distance": distance == null ? undefined : `${distance}px`,
  }
}
