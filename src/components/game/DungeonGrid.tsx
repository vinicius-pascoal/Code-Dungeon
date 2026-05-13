import React, { useEffect, useState } from 'react'
import Image from 'next/image'
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

// Retorna deterministically uma variação (1-3) baseada em x,y
function getVariation(x: number, y: number): number {
  return ((x + y * 7) % 3) + 1
}

// Retorna o caminho da imagem do tile, ou fallback com cor CSS
function getTileImage(tile: TileType, x: number, y: number): string | null {
  switch (tile) {
    case 'WALL':
      return `/assets/paredes/parede${getVariation(x, y)}.png`
    case 'EXIT':
      return '/assets/portal.png'
    case 'SPIKE':
      return '/assets/espinhos.png'
    case 'FLOOR':
      return `/assets/pisos/piso${getVariation(x, y)}.png`
    default:
      return null
  }
}

// Retorna classe CSS fallback para tiles sem imagem
function renderTileFallback(tile: TileType) {
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
  const [zoom, setZoom] = useState(1)

  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)))
  }

  const maxWidth = Math.min(viewportWidth, cols * 48)

  return (
    <div className="panel h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center overflow-auto p-1.5 mx-auto" onWheel={handleWheel}>
        <div 
          className="grid gap-0 transition-transform duration-75" 
          style={{ 
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            transform: `scale(${zoom})`
          }}
        >
          {level.grid.flatMap((row, y) =>
            row.map((tile, x) => {
              const isPlayer = x === playerX && y === playerY
              const key = `${x}-${y}`
              const base = 'flex items-center justify-center aspect-square w-full min-w-[30px] max-w-[80px] relative overflow-hidden'
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

              const tileImage = getTileImage(tile, x, y)

              return (
                <div key={key} className={base + (tileImage ? '' : ` ${renderTileFallback(tile)}`)}>
                  {tileImage ? (
                    <Image
                      src={tileImage}
                      alt={tile}
                      fill
                      className="object-cover"
                      sizes="(max-width: 80px) 100vw, 80px"
                    />
                  ) : (
                    <span className="z-10">
                      {tile === 'KEY' ? 'K' : tile === 'DOOR' ? 'D' : tile === 'CHEST' ? 'C' : ''}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
