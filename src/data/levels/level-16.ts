import { Level } from '../../types/game'

export const levelSixteen: Level = {
  id: 16,
  worldId: 5,
  name: 'Primeira Funcao',
  description: 'A primeira funcao agora ajuda a organizar chave, bau e porta.',
  objective: 'Crie uma funcao simples para repetir passos enquanto coleta a chave e abre a saida.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'grabKey', 'openDoor', 'openChest', 'function', 'return', 'print'],
  playerStart: {
    x: 1,
    y: 2,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'KEY', 'CHEST', 'DOOR', 'EXIT', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 7, twoStars: 10 },
  concepts: ['functions', 'reuse', 'keys', 'doors', 'chests'],
  requiredCommands: ['function', 'grabKey', 'openDoor', 'openChest'],
  isPlayable: true,
}
