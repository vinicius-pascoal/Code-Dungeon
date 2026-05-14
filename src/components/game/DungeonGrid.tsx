import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Enemy, Level, TileType } from '../../types/game'

type Props = {
  level: Level
  playerX: number
  playerY: number
  playerDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'
  enemies: Enemy[]
  isRunning?: boolean
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

function directionToRotation(direction: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT') {
  switch (direction) {
    case 'UP':
      return '/assets/personagem/rotations/north.png'
    case 'RIGHT':
      return '/assets/personagem/rotations/east.png'
    case 'DOWN':
      return '/assets/personagem/rotations/south.png'
    case 'LEFT':
    default:
      return '/assets/personagem/rotations/west.png'
  }
}

function directionToWalkingFrames(direction: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT') {
  const folder =
    direction === 'UP'
      ? 'north'
      : direction === 'RIGHT'
        ? 'east'
        : direction === 'DOWN'
          ? 'south'
          : 'west'

  return Array.from({ length: 6 }, (_, index) =>
    `/assets/personagem/animations/Walking-4e049032/${folder}/frame_${String(index).padStart(3, '0')}.png`
  )
}

export default function DungeonGrid({ level, playerX, playerY, playerDirection, enemies, isRunning }: Props) {
  const cols = level.grid[0]?.length || 0
  const rows = level.grid.length
  const [zoom, setZoom] = useState(1)
  const [playerFrame, setPlayerFrame] = useState(0)

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

  useEffect(() => {
    if (!isRunning) {
      setPlayerFrame(0)
      return
    }

    const interval = window.setInterval(() => {
      setPlayerFrame((current) => (current + 1) % 6)
    }, 110)

    return () => window.clearInterval(interval)
  }, [isRunning, playerDirection])

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
              const tileImage = getTileImage(tile, x, y)
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
                const playerImage = isRunning
                  ? directionToWalkingFrames(playerDirection)[playerFrame]
                  : directionToRotation(playerDirection)

                return (
                  <div key={key} style={tileStyle} className={tileImage ? 'relative' : renderTileFallback(tile)}>
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

                    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                      <Image
                        src={playerImage}
                        alt="Personagem do jogador"
                        fill
                        className="object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.45)]"
                        sizes={`${tileSize}px`}
                        priority
                      />
                    </div>
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
