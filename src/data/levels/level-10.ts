import { Level } from '../../types/game'

export const levelTen: Level = {
  id: 10,
  name: 'Desafio Final do MVP',
  description: 'Combine paredes, espinhos, inimigo, chave e porta.',
  objective: 'Use todos os comandos do MVP para chegar à saída.',
  availableCommands: [
    'moveForward',
    'turnLeft',
    'turnRight',
    'attack',
    'grabKey',
    'openDoor',
    'openChest',
  ],
  playerStart: {
    x: 1,
    y: 3,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'SPIKE', 'FLOOR', 'CHEST', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'DOOR', 'FLOOR', 'EXIT', 'WALL'],
    ['WALL', 'KEY', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [{ x: 3, y: 1, defeated: false }],
  starRules: { threeStars: 8, twoStars: 10 },
}
