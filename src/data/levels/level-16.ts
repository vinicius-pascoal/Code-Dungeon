import { Level } from '../../types/game'

export const levelSixteen: Level = {
  id: 16,
  worldId: 5,
  name: 'Primeira Funcao',
  description: 'Introducao a blocos reutilizaveis de comandos.',
  objective: 'Use uma funcao para organizar uma pequena rota ate a saida.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'function', 'return', 'print'],
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
    ['WALL', 'FLOOR', 'WALL', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 4, twoStars: 6 },
  concepts: ['functions', 'reuse'],
  requiredCommands: ['function'],
  isPlayable: true,
}
