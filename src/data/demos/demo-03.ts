import type { DemoConfig } from './types'
import { step } from './types'

export const demo03: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL'], ['FLOOR', 'FLOOR', 'EXIT', 'WALL'], ['WALL', 'WALL', 'WALL', 'WALL']],
  code: ['// comentario', 'moveForward();', 'turnLeft();'],
  steps: [step('moveForward();', 0, 1, 'RIGHT'), step('turnLeft();', 1, 1, 'UP')],
}
