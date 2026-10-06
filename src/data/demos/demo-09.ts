import type { DemoConfig } from './types'
import { step } from './types'

export const demo09: DemoConfig = {
  grid: [
    ['VOID', 'VOID', 'WALL', 'WALL', 'WALL'],
    ['VOID', 'VOID', 'WALL', 'EXIT', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  code: ['moveForward();', 'moveForward();', 'turnLeft();'],
  steps: [step('moveForward();', 1, 3, 'RIGHT'), step('moveForward();', 2, 3, 'RIGHT'), step('turnLeft();', 3, 3, 'UP')],
}
