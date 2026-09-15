import { Level } from '../../types/game'

export const levelSeventeen: Level = {
  id: 17,
  worldId: 5,
  name: 'Funcao e Saida',
  description: 'Mais um passo para consolidar reutilizacao.',
  objective: 'Use o raciocinio de funcao para encurtar solucoes.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'function', 'return', 'print'],
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
  concepts: ['functions', 'abstraction'],
  requiredCommands: ['function'],
  isPlayable: true,
}
