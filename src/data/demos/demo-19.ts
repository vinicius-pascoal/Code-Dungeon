import type { DemoConfig } from './types'
import { step } from './types'

export const demo19: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL', 'WALL'], ['FLOOR', 'FLOOR', 'FLOOR', 'DOOR', 'EXIT'], ['WALL', 'WALL', 'WALL', 'WALL', 'WALL']],
  code: ['for (...) {', '  if (look() == "ENEMY") {', '    attack();', '  } else {', '    moveForward();', '  }', '}'],
  steps: [step('look();', 0, 1, 'RIGHT'), step('attack();', 1, 1, 'RIGHT'), step('moveForward();', 2, 1, 'RIGHT')],
  enemy: { x: 1, y: 1 },
}
