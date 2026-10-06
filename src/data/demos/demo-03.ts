import type { DemoConfig } from './types'
import { step } from './types'

export const demo03: DemoConfig = {
  grid: [
    ['VOID', 'WALL', 'WALL', 'WALL', 'VOID'],
    ['VOID', 'WALL', 'EXIT', 'WALL', 'VOID'],
    ['WALL', 'WALL', 'FLOOR', 'WALL', 'VOID'],
    ['WALL', 'FLOOR', 'FLOOR', 'WALL', 'VOID'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'VOID'],
  ],
  code: ['// comentario', 'moveForward();', 'turnLeft();'],
  steps: [step('moveForward();', 1, 3, 'RIGHT'), step('turnLeft();', 2, 3, 'UP')],
}
