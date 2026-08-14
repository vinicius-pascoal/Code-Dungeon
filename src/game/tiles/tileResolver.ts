import type { TileType } from '../../types/game'
import type { TileSprite } from './tileConfig'
import { DUNGEON_SPRITES } from './tileDefinitions'

type TileMap = TileType[][]

type TilePosition = {
  map: TileMap
  x: number
  y: number
}

type ResolveTileSpriteArgs = TilePosition & {
  tile: TileType
  hideWalls?: boolean
}

function tileAt(map: TileMap, x: number, y: number): TileType | undefined {
  return map[y]?.[x]
}

function isOpenTile(tile: TileType | undefined): boolean {
  return tile !== undefined && tile !== 'WALL'
}

export function resolveFloorSprite(): TileSprite {
  return DUNGEON_SPRITES.floor.normal
}

export function resolveWallSprite({ map, x, y }: TilePosition): TileSprite {
  const openTop = isOpenTile(tileAt(map, x, y - 1))
  const openBottom = isOpenTile(tileAt(map, x, y + 1))
  const openLeft = isOpenTile(tileAt(map, x - 1, y))
  const openRight = isOpenTile(tileAt(map, x + 1, y))

  if (openBottom && openRight && !openTop && !openLeft) return DUNGEON_SPRITES.walls.topLeft
  if (openBottom && openLeft && !openTop && !openRight) return DUNGEON_SPRITES.walls.topRight
  if (openTop && openRight && !openBottom && !openLeft) return DUNGEON_SPRITES.walls.bottomLeft
  if (openTop && openLeft && !openBottom && !openRight) return DUNGEON_SPRITES.walls.bottomRight

  const openNeighborCount = [openTop, openBottom, openLeft, openRight].filter(Boolean).length

  if (openNeighborCount === 1) {
    if (openBottom) return DUNGEON_SPRITES.walls.top
    if (openTop) return DUNGEON_SPRITES.walls.bottom
    if (openRight) return DUNGEON_SPRITES.walls.left
    if (openLeft) return DUNGEON_SPRITES.walls.right
  }

  if (openNeighborCount === 0) {
    const openBottomRight = isOpenTile(tileAt(map, x + 1, y + 1))
    const openBottomLeft = isOpenTile(tileAt(map, x - 1, y + 1))
    const openTopRight = isOpenTile(tileAt(map, x + 1, y - 1))
    const openTopLeft = isOpenTile(tileAt(map, x - 1, y - 1))

    if (openBottomRight) return DUNGEON_SPRITES.walls.topLeft
    if (openBottomLeft) return DUNGEON_SPRITES.walls.topRight
    if (openTopRight) return DUNGEON_SPRITES.walls.bottomLeft
    if (openTopLeft) return DUNGEON_SPRITES.walls.bottomRight
  }

  return DUNGEON_SPRITES.walls.fallback
}

export function resolveTileSprite({ tile, map, x, y, hideWalls }: ResolveTileSpriteArgs): TileSprite | null {
  if (tile === 'WALL') {
    return hideWalls ? null : resolveWallSprite({ map, x, y })
  }

  return resolveFloorSprite()
}
