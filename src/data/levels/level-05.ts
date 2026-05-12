import { Level } from '../../types/game'

export const levelFive: Level = {
  id: 5,
  name: 'Espinhos',
  description: 'Evite as células perigosas.',
  objective: 'Chegue à saída sem pisar nos espinhos.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight'],
  playerStart: {
    x: 1,
    y: 3,
    direction: 'UP',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'SPIKE', 'FLOOR', 'EXIT', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'FLOOR', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 5, twoStars: 6 },
}
