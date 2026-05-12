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
import { levelEleven } from './level-11'
import { levelTwelve } from './level-12'
import { levelThirteen } from './level-13'
import { levelFourteen } from './level-14'
import { levelFifteen } from './level-15'
import { levelSixteen } from './level-16'
import { levelSeventeen } from './level-17'
import { levelEighteen } from './level-18'
import { World } from '../../types/game'

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
  levelEleven,
  levelTwelve,
  levelThirteen,
  levelFourteen,
  levelFifteen,
  levelSixteen,
  levelSeventeen,
  levelEighteen,
]

export const worlds: World[] = [
  {
    id: 1,
    name: 'Mundo 1 - Sequência Básica',
    description: 'Aprenda a mover, virar e pensar em ordem de execução.',
    theme: 'Fundamentos',
    levelIds: [1, 2, 3, 4],
  },
  {
    id: 2,
    name: 'Mundo 2 - Interações da Dungeon',
    description: 'Chaves, portas, inimigos e baús entram em cena.',
    theme: 'Interações',
    levelIds: [5, 6, 7, 8, 9, 10],
  },
  {
    id: 3,
    name: 'Mundo 3 - Loops',
    description: 'Fases de introdução à repetição e otimização da solução.',
    theme: 'Loops',
    levelIds: [11, 12],
  },
  {
    id: 4,
    name: 'Mundo 4 - Condicionais',
    description: 'Fases de leitura do ambiente e decisões com if.',
    theme: 'Condicionais',
    levelIds: [13, 14],
  },
  {
    id: 5,
    name: 'Mundo 5 - Funções',
    description: 'Fases de abstração, reutilização e pensamento modular.',
    theme: 'Funções',
    levelIds: [15, 16, 17, 18],
  },
]

export function getLevelById(levelId: number) {
  return levels.find((level) => level.id === levelId) ?? levels[0]
}

export function getWorldByLevelId(levelId: number) {
  return worlds.find((world) => world.levelIds.includes(levelId)) ?? worlds[0]
}
