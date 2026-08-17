import React from 'react'
import { TILESET_CONFIG, type SpriteAtlasConfig, type SpriteCoordinate } from '../../game/tiles/tileConfig'

type SpriteTileBaseProps = {
  size: number
  fill?: boolean
  atlas?: Pick<SpriteAtlasConfig, 'src' | 'columns' | 'rows'>
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
  const { size, fill, className, style, ariaLabel } = props
  const atlas = props.atlas ?? TILESET_CONFIG
  const sprite = getSpriteCoordinate(props)

  if (!sprite) return null

  const width = fill ? '100%' : `${size}px`
  const height = fill ? '100%' : `${size}px`
  const backgroundSize = fill
    ? `${atlas.columns * 100}% ${atlas.rows * 100}%`
    : `${atlas.columns * size}px ${atlas.rows * size}px`
  const backgroundPosition = fill
    ? `${(sprite.col / (atlas.columns - 1)) * 100}% ${(sprite.row / (atlas.rows - 1)) * 100}%`
    : `-${sprite.col * size}px -${sprite.row * size}px`

  return (
    <div
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={joinClassNames('dungeon-sprite-tile', className)}
      style={{
        width,
        height,
        backgroundImage: `url("${atlas.src}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize,
        backgroundPosition,
        ...style,
      }}
    />
  )
}

export default React.memo(SpriteTile)
