export const TILESET_CONFIG = {
  src: '/assets/tilesets/tileset.png',
  sourceTileSize: 20,
  columns: 22,
  rows: 14,
  width: 440,
  height: 280,
} as const

export const SOURCE_TILE_SIZE = TILESET_CONFIG.sourceTileSize

export interface SpriteCoordinate {
  col: number
  row: number
}

export type TileSprite = SpriteCoordinate
