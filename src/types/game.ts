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

export type PlayerState = {
  x: number
  y: number
  direction: Direction
  keys: number
  openedChests: number
}

export type Level = {
  id: number
  name: string
  description: string
  objective: string
  availableCommands: string[]
  playerStart: PlayerState
  grid: TileType[][]
}
