import { Level } from '../../types/game'

export const levelFourteen: Level = {
  id: 14,
  worldId: 4,
  name: 'Contador na Passarela',
  description: 'Um caminho comprido demais para ser elegante com comandos soltos.',
  objective: 'Use while com uma variavel de controle para repetir passos.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'while', 'let', 'print'],
  playerStart: {
    x: 1,
    y: 3,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'EXIT', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 3, twoStars: 5 },
  concepts: ['loops', 'while', 'counter'],
  requiredCommands: ['while', 'let'],
  isPlayable: true,
}
