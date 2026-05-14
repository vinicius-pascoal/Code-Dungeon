import { Level } from '../../types/game'

export const levelFifteen: Level = {
  id: 15,
  worldId: 5,
  name: 'Primeira Função',
  description: 'Introdução a blocos reutilizáveis de comandos.',
  objective: 'Entenda o papel das funções no código do jogador.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight'],
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
  isPlayable: true,
}
