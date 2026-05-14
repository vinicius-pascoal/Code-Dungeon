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
  const rows = level.grid.length
  const [zoom, setZoom] = useState(1)

  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [viewportHeight, setViewportHeight] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 800)
  const containerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onResize = () => {
      setViewportWidth(window.innerWidth)
      setViewportHeight(window.innerHeight)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newZoom = Math.max(0.5, Math.min(3, zoom + delta))
    setZoom(newZoom)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3, prev + 0.15))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.5, prev - 0.15))
  }

  const handleResetZoom = () => {
    setZoom(1)
  }

  // Calcula o tamanho ideal do tile baseado no zoom e espaço disponível
  const baseTileSize = 48
  const tileSize = Math.max(24, baseTileSize * zoom)
  const zoomPercentage = Math.round(zoom * 100)

  return (
    <div className="panel h-full flex flex-col">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg/50 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="px-2 py-1 text-sm bg-primary/20 hover:bg-primary/40 rounded transition-colors"
            title="Diminuir zoom"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-mono text-primary">{zoomPercentage}%</span>
          <button
            onClick={handleZoomIn}
            className="px-2 py-1 text-sm bg-primary/20 hover:bg-primary/40 rounded transition-colors"
            title="Aumentar zoom"
          >
            +
          </button>
        </div>
        <button
          onClick={handleResetZoom}
          className="px-3 py-1 text-sm bg-primary/20 hover:bg-primary/40 rounded transition-colors"
          title="Resetar zoom"
        >
          Resetar
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-2"
        onWheel={handleWheel}
      >
        <div
          className="grid gap-0 transition-all duration-75 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            width: `${cols * tileSize}px`,
            height: `${rows * tileSize}px`
          }}
        >
          {level.grid.flatMap((row, y) =>
            row.map((tile, x) => {
              const isPlayer = x === playerX && y === playerY
              const key = `${x}-${y}`
              const enemy = enemyAt(enemies, x, y)
              const tileStyle = {
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative' as const
              }

              if (isPlayer) {
                return (
                  <div key={key} style={tileStyle} className="bg-magic text-bg font-bold text-lg">
                    P
                  </div>
                )
              }

              if (enemy) {
                return (
                  <div key={key} style={tileStyle} className="bg-danger text-bg font-bold text-lg">
                    M
                  </div>
                )
              }

              const tileImage = getTileImage(tile, x, y)

              return (
                <div key={key} style={tileStyle} className={tileImage ? '' : renderTileFallback(tile)}>
                  {tileImage ? (
                    <Image
                      src={tileImage}
                      alt={tile}
                      fill
                      className="object-cover"
                      sizes={`${tileSize}px`}
                    />
                  ) : (
                    <span className="z-10 font-bold" style={{ fontSize: `${Math.max(12, tileSize * 0.5)}px` }}>
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
