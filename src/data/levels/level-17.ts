import { Level } from '../../types/game'

export const levelSeventeen: Level = {
  id: 17,
  worldId: 5,
  name: 'Funcao e Saida',
  description: 'Funcoes entram em uma rota com espinho, bau e porta.',
  objective: 'Use uma funcao para repetir passos e sincronizar a passagem pelos espinhos.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'grabKey', 'openDoor', 'openChest', 'function', 'return', 'print'],
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
  enemies: [],
  starRules: { threeStars: 10, twoStars: 13 },
  concepts: ['functions', 'abstraction', 'spikes', 'keys', 'doors', 'chests'],
  requiredCommands: ['function', 'grabKey', 'openDoor', 'openChest'],
  isPlayable: true,
}
