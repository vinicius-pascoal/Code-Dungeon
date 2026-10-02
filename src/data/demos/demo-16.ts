import type { DemoConfig } from './types'
import { step } from './types'

export const demo16: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL'], ['FLOOR', 'FLOOR', 'EXIT'], ['WALL', 'WALL', 'WALL']],
  code: ['function step() {', '  moveForward();', '}', 'step();'],
  steps: [step('step();', 1, 1, 'RIGHT', true, ['moveForward();'])],
}
