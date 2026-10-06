import type { DemoConfig } from './types'
import { step } from './types'

export const demo04: DemoConfig = {
  grid: [
    ['VOID', 'WALL', 'WALL', 'WALL', 'VOID'],
    ['VOID', 'WALL', 'EXIT', 'WALL', 'VOID'],
    ['WALL', 'WALL', 'FLOOR', 'WALL', 'VOID'],
    ['WALL', 'FLOOR', 'FLOOR', 'WALL', 'VOID'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'VOID'],
  ],
  code: ['moveForward();', 'turnLeft();', 'moveForward();', 'turnRight();'],
  steps: [step('moveForward();', 1, 3, 'RIGHT'), step('turnLeft();', 2, 3, 'UP'), step('moveForward();', 2, 2, 'UP'), step('turnRight();', 2, 1, 'RIGHT')],
}
