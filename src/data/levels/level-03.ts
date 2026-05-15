import { Level } from '../../types/game'

export const levelThree: Level = {
  id: 3,
  name: 'Virando à Esquerda',
  description: 'O caminho exige uma curva à esquerda.',
  objective: 'Use turnLeft() para alcançar a saída.',
  availableCommands: ['moveForward', 'turnLeft', 'print'],
  playerStart: {
    x: 3,
    y: 3,
    direction: 'UP',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'EXIT', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 4, twoStars: 5 },
}
