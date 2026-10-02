import type { DemoConfig } from './types'
import { step } from './types'

export const demo12: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL', 'WALL'], ['FLOOR', 'KEY', 'SPIKE', 'DOOR', 'EXIT'], ['WALL', 'WALL', 'WALL', 'WALL', 'WALL']],
  code: ['if (look() == "KEY") {', '  grabKey();', '} else {', '  turnRight();', '}'],
  steps: [step('look();', 0, 1, 'RIGHT'), step('turnRight();', 0, 1, 'DOWN')],
  hiddenCells: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }],
  hiddenRevealStep: 1,
}
