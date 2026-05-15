import { Level } from '../../types/game'

export const levelSix: Level = {
  id: 6,
  name: 'Primeiro Inimigo',
  description: 'Ataque o inimigo bloqueando o corredor.',
  objective: 'Derrote o inimigo e siga até a saída.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'attack'],
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
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [{ x: 2, y: 2, defeated: false }],
  starRules: { threeStars: 4, twoStars: 5 },
}
