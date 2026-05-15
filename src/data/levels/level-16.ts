import { Level } from '../../types/game'

export const levelSixteen: Level = {
  id: 16,
  worldId: 5,
  name: 'Função e Saída',
  description: 'Mais um passo para consolidar reutilização.',
  objective: 'Use o raciocínio de função para encurtar soluções.',
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
    ['WALL', 'FLOOR', 'WALL', 'FLOOR', 'EXIT', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [],
  starRules: { threeStars: 5, twoStars: 7 },
  concepts: ['functions', 'abstraction'],
  isPlayable: true,
}
