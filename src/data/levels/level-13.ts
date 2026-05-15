import { Level } from '../../types/game'

export const levelThirteen: Level = {
  id: 13,
  worldId: 4,
  name: 'If na Frente',
  description: 'Primeiro contato com decisões baseadas no ambiente.',
  objective: 'Aprenda a reagir a obstáculos com condicionais.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'attack', 'look', 'print'],
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
  enemies: [{ x: 2, y: 2, defeated: false }],
  starRules: { threeStars: 4, twoStars: 6 },
  concepts: ['conditionals', 'if'],
  isPlayable: true,
}
