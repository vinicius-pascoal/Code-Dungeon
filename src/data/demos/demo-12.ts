import type { DemoConfig } from './types'
import { step } from './types'

export const demo12: DemoConfig = {
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'KEY', 'SPIKE', 'DOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'EXIT', 'WALL']
  ],
  code: ['if (look() == "KEY") {', '  moveForward();', '  grabKey();', '} else {', '  turnRight();', '}'],
  steps: [step('look();', 1, 1, 'RIGHT'), step('moveForward();', 2, 1, 'RIGHT'), step('grabKey();', 2, 1, 'RIGHT')],
  hiddenCells: [{ x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }],
  hiddenRevealStep: 1,
}
