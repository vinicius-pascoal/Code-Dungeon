import { Level } from '../../types/game'

export const levelOne: Level = {
  id: 1,
  name: 'Primeiros Passos',
  description: 'Aprenda a mover o personagem para frente.',
  objective: 'Chegue até a saída.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight'],
  playerStart: {
    x: 1,
    y: 1,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'EXIT', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 2, twoStars: 3 },
}
