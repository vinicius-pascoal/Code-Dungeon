import type { DemoConfig } from './types'
import { step } from './types'

export const demo08: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL', 'WALL'], ['WALL', 'FLOOR', 'CHEST', 'EXIT', 'WALL'], ['WALL', 'WALL', 'WALL', 'WALL', 'WALL']],
  code: ['moveForward();', 'openChest();'],
  steps: [step('moveForward();', 2, 1, 'RIGHT'), step('openChest();', 2, 1, 'RIGHT')],
}
