import { Level } from '../../types/game'

export const levelNine: Level = {
  id: 9,
  name: 'Caminho Longo',
  description: 'Resolva uma fase maior com mais planejamento.',
  objective: 'Encontre a melhor sequência de movimentos.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'print'],
  playerStart: {
    x: 1,
    y: 4,
    direction: 'UP',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'WALL', 'FLOOR', 'EXIT', 'WALL'],
    ['WALL', 'WALL', 'FLOOR', 'WALL', 'FLOOR', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 7, twoStars: 9 },
}
