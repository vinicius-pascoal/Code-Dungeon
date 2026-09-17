import { Level } from '../../types/game'

export const levelNineteen: Level = {
  id: 19,
  worldId: 5,
  name: 'Funcoes e Desafio Final',
  description: 'Fechando o ciclo com funcoes parametrizadas, leitura do ambiente, celulas ocultas e espacos vazios.',
  objective: 'Combine funcoes, for e if com look() para lidar com tiles ocultos, espinhos, inimigos, bau, chave e porta.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'attack', 'grabKey', 'openDoor', 'openChest', 'look', 'if', 'else', 'for', 'let', 'function', 'return', 'print'],
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
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'CHEST', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'KEY', 'SPIKE', 'FLOOR', 'FLOOR', 'WALL', 'VOID', 'VOID'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'VOID', 'VOID'],
  ],
  enemies: [
    { x: 5, y: 5, defeated: false },
    { x: 5, y: 3, defeated: false },
  ],
  starRules: { threeStars: 12, twoStars: 16 },
  concepts: ['functions', 'milestone', 'loops', 'conditionals', 'sensing', 'hidden-cells', 'void', 'combat', 'spikes', 'keys', 'doors', 'chests'],
  requiredCommands: ['function', 'for', 'let', 'if', 'else', 'look', 'attack', 'grabKey', 'openDoor', 'openChest'],
  hiddenCells: [
    { x: 2, y: 5 },
    { x: 3, y: 5 },
    { x: 5, y: 5 },
    { x: 5, y: 3 },
    { x: 2, y: 1 },
  ],
  isPlayable: true,
}
