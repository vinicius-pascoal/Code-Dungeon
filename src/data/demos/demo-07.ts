import type { DemoConfig } from './types'
import { step } from './types'

export const demo07: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL', 'WALL'], ['FLOOR', 'KEY', 'FLOOR', 'DOOR', 'EXIT'], ['WALL', 'WALL', 'WALL', 'WALL', 'WALL']],
  code: ['grabKey();', 'moveForward();', 'openDoor();'],
  steps: [step('grabKey();', 1, 1, 'RIGHT'), step('moveForward();', 2, 1, 'RIGHT'), step('openDoor();', 2, 1, 'RIGHT')],
}
