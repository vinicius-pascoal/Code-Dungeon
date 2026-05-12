import React, { useEffect, useState } from 'react'
import { Enemy, Level, TileType } from '../../types/game'

type Props = {
  level: Level
  playerX: number
  playerY: number
  enemies: Enemy[]
}

function enemyAt(enemies: Enemy[], x: number, y: number) {
  return enemies.find((enemy) => !enemy.defeated && enemy.x === x && enemy.y === y)
}

function renderTile(tile: TileType) {
  switch (tile) {
    case 'WALL':
      return 'bg-wall'
    case 'EXIT':
      return 'bg-success text-bg font-bold'
    case 'SPIKE':
      return 'bg-danger text-bg'
    case 'KEY':
      return 'bg-treasure text-bg font-bold'
    case 'DOOR':
      return 'bg-wood text-primaryText font-bold'
    case 'OPEN_DOOR':
      return 'bg-wood/60 text-primaryText'
    case 'CHEST':
      return 'bg-treasure text-bg font-bold'
    case 'OPEN_CHEST':
      return 'bg-treasure/60 text-bg'
    default:
      return 'bg-floor'
  }
}

export default function DungeonGrid({ level, playerX, playerY, enemies }: Props) {
  const cols = level.grid[0]?.length || 0

  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const maxWidth = Math.min(viewportWidth, cols * 48)

  return (
    <div className="panel p-4 rounded-md">
      <div className="dungeon-grid-wrapper mx-auto" style={{ maxWidth: `${maxWidth}px` }}>
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {level.grid.flatMap((row, y) =>
            row.map((tile, x) => {
              const isPlayer = x === playerX && y === playerY
              const key = `${x}-${y}`
              const base = 'dungeon-tile flex items-center justify-center border border-border'
              const enemy = enemyAt(enemies, x, y)

              if (isPlayer) {
                return (
                  <div key={key} className={base + ' bg-magic text-bg font-bold'}>
                    P
                  </div>
                )
              }

              if (enemy) {
                return (
                  <div key={key} className={base + ' bg-danger text-bg font-bold'}>
                    M
                  </div>
                )
              }

              switch (tile) {
                default:
                  return (
                    <div key={key} className={base + ` ${renderTile(tile)}`}>
                      {tile === 'EXIT' ? 'E' : tile === 'KEY' ? 'K' : tile === 'DOOR' ? 'D' : tile === 'CHEST' ? 'C' : ''}
                    </div>
                  )
              }
            })
          )}
        </div>
      </div>
    </div>
  )
}
