import { Level } from '../../types/game'

export const levelNineteen: Level = {
  id: 19,
  worldId: 4,
  name: 'Demo Look',
  description: 'Demonstração do comando look() para leitura do tile à frente.',
  objective: 'Use `look()` para detectar inimigos e paredes antes de agir.',
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
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'EXIT', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'ENEMY', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [{ x: 3, y: 2, defeated: false }],
  starRules: { threeStars: 3, twoStars: 5 },
  concepts: ['conditionals', 'if', 'sensing'],
  isPlayable: true,
}
