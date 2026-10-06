import type { DemoConfig } from './types'
import { step } from './types'

export const demo16: DemoConfig = {
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'EXIT', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL']
  ],
  code: ['function walk(steps) {', '  for (let i = 0; i < steps; i++) {', '    moveForward();', '  }', '}', 'walk(5);'],
  steps: [step('walk(5);', 1, 1, 'RIGHT', true, ['moveForward();']), step('moveForward();', 2, 1, 'RIGHT'), step('moveForward();', 3, 1, 'RIGHT'), step('moveForward();', 4, 1, 'RIGHT'), step('moveForward();', 5, 1, 'RIGHT')],
}
