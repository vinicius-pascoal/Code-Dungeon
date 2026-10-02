import type { DemoConfig } from './types'
import { step } from './types'

export const demo14: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL'], ['FLOOR', 'FLOOR', 'FLOOR', 'EXIT'], ['WALL', 'WALL', 'WALL', 'WALL']],
  code: ['let steps = 0;', 'while (steps < 2) {', '  moveForward();', '  steps++;', '}'],
  steps: [step('moveForward();', 0, 1, 'RIGHT'), step('moveForward();', 1, 1, 'RIGHT')],
}
