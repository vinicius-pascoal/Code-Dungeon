import { Level } from '../../types/game'
import { generateMaze, findExitPosition, findRandomFloorPosition } from '../../utils/mazeGenerator'

/**
 * Gera um labirinto procedural com tamanho grande (51x51)
 * Todas as funcionalidades estão liberadas
 */
export function generateProceduralMazeLevel(): Level {
  // Gerar labirinto de tamanho grande
  const grid = generateMaze(51, 51)

  // Encontrar posição de saída (mais distante)
  const exitPos = findExitPosition(grid)
  grid[exitPos.y][exitPos.x] = 'EXIT'

  // Encontrar posição aleatória para início
  const startPos = findRandomFloorPosition(grid)

  return {
    id: 999,
    name: 'Labirinto Procedural',
    description: 'Um labirinto infinito gerado proceduralmente. Todas as funcionalidades estão disponíveis!',
    objective: 'Encontre a saída do labirinto e escape!',
    availableCommands: [
      'moveForward',
      'turnLeft',
      'turnRight',
      'attack',
      'look',
      'jump',
      'if',
      'else',
      'while',
      'for',
      'function',
      'var',
      'let',
      'const',
      'return',
    ],
    playerStart: {
      x: startPos.x,
      y: startPos.y,
      direction: 'RIGHT',
      keys: 0,
      openedChests: 0,
    },
    grid,
    enemies: [],
    starRules: {
      threeStars: Math.floor(grid[0].length * grid.length * 0.5), // 50% dos tiles
      twoStars: Math.floor(grid[0].length * grid.length * 0.75), // 75% dos tiles
    },
    concepts: ['Labirinto', 'Exploração', 'Algoritmos', 'Otimização'],
    isPlayable: true,
  }
}
