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
  levelId?: number | string
}

function tileAt(map: TileMap, x: number, y: number): TileType | undefined {
  return map[y]?.[x]
}

function isOpenTile(tile: TileType | undefined): boolean {
  return tile !== undefined && tile !== 'WALL'
}

function getSeedValue(seed: number | string | undefined): number {
  if (seed === undefined) return 0
  if (typeof seed === 'number') return Number.isFinite(seed) ? seed : 0

  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 16777619)
  }
  return hash >>> 0
}

export function getFloorVariantIndex(x: number, y: number, levelId?: number | string): number {
  const seed = getSeedValue(levelId)
  const hash = (
    Math.imul(x, 73856093)
    ^ Math.imul(y, 19349663)
    ^ Math.imul(seed, 83492791)
  ) >>> 0

  return hash % DUNGEON_SPRITES.floor.variants.length
}

export function resolveFloorSprite({ x, y, levelId }: Omit<TilePosition, 'map'> & { levelId?: number | string }): TileSprite {
  return DUNGEON_SPRITES.floor.variants[getFloorVariantIndex(x, y, levelId)]
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

export function resolveTileSprite({ tile, map, x, y, hideWalls, levelId }: ResolveTileSpriteArgs): TileSprite | null {
  if (tile === 'WALL') {
    return hideWalls ? null : resolveWallSprite({ map, x, y })
  }

  return resolveFloorSprite({ x, y, levelId })
}
