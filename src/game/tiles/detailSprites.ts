import type { SpriteCoordinate } from './tileConfig'

export const DETAIL_SPRITES = {
  chestClosed: {
    col: 4,
    row: 1,
  },
  chestOpen: {
    col: 4,
    row: 2,
  },
  key: {
    col: 5,
    row: 2,
  },
  spikes: {
    col: 4,
    row: 4,
  },
  exit: {
    col: 3,
    row: 8,
  },
} as const satisfies Record<string, SpriteCoordinate>

export type DetailSprite = (typeof DETAIL_SPRITES)[keyof typeof DETAIL_SPRITES]
