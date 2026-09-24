import { Level } from '../../types/game'

export const levelFive: Level = {
  id: 5,
  name: 'Espinhos',
  description: 'Evite as células perigosas.',
  objective: 'Chegue à saída sem pisar nos espinhos.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'await'],
  requiredCommands: ['await'],
  playerStart: {
    x: 1,
    y: 2,
    direction: 'UP',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['VOID', 'VOID', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'FLOOR', 'EXIT', 'WALL'],
    ['WALL', 'FLOOR', 'SPIKE', 'FLOOR', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'VOID'],
  ],
  enemies: [],
  starRules: { threeStars: 5, twoStars: 6 },
}
