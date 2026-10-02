import type { DemoConfig } from './types'
import { step } from './types'

export const demo11: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL'], ['FLOOR', 'FLOOR', 'FLOOR', 'EXIT'], ['WALL', 'WALL', 'WALL', 'WALL']],
  code: ['if (look() == "ENEMY") {', '  attack();', '}'],
  steps: [step('look();', 0, 1, 'RIGHT'), step('attack();', 1, 1, 'RIGHT')],
  enemy: { x: 1, y: 1 },
  hiddenCells: [{ x: 1, y: 1 }],
  hiddenRevealStep: 1,
}
