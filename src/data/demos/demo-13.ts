import type { DemoConfig } from './types'
import { step } from './types'

export const demo13: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL', 'WALL'], ['FLOOR', 'KEY', 'FLOOR', 'CHEST', 'EXIT'], ['WALL', 'WALL', 'WALL', 'WALL', 'WALL']],
  code: ['look();', 'grabKey();', 'moveForward();'],
  steps: [step('look();', 0, 1, 'RIGHT'), step('grabKey();', 1, 1, 'RIGHT'), step('moveForward();', 2, 1, 'RIGHT')],
  enemy: { x: 2, y: 1 },
  hiddenCells: [{ x: 1, y: 1 }, { x: 2, y: 1 }],
  hiddenRevealStep: 1,
}
