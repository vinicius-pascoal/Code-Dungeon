import { Level } from '../../types/game'

export const levelFour: Level = {
  id: 4,
  name: 'Caminho com Paredes',
  description: 'Planeje a rota para não bater nas paredes.',
  objective: 'Encontre a rota segura até a saída.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'print'],
  playerStart: {
    x: 1,
    y: 3,
    direction: 'UP',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'WALL', 'EXIT', 'WALL'],
    ['WALL', 'WALL', 'FLOOR', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 5, twoStars: 6 },
}
