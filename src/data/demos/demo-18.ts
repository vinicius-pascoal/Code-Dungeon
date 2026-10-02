import type { DemoConfig } from './types'
import { step } from './types'

export const demo18: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL'], ['FLOOR', 'FLOOR', 'FLOOR', 'EXIT'], ['WALL', 'WALL', 'WALL', 'WALL']],
  code: ['function clearAndStep() {', '  attack();', '  moveForward();', '}'],
  steps: [step('clearAndStep();', 1, 1, 'RIGHT', true, ['attack();', 'moveForward();'])],
  enemy: { x: 1, y: 1 },
}
