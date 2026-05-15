import { Level } from '../../types/game'

export const levelSeven: Level = {
  id: 7,
  name: 'Chave e Porta',
  description: 'Colete a chave e destrave a porta.',
  objective: 'Use grabKey() e openDoor() para liberar o caminho.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'grabKey', 'openDoor'],
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
    ['WALL', 'KEY', 'DOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 5, twoStars: 6 },
}
