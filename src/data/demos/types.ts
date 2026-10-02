import type { Direction, TileType } from '../../types/game'

export type DemoStep = {
  command: string
  x: number
  y: number
  direction: Direction
  spikesActive: boolean
}

export type DemoConfig = {
  grid: TileType[][]
  code: string[]
  steps: DemoStep[]
  enemy?: { x: number; y: number }
  hiddenCells?: Array<{ x: number; y: number }>
  hiddenRevealStep?: number
}

export function step(command: string, x: number, y: number, direction: Direction, spikesActive = true): DemoStep {
  return { command, x, y, direction, spikesActive }
}
