import type React from 'react'
import { BAT_ANIMATION_DURATION, BAT_SPRITE_CONFIG } from '../../../game/entities/batConfig'

type BatSpriteProps = {
  size: number
  x?: number
  y?: number
  className?: string
  ariaLabel?: string
}

type BatSpriteStyle = React.CSSProperties & {
  '--bat-sheet-offset': string
}

function joinClassNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function getAnimationDelay(x = 0, y = 0) {
  const frameOffset = Math.abs((x * 3 + y * 5) % BAT_SPRITE_CONFIG.frameCount)
  return -(frameOffset * BAT_SPRITE_CONFIG.frameDuration)
}

export default function BatSprite({
  size,
  x,
  y,
  className,
  ariaLabel = 'Morcego inimigo',
}: BatSpriteProps) {
  const renderSize = Math.max(14, Math.round(size))
  const scale = renderSize / BAT_SPRITE_CONFIG.frameWidth
  const renderedSheetWidth = BAT_SPRITE_CONFIG.sheetWidth * scale
  const renderedSheetHeight = BAT_SPRITE_CONFIG.sheetHeight * scale

  const style: BatSpriteStyle = {
    width: `${renderSize}px`,
    height: `${renderSize}px`,
    backgroundImage: `url("${BAT_SPRITE_CONFIG.src}")`,
    backgroundSize: `${renderedSheetWidth}px ${renderedSheetHeight}px`,
    animationDuration: `${BAT_ANIMATION_DURATION}ms`,
    animationDelay: `${getAnimationDelay(x, y)}ms`,
    animationTimingFunction: `steps(${BAT_SPRITE_CONFIG.frameCount})`,
    '--bat-sheet-offset': `-${renderedSheetWidth}px`,
  }

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={joinClassNames('bat-sprite dungeon-entity-sprite', className)}
      style={style}
    />
  )
}
