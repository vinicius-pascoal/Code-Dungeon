import { Level } from '../../types/game'

export const levelEighteen: Level = {
  id: 18,
  worldId: 5,
  name: 'Funções e Desafio Final',
  description: 'Fechando o ciclo de funções com um mapa compacto.',
  objective: 'Visualize como funções podem organizar o caminho.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'print'],
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
  isPlayable: true,
}
