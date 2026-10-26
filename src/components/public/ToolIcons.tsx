import type { ToolIconName } from "../../types/content"

export const toolIconOptions: { value: ToolIconName; label: string }[] = [
  { value: "analytics", label: "Google Analytics" },
  { value: "search", label: "Search Console" },
  { value: "meta", label: "Meta Ads" },
  { value: "growth", label: "Indicadores de desempenho" },
  { value: "salesforce", label: "Salesforce" },
  { value: "hubspot", label: "HubSpot" },
  { value: "sprinklr", label: "Sprinklr" },
  { value: "asana", label: "Asana" },
  { value: "notion", label: "Notion" },
  { value: "adobe", label: "Adobe Creative Cloud" },
  { value: "figma", label: "Figma" },
  { value: "wordpress", label: "WordPress" },
  { value: "social", label: "Conteúdo e redes sociais" },
  { value: "video", label: "Conteúdo audiovisual" },
  { value: "megaphone", label: "Comunicação e campanhas" },
]

function Symbol({ name }: { name: ToolIconName }) {
  switch (name) {
    case "analytics":
      return <><rect x="5" y="13" width="4" height="8" rx="2" /><rect x="12" y="8" width="4" height="13" rx="2" /><circle cx="20" cy="5" r="3" /></>
    case "search":
      return <><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" /><path d="m16 16 6 6M7 12l3-3 3 2 3-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>
    case "meta":
      return <path d="M3 16C5 9 8 6 12 12s7 9 10 4c1.8-3-1-7-4-7-4 0-7 8-10 8-2 0-3-2-2-4" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
    case "growth":
      return <path d="M3 20V4M3 20h19M6 16l5-6 4 3 6-8M16 5h5v5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    case "salesforce":
      return <><path d="M6 18a5 5 0 0 1-1-9 7 7 0 0 1 13-2 5 5 0 1 1 1 11H6Z" /><text x="12" y="15" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#ff5414">CRM</text></>
    case "hubspot":
      return <><circle cx="8" cy="17" r="3" /><circle cx="18" cy="8" r="3" /><circle cx="19" cy="19" r="2.5" /><path d="M10 15 16 10M11 18l5 1M18 5V2" fill="none" stroke="currentColor" strokeWidth="2" /></>
    case "sprinklr":
      return <>{[[12,3],[5,7],[19,7],[3,14],[12,13],[21,14],[6,21],[17,21]].map(([x,y])=><circle key={`${x}-${y}`} cx={x} cy={y} r="2.1" />)}</>
    case "asana":
      return <><circle cx="12" cy="5" r="4" /><circle cx="6" cy="18" r="4" /><circle cx="18" cy="18" r="4" /></>
    case "notion":
      return <><rect x="3" y="3" width="18" height="18" rx="1" fill="none" stroke="currentColor" strokeWidth="2.3" /><path d="M7 18V7l3 1 6 8V7l2 1" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" /></>
    case "adobe":
      return <><path d="m12 2 10 20h-6L12 11 8 22H2L12 2Z" /><path d="M10 17h4l2 4H8l2-4Z" fill="#ff5414" /></>
    case "figma":
      return <><rect x="5" y="2" width="7" height="7" rx="3.5" /><rect x="12" y="2" width="7" height="7" rx="3.5" /><rect x="5" y="9" width="7" height="7" rx="3.5" /><circle cx="15.5" cy="12.5" r="3.5" /><rect x="5" y="16" width="7" height="7" rx="3.5" /></>
    case "wordpress":
      return <><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" /><text x="12" y="17.6" textAnchor="middle" fontFamily="serif" fontSize="16" fontWeight="bold">W</text></>
    case "social":
      return <path d="M4 4h16v12H9l-5 4V4ZM8 9h8M8 13h6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    case "video":
      return <><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m10 9 6 3-6 3V9Z" /></>
    case "megaphone":
      return <path d="M3 10h4l12-6v16L7 14H3v-4Zm4 4 2 7h4l-2-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  }
}

export function ToolIcons({ icons }: { icons: readonly ToolIconName[] }) {
  if (!icons.length) return null
  return (
    <div className="tools-icon-cluster" aria-label="Plataformas e recursos visuais">
      {icons.slice(0, 3).map((icon, index) => (
        <span className={`tools-icon-badge tools-icon-badge-${index + 1}`} key={`${icon}-${index}`} role="img" aria-label={toolIconOptions.find((item) => item.value === icon)?.label ?? icon}>
          <svg viewBox="0 0 24 24" width="66%" height="66%" fill="currentColor" aria-hidden="true">
            <Symbol name={icon} />
          </svg>
        </span>
      ))}
    </div>
  )
}
