import { TileType } from '../../types/game'

const tileLegend: Record<string, TileType> = {
  '#': 'WALL',
  '.': 'FLOOR',
  '~': 'VOID',
  '^': 'SPIKE',
  D: 'DOOR',
  C: 'CHEST',
  K: 'KEY',
  E: 'EXIT',
}

export function createGrid(rows: string[]): TileType[][] {
  const width = rows[0]?.length ?? 0

  return rows.map((row, y) => {
    if (row.length !== width) {
      throw new Error(`Invalid level grid at row ${y}: expected ${width} columns, got ${row.length}.`)
    }

    return [...row].map((tile, x) => {
      const resolved = tileLegend[tile]
      if (!resolved) {
        throw new Error(`Invalid level grid tile "${tile}" at ${x},${y}.`)
      }

      return resolved
    })
  })
}
