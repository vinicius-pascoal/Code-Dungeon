import { Level } from '../../types/game'

export const levelEleven: Level = {
  id: 11,
  worldId: 3,
  name: 'Loop de Primeiro Passo',
  description: 'O primeiro contato com repetição controlada.',
  objective: 'Aprenda o conceito de repetir ações em sequência.',
  availableCommands: ['moveForward', 'turnRight'],
  playerStart: {
    x: 1,
    y: 2,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'EXIT', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 4, twoStars: 6 },
  concepts: ['loops', 'repetition'],
  isPlayable: false,
}
