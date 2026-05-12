import React from 'react'
import { Level } from '../../types/game'

type Props = {
  level: Level
  playerX: number
  playerY: number
}

export default function DungeonGrid({ level, playerX, playerY }: Props) {
  const rows = level.grid.length
  const cols = level.grid[0]?.length || 0

  return (
    <div className="panel p-4 rounded-md">
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${cols}, 40px)` }}>
        {level.grid.flatMap((row, y) =>
          row.map((tile, x) => {
            const isPlayer = x === playerX && y === playerY
            const key = `${x}-${y}`
            const base = 'dungeon-tile flex items-center justify-center border border-border'
            if (isPlayer) {
              return (
                <div key={key} className={base + ' bg-magic text-bg font-bold'}>
                  P
                </div>
              )
            }

            switch (tile) {
              case 'WALL':
                return (
                  <div key={key} className={base + ' bg-wall'} />
                )
              case 'EXIT':
                return (
                  <div key={key} className={base + ' bg-success text-bg font-bold'}>E</div>
                )
              case 'SPIKE':
                return (
                  <div key={key} className={base + ' bg-danger text-bg'}>^</div>
                )
              default:
                return <div key={key} className={base + ' bg-floor'} />
            }
          })
        )}
      </div>
    </div>
  )
}
