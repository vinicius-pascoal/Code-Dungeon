import { Level } from '../../types/game'

export const levelFifteen: Level = {
  id: 15,
  worldId: 4,
  name: 'Escada de For',
  description: 'Segmentos repetidos agora atravessam espinhos, inimigo, bau e porta.',
  objective: 'Use for com contador para vencer trechos repetidos sem listar cada passo.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'attack', 'grabKey', 'openDoor', 'openChest', 'for', 'let', 'print'],
  playerStart: {
    x: 1,
    y: 5,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'EXIT', 'DOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'CHEST', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'KEY', 'SPIKE', 'FLOOR', 'FLOOR', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [{ x: 5, y: 5, defeated: false }],
  starRules: { threeStars: 16, twoStars: 20 },
  concepts: ['loops', 'for', 'counter', 'spikes', 'combat', 'keys', 'doors', 'chests'],
  requiredCommands: ['for', 'let', 'attack', 'grabKey', 'openDoor', 'openChest'],
  isPlayable: true,
}
