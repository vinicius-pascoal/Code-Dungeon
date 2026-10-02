import type { DemoConfig } from './types'
import { step } from './types'

export const demo16: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL'], ['FLOOR', 'FLOOR', 'EXIT'], ['WALL', 'WALL', 'WALL']],
  code: ['function step() {', '  moveForward();', '}', 'step();'],
  steps: [step('moveForward();', 0, 1, 'RIGHT')],
}
