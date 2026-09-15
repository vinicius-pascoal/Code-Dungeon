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
import { levelNineteen } from './level-19'
import { generateProceduralMazeLevel } from './level-procedural'
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
  levelNineteen,
]

export const proceduralMazeLevel = generateProceduralMazeLevel()

export const worlds: World[] = [
  {
    id: 1,
    name: 'Mundo 1 - Sequencia Basica',
    description: 'Aprenda a mover, virar e pensar em ordem de execucao.',
    theme: 'Fundamentos',
    levelIds: [1, 2, 3, 4],
  },
  {
    id: 2,
    name: 'Mundo 2 - Interacoes da Dungeon',
    description: 'Chaves, portas, inimigos e baus entram em cena.',
    theme: 'Interacoes',
    levelIds: [5, 6, 7, 8, 9, 10],
  },
  {
    id: 3,
    name: 'Mundo 3 - Condicionais',
    description: 'Fases de leitura do ambiente e decisoes com if.',
    theme: 'Condicionais',
    levelIds: [11, 12, 13],
  },
  {
    id: 4,
    name: 'Mundo 4 - Loops',
    description: 'Fases de introducao a repeticao e otimizacao da solucao.',
    theme: 'Loops',
    levelIds: [14, 15],
  },
  {
    id: 5,
    name: 'Mundo 5 - Funcoes',
    description: 'Fases de abstracao, reutilizacao e pensamento modular.',
    theme: 'Funcoes',
    levelIds: [16, 17, 18, 19],
  },
  {
    id: 99,
    name: 'Modo Labirinto',
    description: 'Um labirinto procedural gerado infinitamente. Todas as funcionalidades desbloqueadas!',
    theme: 'Desafio',
    levelIds: [999],
  },
]

export function getLevelById(levelId: number) {
  if (levelId === 999) return proceduralMazeLevel

  const levelsById = [...levels].sort((a, b) => a.id - b.id)
  const cumulativeMap = new Map<number, string[]>()
  const seen: string[] = []
  for (const lvl of levelsById) {
    const cmds = lvl.availableCommands || []
    for (const c of cmds) {
      if (!seen.includes(c)) seen.push(c)
    }
    cumulativeMap.set(lvl.id, [...seen])
  }

  const level = levels.find((l) => l.id === levelId)
  if (!level) {
    const first = levelsById[0]
    return { ...first, availableCommands: cumulativeMap.get(first.id) ?? first.availableCommands }
  }

  return { ...level, availableCommands: cumulativeMap.get(level.id) ?? level.availableCommands }
}

export function getWorldByLevelId(levelId: number) {
  if (levelId === 999) {
    return worlds.find((world) => world.id === 99) ?? worlds[0]
  }
  return worlds.find((world) => world.levelIds.includes(levelId)) ?? worlds[0]
}
