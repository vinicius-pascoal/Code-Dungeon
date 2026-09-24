import { Level, TileType } from '../../types/game'
import { findExitPosition, generateMaze } from '../../utils/mazeGenerator'

type Position = { x: number; y: number }

function positionKey(position: Position) {
  return `${position.x},${position.y}`
}

function findPath(grid: TileType[][], start: Position, target: Position): Position[] {
  const queue: Position[] = [start]
  const visited = new Set([positionKey(start)])
  const previous = new Map<string, Position>()
  let queueIndex = 0

  while (queueIndex < queue.length) {
    const current = queue[queueIndex++]
    if (current.x === target.x && current.y === target.y) break

    for (const { dx, dy } of [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
    ]) {
      const next = { x: current.x + dx, y: current.y + dy }
      const key = positionKey(next)
      if (grid[next.y]?.[next.x] !== 'FLOOR' || visited.has(key)) continue

      visited.add(key)
      previous.set(key, current)
      queue.push(next)
    }
  }

  const path: Position[] = []
  let current: Position | undefined = target
  while (current) {
    path.push(current)
    if (current.x === start.x && current.y === start.y) break
    current = previous.get(positionKey(current))
  }

  return path.reverse()
}

function takePathPosition(path: Position[], progress: number, occupied: Set<string>) {
  const preferredIndex = Math.max(1, Math.min(path.length - 2, Math.floor(path.length * progress)))
  const searchOrder = Array.from({ length: path.length - 2 }, (_, offset) => {
    const distance = offset + 1
    return [preferredIndex - distance, preferredIndex + distance]
  }).flat()

  for (const index of [preferredIndex, ...searchOrder]) {
    const position = path[index]
    if (position && !occupied.has(positionKey(position))) {
      occupied.add(positionKey(position))
      return position
    }
  }

  throw new Error('Nao foi possivel distribuir as mecanicas na rota procedural final.')
}

/**
 * Gera o desafio procedural final com um mapa menor e todas as mecanicas principais.
 * Os elementos sao colocados na rota entre o inicio e a saida para evitar soft locks.
 */
export function generateProceduralFinalLevel(): Level {
  const grid = generateMaze(30, 30)
  const start: Position = { x: 2, y: 2 }
  const exit = findExitPosition(grid)
  const path = findPath(grid, start, exit)

  if (path.length < 20) {
    throw new Error('O mapa procedural final precisa de uma rota maior para distribuir as mecanicas.')
  }

  const occupied = new Set([positionKey(start), positionKey(exit)])
  const enemies = [0.10, 0.20, 0.34, 0.53, 0.70, 0.84].map((progress) => takePathPosition(path, progress, occupied))
  const keys = [0.27, 0.58, 0.80].map((progress) => takePathPosition(path, progress, occupied))
  const spikes = [0.38, 0.47, 0.68, 0.88].map((progress) => takePathPosition(path, progress, occupied))
  const chests = [0.43, 0.63, 0.76, 0.91].map((progress) => takePathPosition(path, progress, occupied))
  const doors = [0.52, 0.73, 0.95].map((progress) => takePathPosition(path, progress, occupied))

  grid[exit.y][exit.x] = 'EXIT'
  for (const position of keys) grid[position.y][position.x] = 'KEY'
  for (const position of spikes) grid[position.y][position.x] = 'SPIKE'
  for (const position of chests) grid[position.y][position.x] = 'CHEST'
  for (const position of doors) grid[position.y][position.x] = 'DOOR'

  return {
    id: 1000,
    name: 'Desafio Procedural Final',
    description: 'Um labirinto procedural menor concentra inimigos, varias chaves, espinhos, baus e portas em uma rota de desafio.',
    objective: 'Explore o labirinto, derrote os inimigos, colete as chaves, abra os baus, atravesse os espinhos e destranque as portas.',
    availableCommands: [
      'moveForward',
      'turnLeft',
      'turnRight',
      'attack',
      'grabKey',
      'openDoor',
      'openChest',
      'look',
      'print',
      'jump',
      'if',
      'else',
      'elif',
      'while',
      'for',
      'function',
      'var',
      'let',
      'const',
      'return',
      'await',
    ],
    playerStart: {
      ...start,
      direction: 'RIGHT',
      keys: 0,
      openedChests: 0,
    },
    grid,
    enemies: enemies.map((position) => ({ ...position, defeated: false })),
    starRules: {
      threeStars: Math.floor(grid[0].length * grid.length * 0.35),
      twoStars: Math.floor(grid[0].length * grid.length * 0.55),
    },
    concepts: ['Labirinto', 'Combate', 'Chaves', 'Portas', 'Baus', 'Espinhos', 'Exploracao'],
    isPlayable: true,
  }
}
