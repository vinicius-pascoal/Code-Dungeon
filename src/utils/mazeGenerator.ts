import { TileType } from '../types/game'

type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'

interface Cell {
  x: number
  y: number
  visited: boolean
}

/**
 * Gera um labirinto procedural usando o algoritmo Recursive Backtracking
 * @param width Largura do labirinto (sempre será ajustada para ser ímpar)
 * @param height Altura do labirinto (sempre será ajustada para ser ímpar)
 * @returns Grid com WALL e FLOOR representando o labirinto
 */
export function generateMaze(width: number, height: number): TileType[][] {
  // Garantir que largura e altura sejam ímpares para melhor estrutura de labirinto
  const w = width % 2 === 0 ? width + 1 : width
  const h = height % 2 === 0 ? height + 1 : height

  // Inicializar grid com todas as células como WALL
  const grid: TileType[][] = Array(h)
    .fill(null)
    .map(() => Array(w).fill('WALL'))

  // Inicializar células de tracking
  const visited: boolean[][] = Array(h)
    .fill(null)
    .map(() => Array(w).fill(false))

  // Começar do ponto (1, 1)
  const startX = 1
  const startY = 1
  const stack: Array<{ x: number; y: number }> = []

  // Marcar ponto inicial como FLOOR e visitado
  grid[startY][startX] = 'FLOOR'
  visited[startY][startX] = true
  stack.push({ x: startX, y: startY })

  const directions: Array<{ dx: number; dy: number }> = [
    { dx: 0, dy: -2 }, // UP
    { dx: 2, dy: 0 }, // RIGHT
    { dx: 0, dy: 2 }, // DOWN
    { dx: -2, dy: 0 }, // LEFT
  ]

  // Recursive backtracking
  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    const unvisitedNeighbors: typeof directions = []

    // Encontrar vizinhos não visitados
    for (const dir of directions) {
      const nx = current.x + dir.dx
      const ny = current.y + dir.dy

      if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1 && !visited[ny][nx]) {
        unvisitedNeighbors.push(dir)
      }
    }

    if (unvisitedNeighbors.length > 0) {
      // Escolher direção aleatória
      const randomDir = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)]
      const nx = current.x + randomDir.dx
      const ny = current.y + randomDir.dy

      // Marcar caminho entre células (middle cell)
      const middleX = current.x + randomDir.dx / 2
      const middleY = current.y + randomDir.dy / 2

      grid[middleY][middleX] = 'FLOOR'
      grid[ny][nx] = 'FLOOR'
      visited[ny][nx] = true

      stack.push({ x: nx, y: ny })
    } else {
      // Backtrack
      stack.pop()
    }
  }

  // Adicionar borders de WALL
  const finalGrid: TileType[][] = Array(h + 2)
    .fill(null)
    .map(() => Array(w + 2).fill('WALL'))

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      finalGrid[y + 1][x + 1] = grid[y][x]
    }
  }

  return finalGrid
}

/**
 * Encontra a posição de saída mais distante do início
 * @param grid Grid do labirinto
 * @returns Coordenadas da saída
 */
export function findExitPosition(
  grid: TileType[][]
): { x: number; y: number } {
  const height = grid.length
  const width = grid[0].length

  // BFS para encontrar o ponto mais distante
  const distances: number[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(-1))

  const queue: Array<{ x: number; y: number }> = []

  // Começar do canto superior esquerdo
  let startX = 1
  let startY = 1

  // Encontrar primeira célula de FLOOR
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (grid[y][x] === 'FLOOR') {
        startX = x
        startY = y
        break
      }
    }
  }

  distances[startY][startX] = 0
  queue.push({ x: startX, y: startY })

  let maxDistance = 0
  let exitX = startX
  let exitY = startY

  // BFS
  while (queue.length > 0) {
    const { x, y } = queue.shift()!

    const neighbors = [
      { dx: 0, dy: -1 }, // UP
      { dx: 1, dy: 0 }, // RIGHT
      { dx: 0, dy: 1 }, // DOWN
      { dx: -1, dy: 0 }, // LEFT
    ]

    for (const { dx, dy } of neighbors) {
      const nx = x + dx
      const ny = y + dy

      if (
        nx > 0 &&
        nx < width - 1 &&
        ny > 0 &&
        ny < height - 1 &&
        grid[ny][nx] === 'FLOOR' &&
        distances[ny][nx] === -1
      ) {
        distances[ny][nx] = distances[y][x] + 1

        if (distances[ny][nx] > maxDistance) {
          maxDistance = distances[ny][nx]
          exitX = nx
          exitY = ny
        }

        queue.push({ x: nx, y: ny })
      }
    }
  }

  return { x: exitX, y: exitY }
}

/**
 * Encontra uma posição válida e aleatória no labirinto
 * @param grid Grid do labirinto
 * @returns Coordenadas aleatórias em um piso
 */
export function findRandomFloorPosition(
  grid: TileType[][]
): { x: number; y: number } {
  const height = grid.length
  const width = grid[0].length
  const floorPositions: Array<{ x: number; y: number }> = []

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (grid[y][x] === 'FLOOR') {
        floorPositions.push({ x, y })
      }
    }
  }

  return floorPositions[Math.floor(Math.random() * floorPositions.length)]
}
