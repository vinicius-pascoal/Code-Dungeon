import type { TileType } from '../../types/game'
import { DETAIL_SPRITES, type DetailSprite } from './detailSprites'

export function resolveDetailSprite(tile: TileType): DetailSprite | null {
  switch (tile) {
    case 'KEY':
      return DETAIL_SPRITES.key
    case 'CHEST':
      return DETAIL_SPRITES.chestClosed
    case 'OPEN_CHEST':
      return DETAIL_SPRITES.chestOpen
    case 'SPIKE':
      return DETAIL_SPRITES.spikes
    case 'EXIT':
      return DETAIL_SPRITES.exit
    default:
      return null
  }
}
