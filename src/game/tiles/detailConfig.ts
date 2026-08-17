import type { SpriteAtlasConfig } from './tileConfig'

export const DETAILS_TILESET_CONFIG = {
  src: '/assets/tilesets/details.png',
  sourceTileSize: 20,
  columns: 7,
  rows: 14,
  width: 140,
  height: 280,
} as const satisfies SpriteAtlasConfig
