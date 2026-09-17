import { Level } from '../../types/game'

export const levelEleven: Level = {
  id: 11,
  worldId: 3,
  name: 'Sentinela Oculto',
  description: 'O primeiro desafio de leitura agora mistura combate, chave, bau e porta.',
  objective: 'Use if e look() para atacar o sentinela, pegar a chave, abrir o bau e destravar a porta.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'attack', 'grabKey', 'openDoor', 'openChest', 'if', 'look', 'print'],
  playerStart: {
    x: 1,
    y: 3,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'DOOR', 'EXIT', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'KEY', 'CHEST', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [{ x: 2, y: 3, defeated: false }],
  starRules: { threeStars: 12, twoStars: 15 },
  concepts: ['conditionals', 'sensing', 'combat', 'keys', 'doors', 'chests'],
  requiredCommands: ['if', 'look', 'attack', 'grabKey', 'openDoor', 'openChest'],
  hideWalls: false,
  hiddenCells: [
    { x: 2, y: 3 },
    { x: 3, y: 3 },
  ],
  isPlayable: true,
}
