import { Level } from '../../types/game'

export const levelFifteen: Level = {
  id: 15,
  worldId: 4,
  name: 'Escada de For',
  description: 'Segmentos repetidos pedem for em vez de uma lista enorme de passos.',
  objective: 'Use for com contador para atravessar quatro segmentos do caminho.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'for', 'let', 'print'],
  playerStart: {
    x: 1,
    y: 5,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL', 'EXIT', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 7, twoStars: 10 },
  concepts: ['loops', 'for', 'counter'],
  requiredCommands: ['for', 'let'],
  isPlayable: true,
}
