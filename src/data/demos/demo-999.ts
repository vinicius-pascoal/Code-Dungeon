import type { DemoConfig } from './types'
import { step } from './types'

export const demo999: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL', 'WALL'], ['WALL', 'FLOOR', 'FLOOR', 'EXIT', 'WALL'], ['WALL', 'WALL', 'WALL', 'WALL', 'WALL']],
  code: ['while (true) {', '  if (look() == "ENEMY") {', '    attack();', '  } else {', '    moveForward();', '  }', '}'],
  steps: [step('look();', 1, 1, 'RIGHT'), step('attack();', 2, 1, 'RIGHT'), step('moveForward();', 2, 1, 'RIGHT')],
  enemy: { x: 2, y: 1 },
}
