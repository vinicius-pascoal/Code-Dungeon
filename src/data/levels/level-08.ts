import { Level } from '../../types/game'

export const levelEight: Level = {
  id: 8,
  name: 'Baú Opcional',
  description: 'Abra o baú para treinar a interação com objetos.',
  objective: 'Explore o corredor e chegue até a saída.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'openChest'],
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
    ['WALL', 'CHEST', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 5, twoStars: 6 },
}
