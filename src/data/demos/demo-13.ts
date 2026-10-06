import type { DemoConfig } from './types'
import { step } from './types'

export const demo13: DemoConfig = {
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'KEY', 'CHEST', 'EXIT', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL']
  ],
  code: ['if (look() == "ENEMY") {', '  attack();', '} else if (look() == "KEY") {', '  grabKey();', '}'],
  steps: [step('look();', 1, 1, 'RIGHT'), step('attack();', 1, 1, 'RIGHT'), step('moveForward();', 2, 1, 'RIGHT'), step('moveForward();', 3, 1, 'RIGHT'), step('grabKey();', 3, 1, 'RIGHT')],
  enemy: { x: 2, y: 1 },
  hiddenCells: [{ x: 2, y: 1 }, { x: 3, y: 1 }],
  hiddenRevealStep: 1,
}
