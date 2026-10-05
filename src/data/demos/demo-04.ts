import type { DemoConfig } from './types'
import { step } from './types'

export const demo04: DemoConfig = {
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'EXIT', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'FLOOR', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  code: ['moveForward();', 'turnLeft();', 'moveForward();', 'turnRight();'],
  steps: [step('moveForward();', 1, 3, 'RIGHT'), step('turnLeft();', 2, 3, 'UP'), step('moveForward();', 2, 2, 'UP'), step('turnRight();', 2, 1, 'RIGHT')],
}
