import { Icon } from "../ui/Icons"
import { ToolSymbol, toolIconOptions } from "../public/ToolIcons"
import { iconCategories } from "../../lib/icon-catalog"
import type { MetricIconName, ToolIconName } from "../../types/content"

export function VisualIconLibrary({ value, onChange }: {
  value: MetricIconName
  onChange: (value: MetricIconName) => void
}) {
  return (
    <fieldset className="visual-icon-library">
      <legend className="sr-only">Biblioteca de 50 ícones</legend>
      {iconCategories.map((group) => (
        <div key={group.category}>
          <h4>{group.category}</h4>
          <div className="visual-icon-grid">
            {group.icons.map(([name, label]) => (
              <button type="button" key={name} className={value === name ? "active" : ""}
                aria-label={label} aria-pressed={value === name}
                onClick={() => onChange(name as MetricIconName)}>
                <Icon name={name as MetricIconName} size={24} />
              </button>
            ))}
          </div>
        </div>
      ))}
    </fieldset>
  )
}

export function PlatformIconLibrary({ selected, onChange }: {
  selected: ToolIconName[]
  onChange: (icons: ToolIconName[]) => void
}) {
  return (
    <fieldset className="visual-icon-library">
      <legend>Plataformas (até três)</legend>
      <div className="visual-icon-grid">
        {toolIconOptions.map(({ value, label }) => {
          const active = selected.includes(value)
          return (
            <button type="button" key={value} className={active ? "active" : ""}
              aria-label={label} aria-pressed={active}
              disabled={!active && selected.length >= 3}
              onClick={() => onChange(active ? selected.filter((icon) => icon !== value) : [...selected, value])}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><ToolSymbol name={value} /></svg>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
