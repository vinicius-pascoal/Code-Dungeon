import type { DemoConfig } from './types'
import { step } from './types'

export const demo14: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'], ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'EXIT', 'WALL'], ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL']],
  code: ['let steps = 0;', 'while (steps < 5) {', '  moveForward();', '  steps++;', '}'],
  steps: [step('moveForward();', 1, 1, 'RIGHT'), step('moveForward();', 2, 1, 'RIGHT'), step('moveForward();', 3, 1, 'RIGHT'), step('moveForward();', 4, 1, 'RIGHT'), step('moveForward();', 5, 1, 'RIGHT')],
}
