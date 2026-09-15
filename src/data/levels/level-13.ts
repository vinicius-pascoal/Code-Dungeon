import { Level } from '../../types/game'

export const levelThirteen: Level = {
  id: 13,
  worldId: 3,
  name: 'Patrulha no Escuro',
  description: 'Misture leitura de parede e leitura de inimigo em um mapa oculto.',
  objective: 'Use if/else, look() e attack() para reagir ao que aparece a frente.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'attack', 'if', 'else', 'look', 'print'],
  playerStart: {
    x: 1,
    y: 4,
    direction: 'UP',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'EXIT', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [
    { x: 3, y: 1, defeated: false },
    { x: 5, y: 2, defeated: false },
  ],
  starRules: { threeStars: 85, twoStars: 105 },
  concepts: ['conditionals', 'else-if', 'sensing', 'combat'],
  requiredCommands: ['if', 'else', 'look', 'attack'],
  hideWalls: false,
  isPlayable: true,
}
