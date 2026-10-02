import type { DemoConfig } from './types'
import { step } from './types'

export const demo06: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL'], ['FLOOR', 'FLOOR', 'FLOOR', 'EXIT'], ['WALL', 'WALL', 'WALL', 'WALL']],
  code: ['attack();', 'moveForward();'],
  steps: [step('attack();', 0, 1, 'RIGHT'), step('moveForward();', 1, 1, 'RIGHT')],
  enemy: { x: 1, y: 1 },
}
