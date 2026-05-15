import { Level } from '../../types/game'

export const levelFourteen: Level = {
  id: 14,
  worldId: 4,
  name: 'If e Repetição',
  description: 'Uma rota curta para introduzir composição de regras.',
  objective: 'Perceba como decisões alteram a execução.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'look', 'print'],
  playerStart: {
    x: 1,
    y: 3,
    direction: 'UP',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'EXIT', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'FLOOR', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 5, twoStars: 7 },
  concepts: ['conditionals', 'planning'],
  isPlayable: true,
}
