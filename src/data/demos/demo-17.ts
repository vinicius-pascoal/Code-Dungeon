import type { DemoConfig } from './types'
import { step } from './types'

export const demo17: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'], ['WALL', 'FLOOR', 'FLOOR', 'KEY', 'FLOOR', 'FLOOR', 'EXIT', 'WALL'], ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL']],
  code: ['function collectKey(steps) {', '  for (let i = 0; i < steps; i++) {', '    moveForward();', '  }', '  grabKey();', '}', 'collectKey(2);'],
  steps: [step('collectKey(2);', 1, 1, 'RIGHT', true, ['moveForward();']), step('moveForward();', 2, 1, 'RIGHT'), step('grabKey();', 3, 1, 'RIGHT')],
}
