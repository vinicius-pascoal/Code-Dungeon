import type { DemoConfig } from './types'
import { step } from './types'

export const demo09: DemoConfig = {
  grid: [['WALL', 'WALL', 'FLOOR', 'EXIT'], ['FLOOR', 'FLOOR', 'FLOOR', 'WALL'], ['WALL', 'WALL', 'WALL', 'WALL']],
  code: ['moveForward();', 'moveForward();', 'turnLeft();'],
  steps: [step('moveForward();', 0, 1, 'RIGHT'), step('moveForward();', 1, 1, 'RIGHT'), step('turnLeft();', 2, 1, 'UP')],
}
