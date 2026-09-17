import { Level } from '../../types/game'

export const levelSixteen: Level = {
  id: 16,
  worldId: 5,
  name: 'Primeira Funcao',
  description: 'Um corredor curto com espacos vazios nas bordas para focar no primeiro bloco reutilizavel.',
  objective: 'Crie uma funcao de passo e reutilize ela para coletar a chave, abrir o bau, abrir a porta e chegar na saida.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'grabKey', 'openDoor', 'openChest', 'function', 'return', 'print'],
  playerStart: {
    x: 1,
    y: 1,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'KEY', 'CHEST', 'DOOR', 'EXIT', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 5, twoStars: 8 },
  concepts: ['functions', 'reuse', 'void', 'keys', 'doors', 'chests'],
  requiredCommands: ['function', 'grabKey', 'openDoor', 'openChest'],
  isPlayable: true,
}
