import type { TileType } from '../../types/game'
import type { TileSprite } from './tileConfig'
import { DUNGEON_SPRITES, type DoorOrientation } from './tileDefinitions'

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

const DEFAULT_DOOR_ORIENTATION: DoorOrientation = 'north'
const INVERTED_DOOR_ORIENTATION: Record<DoorOrientation, DoorOrientation> = {
  north: 'south',
  east: 'west',
  south: 'north',
  west: 'east',
}

function tileAt(map: TileMap, x: number, y: number): TileType | undefined {
  return map[y]?.[x]
}

function isStructuralTile(tile: TileType | undefined): boolean {
  return tile === 'WALL' || tile === 'DOOR' || tile === 'OPEN_DOOR'
}

function isOpenTile(tile: TileType | undefined): boolean {
  return tile !== undefined && !isStructuralTile(tile)
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

export function resolveDoorOrientation({ map, x, y }: TilePosition): DoorOrientation {
  const top = tileAt(map, x, y - 1)
  const right = tileAt(map, x + 1, y)
  const bottom = tileAt(map, x, y + 1)
  const left = tileAt(map, x - 1, y)

  const wallTop = isStructuralTile(top)
  const wallRight = isStructuralTile(right)
  const wallBottom = isStructuralTile(bottom)
  const wallLeft = isStructuralTile(left)

  const openTop = isOpenTile(top)
  const openRight = isOpenTile(right)
  const openBottom = isOpenTile(bottom)
  const openLeft = isOpenTile(left)

  if (wallLeft && wallRight) {
    if (openTop && !openBottom) return 'north'
    if (openBottom && !openTop) return 'south'
    return DEFAULT_DOOR_ORIENTATION
  }

  if (wallTop && wallBottom) {
    if (openRight && !openLeft) return 'east'
    if (openLeft && !openRight) return 'west'
    return 'east'
  }

  if (wallTop) return 'north'
  if (wallRight) return 'east'
  if (wallBottom) return 'south'
  if (wallLeft) return 'west'

  return DEFAULT_DOOR_ORIENTATION
}

export function resolveDoorSprite({
  map,
  x,
  y,
  isOpen,
  orientation,
}: TilePosition & {
  isOpen: boolean
  orientation?: DoorOrientation
}): TileSprite {
  const resolvedOrientation = orientation ?? resolveDoorOrientation({ map, x, y })
  const spriteOrientation = INVERTED_DOOR_ORIENTATION[resolvedOrientation]
  const state = isOpen ? 'open' : 'closed'

  return DUNGEON_SPRITES.door[state][spriteOrientation]
}

export function resolveTileSprite({ tile, map, x, y, hideWalls, levelId }: ResolveTileSpriteArgs): TileSprite | null {
  if (tile === 'WALL') {
    return hideWalls ? null : resolveWallSprite({ map, x, y })
  }

  if (tile === 'DOOR' || tile === 'OPEN_DOOR') {
    return resolveDoorSprite({ map, x, y, isOpen: tile === 'OPEN_DOOR' })
  }

  return resolveFloorSprite({ x, y, levelId })
}
