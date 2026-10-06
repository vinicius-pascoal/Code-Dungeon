import type { DemoConfig } from './types'
import { step } from './types'

export const demo19: DemoConfig = {
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'DOOR', 'EXIT', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL']
  ],
  code: ['function patrol(steps) {', '  for (let i = 0; i < steps; i++) {', '    if (look() == "ENEMY") {', '      attack();', '    } else {', '      moveForward();', '    }', '  }', '}', 'patrol(5);'],
  steps: [step('patrol(5);', 1, 1, 'RIGHT', true, ['look();']), step('attack();', 2, 1, 'RIGHT'), step('moveForward();', 3, 1, 'RIGHT'), step('moveForward();', 4, 1, 'RIGHT'), step('moveForward();', 5, 1, 'RIGHT')],
  enemy: { x: 2, y: 1 },
}
