export type ThemeName = "paper" | "cream" | "ink" | "orange"

export type DeviceItemStyle = {
  visible?: boolean
  order?: number
  spacing?: number
  width?: number
  titleSize?: number
  textSize?: number
  textAlign?: "left" | "center" | "right"
}

export type HeroDeviceStyle = {
  visualHeight?: number
  imageWidth?: number
  imageHeight?: number
  imagePositionX?: number
  imagePositionY?: number
  yearsX?: number
  yearsY?: number
  yearsWidth?: number
  badgeSize?: number
  badgeX?: number
  badgeY?: number
  contentGap?: number
  introSize?: number
  introSpacing?: number
  introAlign?: "left" | "center" | "right"
}

export type HeroVisualConfig = {
  panelBackground?: string
  badgeText?: string
  badgeVisible?: boolean
  badgeBackground?: string
  badgeColor?: string
  introColor?: string
  desktop?: HeroDeviceStyle
  mobile?: HeroDeviceStyle
}

export type ContentItem = {
  title: string
  label?: string
  text?: string
  meta?: string
  value?: string
  image?: string
  alt?: string
  tags?: string[]
  placeholder?: boolean
  icon?: "arrow" | "none"
  titleColor?: string
  textColor?: string
  backgroundColor?: string
  desktop?: DeviceItemStyle
  mobile?: DeviceItemStyle
  hero?: HeroVisualConfig
}

export type PortfolioSection = {
  id: string
  slug: string
  number: number
  title: string
  eyebrow?: string
  intro?: string
  theme: ThemeName
  layout: "hero" | "editorial" | "metrics" | "timeline" | "quotes" | "contact"
  animation?: "none" | "fade-in" | "fade-up" | "stagger" | "image-reveal" | "metric-count"
  status: "draft" | "in_review" | "published" | "archived"
  visible: boolean
  navLabel?: string
  panelA: ContentItem[]
  panelB: ContentItem[]
}

export type DesignTokens = {
  orange: string
  ink: string
  paper: string
  cream: string
  muted: string
  orangeDark: string
  headingFont: "Big Shoulders Display" | "Inter"
  bodyFont: "Inter" | "Big Shoulders Display"
  container: number
  sectionSpace: number
  motionDuration: number
}
