import { Level } from '../../types/game'

export const levelThirteen: Level = {
  id: 13,
  worldId: 3,
  name: 'Patrulha no Escuro',
  description: 'Combine decisao, combate, chave, porta, bau e espinhos em uma rota curta.',
  objective: 'Use if/else, look() e attack() para reagir aos bloqueios antes de abrir a saida.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'attack', 'grabKey', 'openDoor', 'openChest', 'if', 'else', 'look', 'print'],
  playerStart: {
    x: 1,
    y: 4,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'CHEST', 'EXIT', 'WALL'],
    ['WALL', 'FLOOR', 'KEY', 'SPIKE', 'FLOOR', 'DOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [
    { x: 4, y: 4, defeated: false },
  ],
  starRules: { threeStars: 15, twoStars: 19 },
  concepts: ['conditionals', 'else-if', 'sensing', 'combat', 'spikes', 'keys', 'doors', 'chests'],
  requiredCommands: ['if', 'else', 'look', 'attack', 'grabKey', 'openDoor', 'openChest'],
  hideWalls: false,
  hiddenCells: [
    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 4, y: 4 },
    { x: 4, y: 3 },
    { x: 5, y: 4 },
  ],
  isPlayable: true,
}
