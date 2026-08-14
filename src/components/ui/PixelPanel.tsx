import type React from 'react'
import PixelIcon from './PixelIcon'
import { UI_SPRITES, type UiIconName } from '../../game/ui/uiSprites'

type Props = {
  children: React.ReactNode
  title?: string
  eyebrow?: string
  icon?: UiIconName
  variant?: 'default' | 'editor' | 'console' | 'hud' | 'modal'
  className?: string
  bodyClassName?: string
  headerAction?: React.ReactNode
}

export default function PixelPanel({
  children,
  title,
  eyebrow,
  icon,
  variant = 'default',
  className = '',
  bodyClassName = '',
  headerAction,
}: Props) {
  const hasHeader = title || eyebrow || icon || headerAction

  return (
    <section className={`pixel-panel pixel-panel--${variant} ${className}`}>
      {hasHeader ? (
        <div className="pixel-panel__header">
          <div className="min-w-0">
            {eyebrow ? <p className="pixel-eyebrow">{eyebrow}</p> : null}
            {title ? (
              <div className="pixel-panel__title-row">
                {icon ? <PixelIcon sprite={UI_SPRITES.icons[icon]} scale={1} /> : null}
                <h2 className="pixel-panel__title">{title}</h2>
              </div>
            ) : null}
          </div>
          {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
        </div>
      ) : null}
      <div className={`pixel-panel__body ${bodyClassName}`}>{children}</div>
    </section>
  )
}
