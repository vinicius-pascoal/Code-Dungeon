import type { DemoConfig } from './types'
import { step } from './types'

export const demo10: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL', 'WALL'], ['FLOOR', 'KEY', 'FLOOR', 'DOOR', 'EXIT'], ['WALL', 'WALL', 'WALL', 'WALL', 'WALL']],
  code: ['grabKey();', 'attack();', 'openDoor();'],
  steps: [step('grabKey();', 0, 1, 'RIGHT'), step('attack();', 1, 1, 'RIGHT'), step('openDoor();', 2, 1, 'RIGHT')],
  enemy: { x: 2, y: 1 },
}
