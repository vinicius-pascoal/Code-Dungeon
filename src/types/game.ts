export type TileType =
  | 'FLOOR'
  | 'WALL'
  | 'SPIKE'
  | 'DOOR'
  | 'OPEN_DOOR'
  | 'CHEST'
  | 'OPEN_CHEST'
  | 'KEY'
  | 'EXIT'

export type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'

export type EntityType = 'PLAYER' | 'ENEMY'

export type PlayerState = {
  x: number
  y: number
  direction: Direction
  keys: number
  openedChests: number
}

export type Enemy = {
  x: number
  y: number
  defeated: boolean
}

export type StarRules = {
  threeStars: number
  twoStars: number
}

export type Level = {
  id: number
  worldId?: number
  name: string
  description: string
  objective: string
  availableCommands: string[]
  playerStart: PlayerState
  grid: TileType[][]
  enemies: Enemy[]
  starRules: StarRules
  concepts?: string[]
  isPlayable?: boolean
}

export type World = {
  id: number
  name: string
  description: string
  theme: string
  levelIds: number[]
}

export type GameState = {
  grid: TileType[][]
  player: PlayerState
  enemies: Enemy[]
}
