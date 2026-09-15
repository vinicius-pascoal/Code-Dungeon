import { Level } from '../../types/game'

export const levelEighteen: Level = {
  id: 18,
  worldId: 5,
  name: 'Funcoes e Planejamento',
  description: 'Aplique pensamento modular em uma fase curta.',
  objective: 'Pense em blocos de acao repetiveis.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'attack', 'function', 'return', 'print'],
  playerStart: {
    x: 1,
    y: 2,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'EXIT', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [{ x: 2, y: 2, defeated: false }],
  starRules: { threeStars: 4, twoStars: 6 },
  concepts: ['functions', 'planning'],
  requiredCommands: ['function'],
  isPlayable: true,
}
