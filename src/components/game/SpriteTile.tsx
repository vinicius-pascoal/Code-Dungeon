import React from 'react'
import { TILESET_CONFIG, type SpriteCoordinate } from '../../game/tiles/tileConfig'

type SpriteTileBaseProps = {
  size: number
  className?: string
  style?: React.CSSProperties
  ariaLabel?: string
}

type SpriteTileByCoordinate = SpriteTileBaseProps & {
  col: number
  row: number
  sprite?: never
}

type SpriteTileBySprite = SpriteTileBaseProps & {
  sprite: SpriteCoordinate | null
  col?: never
  row?: never
}

export type SpriteTileProps = SpriteTileByCoordinate | SpriteTileBySprite

function getSpriteCoordinate(props: SpriteTileProps): SpriteCoordinate | null {
  if ('sprite' in props) return props.sprite ?? null
  return { col: props.col, row: props.row }
}

function joinClassNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function SpriteTile(props: SpriteTileProps) {
  const { size, className, style, ariaLabel } = props
  const sprite = getSpriteCoordinate(props)

  if (!sprite) return null

  return (
    <div
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={joinClassNames('dungeon-sprite-tile', className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: `url("${TILESET_CONFIG.src}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${TILESET_CONFIG.columns * size}px ${TILESET_CONFIG.rows * size}px`,
        backgroundPosition: `-${sprite.col * size}px -${sprite.row * size}px`,
        ...style,
      }}
    />
  )
}

export default React.memo(SpriteTile)
