import { Level } from '../../types/game'

export const levelSeventeen: Level = {
  id: 17,
  worldId: 5,
  name: 'Funcao e Saida',
  description: 'A rota se repete em pequenas acoes: andar, interagir e virar.',
  objective: 'Use funcoes pequenas para atravessar o espinho no tempo certo, abrir o bau e destravar a porta.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'grabKey', 'openDoor', 'openChest', 'function', 'return', 'print'],
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
  starRules: { threeStars: 8, twoStars: 11 },
  concepts: ['functions', 'abstraction', 'void', 'spikes', 'keys', 'doors', 'chests'],
  requiredCommands: ['function', 'grabKey', 'openDoor', 'openChest'],
  isPlayable: true,
}
