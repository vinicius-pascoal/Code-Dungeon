import type { DemoConfig } from './types'
import { step } from './types'

export const demo03: DemoConfig = {
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'EXIT', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'FLOOR', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  code: ['// comentario', 'moveForward();', 'turnLeft();'],
  steps: [step('moveForward();', 1, 3, 'RIGHT'), step('turnLeft();', 2, 3, 'UP')],
}
