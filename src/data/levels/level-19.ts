import { Level } from '../../types/game'

export const levelNineteen: Level = {
  id: 19,
  worldId: 5,
  name: 'Funcoes e Desafio Final',
  description: 'Fechando o ciclo de funcoes com um mapa compacto.',
  objective: 'Visualize como funcoes podem organizar o caminho.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'function', 'return', 'print'],
  playerStart: {
    x: 1,
    y: 3,
    direction: 'UP',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'EXIT', 'WALL'],
    ['WALL', 'WALL', 'FLOOR', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 5, twoStars: 8 },
  concepts: ['functions', 'milestone'],
  requiredCommands: ['function'],
  isPlayable: true,
}
