/** Bold only the descriptive heading of an existing career bullet, without altering its text. */
export function splitExperienceBullet(line: string): { heading: string; body: string } | null {
  const match = /^([•-]\s+[^:]+:)(.*)$/u.exec(line)
  if (!match) return null
  return { heading: match[1], body: match[2] }
}
