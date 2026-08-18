import type { SpriteCoordinate } from './tileConfig'

export type FloorVariant = 'floor1' | 'floor2' | 'floor3'
export type DoorOrientation = 'north' | 'east' | 'south' | 'west'
export type DoorState = 'closed' | 'open'

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

export type TileVariant = FloorVariant | WallVariant | DoorOrientation

type FloorSpriteCatalog = {
  variants: readonly SpriteCoordinate[]
} & Record<FloorVariant, SpriteCoordinate>

type WallSpriteCatalog = Record<WallVariant, SpriteCoordinate>
type DoorSpriteCatalog = Record<DoorState, Record<DoorOrientation, SpriteCoordinate>>

export const DUNGEON_SPRITES = {
  floor: {
    floor1: { col: 14, row: 1 },
    floor2: { col: 15, row: 1 },
    floor3: { col: 16, row: 1 },
    variants: [
      { col: 14, row: 1 },
      { col: 15, row: 1 },
      { col: 16, row: 1 },
    ],
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
  door: {
    closed: {
      north: { col: 13, row: 9 },
      east: { col: 13, row: 10 },
      south: { col: 13, row: 11 },
      west: { col: 13, row: 12 },
    },
    open: {
      north: { col: 14, row: 9 },
      east: { col: 14, row: 10 },
      south: { col: 14, row: 11 },
      west: { col: 14, row: 12 },
    },
  },
} as const satisfies {
  floor: FloorSpriteCatalog
  walls: WallSpriteCatalog
  door: DoorSpriteCatalog
}
