import type { DemoConfig } from './types'
import { step } from './types'

export const demo08: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL'], ['FLOOR', 'CHEST', 'FLOOR', 'EXIT'], ['WALL', 'WALL', 'WALL', 'WALL']],
  code: ['moveForward();', 'openChest();'],
  steps: [step('moveForward();', 0, 1, 'RIGHT'), step('openChest();', 1, 1, 'RIGHT')],
}
