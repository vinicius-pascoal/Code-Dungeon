import type { SpriteCoordinate } from './tileConfig'

export type FloorVariant = 'normal' | 'variant1' | 'variant2' | 'cracked' | 'decorated'

export type WallVariant =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'left'
  | 'right'
  | 'bottomLeft'
  | 'bottom'
  | 'bottomRight'
  | 'fallback'

export type TileVariant = FloorVariant | WallVariant

type FloorSpriteCatalog = {
  normal: SpriteCoordinate
} & Partial<Record<Exclude<FloorVariant, 'normal'>, SpriteCoordinate>>

type WallSpriteCatalog = Record<WallVariant, SpriteCoordinate>

export const DUNGEON_SPRITES = {
  floor: {
    normal: { col: 2, row: 2 },
  },
  walls: {
    topLeft: { col: 1, row: 1 },
    top: { col: 2, row: 1 },
    topRight: { col: 3, row: 1 },
    left: { col: 1, row: 2 },
    right: { col: 3, row: 2 },
    bottomLeft: { col: 1, row: 3 },
    bottom: { col: 2, row: 3 },
    bottomRight: { col: 3, row: 3 },
    fallback: { col: 2, row: 1 },
  },
} as const satisfies {
  floor: FloorSpriteCatalog
  walls: WallSpriteCatalog
}
