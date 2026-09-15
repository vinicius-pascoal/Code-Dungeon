import { Level } from '../../types/game'

export const levelTwelve: Level = {
  id: 12,
  worldId: 3,
  name: 'Corredor Oculto',
  description: 'As paredes estao escondidas: avance apenas quando look() indicar caminho livre.',
  objective: 'Use if/else com look() para navegar por um corredor sem depender do mapa visivel.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'if', 'else', 'look', 'print'],
  playerStart: {
    x: 1,
    y: 4,
    direction: 'UP',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'EXIT', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 45, twoStars: 55 },
  concepts: ['conditionals', 'else', 'sensing'],
  requiredCommands: ['if', 'else', 'look'],
  hideWalls: false,
  isPlayable: true,
}
