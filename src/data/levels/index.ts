import { levelOne } from './level-01'
import { levelTwo } from './level-02'
import { levelThree } from './level-03'
import { levelFour } from './level-04'
import { levelFive } from './level-05'
import { levelSix } from './level-06'
import { levelSeven } from './level-07'
import { levelEight } from './level-08'
import { levelNine } from './level-09'
import { levelTen } from './level-10'

export const levels = [
  levelOne,
  levelTwo,
  levelThree,
  levelFour,
  levelFive,
  levelSix,
  levelSeven,
  levelEight,
  levelNine,
  levelTen,
]

export function getLevelById(levelId: number) {
  return levels.find((level) => level.id === levelId) ?? levels[0]
}
