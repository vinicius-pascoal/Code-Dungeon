import { Level } from '../../types/game'

export const levelEleven: Level = {
  id: 11,
  worldId: 3,
  name: 'Sentinela Oculto',
  description: 'Leia o que existe a frente antes de agir.',
  objective: 'Use if e look() para decidir quando atacar e quando virar.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'attack', 'if', 'look', 'print'],
  playerStart: {
    x: 1,
    y: 3,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'EXIT', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [{ x: 2, y: 3, defeated: false }],
  starRules: { threeStars: 10, twoStars: 13 },
  concepts: ['conditionals', 'sensing', 'combat'],
  requiredCommands: ['if', 'look'],
  hideWalls: false,
  isPlayable: true,
}
