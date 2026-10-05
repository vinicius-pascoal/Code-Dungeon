import type { DemoConfig } from './types'
import { step } from './types'

export const demo01: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL', 'WALL'], ['WALL', 'FLOOR', 'FLOOR', 'EXIT', 'WALL'], ['WALL', 'WALL', 'WALL', 'WALL', 'WALL']],
  code: ['moveForward();', 'moveForward();'],
  steps: [step('moveForward();', 1, 1, 'RIGHT'), step('moveForward();', 2, 1, 'RIGHT'), step('moveForward();', 3, 1, 'RIGHT')],
}
