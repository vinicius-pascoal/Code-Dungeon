import { Level } from '../../types/game'

export const levelTwo: Level = {
  id: 2,
  name: 'Virando à Direita',
  description: 'Aprenda a combinar avanço e giro à direita.',
  objective: 'Chegue até a saída usando uma curva à direita.',
  availableCommands: ['moveForward', 'turnRight', 'print'],
  playerStart: {
    x: 1,
    y: 3,
    direction: 'UP',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'EXIT', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 4, twoStars: 5 },
}
