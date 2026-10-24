type IconProps = {
  name: "menu" | "close" | "arrow" | "up" | "down" | "edit" | "image" | "palette" | "logout"
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
