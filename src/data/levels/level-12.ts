import { Level } from '../../types/game'

export const levelTwelve: Level = {
  id: 12,
  worldId: 3,
  name: 'Corredor Oculto',
  description: 'Decida quando avancar, quando coletar e quando interagir com objetos no caminho.',
  objective: 'Use if/else com look() para atravessar espinhos, coletar a chave, abrir o bau e passar pela porta.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'grabKey', 'openDoor', 'openChest', 'if', 'else', 'look', 'print'],
  playerStart: {
    x: 1,
    y: 2,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['VOID', 'VOID', 'VOID', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'CHEST', 'EXIT', 'WALL'],
    ['WALL', 'FLOOR', 'KEY', 'SPIKE', 'FLOOR', 'DOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'VOID'],
  ],
  enemies: [],
  starRules: { threeStars: 13, twoStars: 17 },
  concepts: ['conditionals', 'else', 'sensing', 'spikes', 'keys', 'doors', 'chests'],
  requiredCommands: ['if', 'else', 'look', 'grabKey', 'openDoor', 'openChest'],
  hideWalls: false,
  hiddenCells: [
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 4, y: 1 },
    { x: 5, y: 2 },
  ],
  isPlayable: true,
}
