import type { DemoConfig } from './types'
import { step } from './types'

export const demo17: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL'], ['FLOOR', 'KEY', 'EXIT'], ['WALL', 'WALL', 'WALL']],
  code: ['function collectKey() {', '  grabKey();', '}', 'collectKey();'],
  steps: [step('grabKey();', 0, 1, 'RIGHT')],
}
