import { Level } from '../../types/game'

export const levelNineteen: Level = {
  id: 19,
  worldId: 5,
  name: 'Funcoes e Desafio Final',
  description: 'Fechando o ciclo com uma rota modular cheia de obstaculos.',
  objective: 'Combine funcao, repeticao e decisao para lidar com espinhos, inimigos, bau, chave e porta.',
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
    ['WALL', 'WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'CHEST', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'KEY', 'SPIKE', 'FLOOR', 'FLOOR', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [
    { x: 5, y: 5, defeated: false },
    { x: 5, y: 3, defeated: false },
  ],
  starRules: { threeStars: 11, twoStars: 14 },
  concepts: ['functions', 'milestone', 'loops', 'conditionals', 'combat', 'spikes', 'keys', 'doors', 'chests'],
  requiredCommands: ['function', 'for', 'let', 'if', 'look', 'attack', 'grabKey', 'openDoor', 'openChest'],
  isPlayable: true,
}
