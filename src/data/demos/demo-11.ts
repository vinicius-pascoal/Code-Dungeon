import type { DemoConfig } from './types'
import { step } from './types'

export const demo11: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL', 'WALL'], ['WALL', 'FLOOR', 'FLOOR', 'EXIT', 'WALL'], ['WALL', 'WALL', 'WALL', 'WALL', 'WALL']],
  code: ['if (look() == "ENEMY") {', '  attack();', '}'],
  steps: [step('look();', 1, 1, 'RIGHT'), step('attack();', 2, 1, 'RIGHT')],
  enemy: { x: 2, y: 1 },
  hiddenCells: [{ x: 2, y: 1 }],
  hiddenRevealStep: 1,
}
