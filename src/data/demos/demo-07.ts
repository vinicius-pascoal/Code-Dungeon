import type { DemoConfig } from './types'
import { step } from './types'

export const demo07: DemoConfig = {
  grid: [['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'], ['WALL', 'FLOOR', 'KEY', 'DOOR', 'EXIT', 'WALL'], ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL']],
  code: ['moveForward();', 'grabKey();', 'moveForward();', 'openDoor();'],
  steps: [step('moveForward();', 1, 1, 'RIGHT'), step('grabKey();', 2, 1, 'RIGHT'), step('moveForward();', 3, 1, 'RIGHT'), step('openDoor();', 3, 1, 'RIGHT')],
}
