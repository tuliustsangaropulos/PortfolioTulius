import type { MetricIconName } from "../../types/content"

type IconProps = {
  name:
    | "menu"
    | "close"
    | "arrow"
    | "up"
    | "down"
    | "edit"
    | "info"
    | "sliders"
    | "trash"
    | "image"
    | "palette"
    | "logout"
    | MetricIconName
  size?: number
}

export function Icon({ name, size = 22 }: IconProps) {
  const paths: Record<IconProps["name"], React.ReactNode> = {
    menu: (
      <>
        <path d="M3 7h18M3 17h18" />
      </>
    ),
    close: (
      <>
        <path d="m5 5 14 14M19 5 5 19" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 19 19 5M9 5h10v10" />
      </>
    ),
    up: (
      <>
        <path d="m6 15 6-6 6 6" />
      </>
    ),
    down: (
      <>
        <path d="m6 9 6 6 6-6" />
      </>
    ),
    edit: (
      <>
        <path d="m4 20 4-1 11-11-3-3L5 16l-1 4ZM14 7l3 3" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    sliders: (
      <>
        <path d="M4 7h16M4 17h16M8 4v6M16 14v6" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v6M14 11v6" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="m3 17 5-5 4 4 3-3 6 6" />
      </>
    ),
    palette: (
      <>
        <path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h3a6 6 0 0 0 0-12h-3Z" />
        <path d="M7 10h.01M8.5 6.5h.01M13 6h.01" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V4M4 20h16M8 17v-5M12 17V8M16 17V5" />
      </>
    ),
    trending: (
      <>
        <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6M19 14a5 5 0 0 1 2 4v2" />
      </>
    ),
    newspaper: (
      <>
        <path d="M5 3h14v18H5a3 3 0 0 1-3-3V6M8 7h7M8 11h8M8 15h8" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    megaphone: (
      <>
        <path d="M3 11h4l11-6v14L7 13H3zM7 13l2 6h4" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V4h8v3M3 13h18" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="5" />
        <path d="m8 12-2 9 6-3 6 3-2-9" />
      </>
    ),
    layers: (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" />
      </>
    ),
    logout: (
      <>
        <path d="M10 5H5v14h5M14 8l4 4-4 4M9 12h9" />
      </>
    ),
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}
