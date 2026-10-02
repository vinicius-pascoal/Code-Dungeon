import type { DemoConfig } from './types'
import { step } from './types'

export const demo05: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL'], ['FLOOR', 'SPIKE', 'FLOOR', 'EXIT'], ['WALL', 'WALL', 'WALL', 'WALL']],
  code: ['await();', 'await();', 'moveForward();'],
  steps: [step('await();', 0, 1, 'RIGHT', true), step('await();', 0, 1, 'RIGHT', false), step('moveForward();', 1, 1, 'RIGHT', false)],
}
