import type { DemoConfig } from './types'
import { step } from './types'

export const demo18: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL'], ['FLOOR', 'FLOOR', 'FLOOR', 'EXIT'], ['WALL', 'WALL', 'WALL', 'WALL']],
  code: ['function clearAndStep() {', '  attack();', '  moveForward();', '}'],
  steps: [step('attack();', 0, 1, 'RIGHT'), step('moveForward();', 1, 1, 'RIGHT')],
  enemy: { x: 1, y: 1 },
}
