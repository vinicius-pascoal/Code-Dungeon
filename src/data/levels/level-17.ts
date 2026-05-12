import { Level } from '../../types/game'

export const levelSeventeen: Level = {
  id: 17,
  worldId: 5,
  name: 'Funções e Planejamento',
  description: 'Aplique pensamento modular em uma fase curta.',
  objective: 'Pense em blocos de ação repetíveis.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'attack'],
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
  isPlayable: false,
}
