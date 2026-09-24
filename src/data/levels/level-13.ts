import { Level } from '../../types/game'

export const levelThirteen: Level = {
  id: 13,
  worldId: 3,
  name: 'Patrulha no Escuro',
  description: 'Atravesse uma rota unica com combate, chave, espinhos, bau e porta em pontos diferentes do caminho.',
  objective: 'Use if/else e look() para reagir a cada bloqueio, derrotar o inimigo, abrir o bau e destrancar a saida.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'attack', 'grabKey', 'openDoor', 'openChest', 'if', 'else', 'elif', 'look', 'print'],
  playerStart: {
    x: 1,
    y: 4,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'EXIT', 'DOOR', 'FLOOR', 'CHEST', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'KEY', 'SPIKE', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [
    { x: 2, y: 4, defeated: false },
  ],
  starRules: { threeStars: 15, twoStars: 19 },
  concepts: ['conditionals', 'else-if', 'sensing', 'combat', 'spikes', 'keys', 'doors', 'chests'],
  requiredCommands: ['if', 'else', 'look', 'attack', 'grabKey', 'openDoor', 'openChest'],
  hideWalls: false,
  hiddenCells: [
    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 4, y: 4 },
    { x: 4, y: 1 },
    { x: 2, y: 1 },
  ],
  isPlayable: true,
}
