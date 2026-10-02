import type { DemoConfig } from './types'
import { step } from './types'

export const demo04: DemoConfig = {
  grid: [['WALL', 'WALL', 'FLOOR', 'EXIT'], ['FLOOR', 'FLOOR', 'FLOOR', 'WALL'], ['WALL', 'WALL', 'WALL', 'WALL']],
  code: ['moveForward();', 'turnLeft();', 'moveForward();', 'turnRight();'],
  steps: [step('moveForward();', 0, 1, 'RIGHT'), step('turnLeft();', 1, 1, 'UP'), step('moveForward();', 1, 0, 'UP'), step('turnRight();', 1, 0, 'RIGHT')],
}
