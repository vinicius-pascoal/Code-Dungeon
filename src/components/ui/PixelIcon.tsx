import { UI_ATLAS, type UiSpriteRect } from '../../game/ui/uiConfig'

type Props = {
  sprite: UiSpriteRect
  scale?: 1 | 2 | 3 | 4
  className?: string
  label?: string
}

export default function PixelIcon({ sprite, scale = 1, className = '', label }: Props) {
  return (
    <span
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      className={`inline-block shrink-0 align-middle [image-rendering:pixelated] ${className}`}
      style={{
        width: sprite.width * scale,
        height: sprite.height * scale,
        backgroundImage: `url(${UI_ATLAS.src})`,
        backgroundPosition: `-${sprite.x * scale}px -${sprite.y * scale}px`,
        backgroundSize: `${UI_ATLAS.width * scale}px ${UI_ATLAS.height * scale}px`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}
