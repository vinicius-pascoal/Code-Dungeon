import type { DemoConfig } from './types'
import { step } from './types'

export const demo10: DemoConfig = {
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'KEY', 'FLOOR', 'DOOR', 'EXIT', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL']
  ],
  code: ['moveForward();', 'grabKey();', 'attack();', 'openDoor();', 'moveForward();'],
  steps: [step('moveForward();', 1, 1, 'RIGHT'), step('grabKey();', 2, 1, 'RIGHT'), step('attack();', 3, 1, 'RIGHT'), step('openDoor();', 4, 1, 'RIGHT'), step('moveForward();', 4, 1, 'RIGHT')],
  enemy: { x: 3, y: 1 },
}
