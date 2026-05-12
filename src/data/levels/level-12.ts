import { Level } from '../../types/game'

export const levelTwelve: Level = {
  id: 12,
  worldId: 3,
  name: 'Loop e Desvio',
  description: 'Combine repetição com mudança de direção.',
  objective: 'Entenda como loops podem reduzir comandos repetidos.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight'],
  playerStart: {
    x: 1,
    y: 3,
    direction: 'UP',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'FLOOR', 'EXIT', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 5, twoStars: 7 },
  concepts: ['loops', 'planning'],
  isPlayable: false,
}
