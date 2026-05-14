import React, { useEffect, useState, useCallback, useMemo } from 'react'
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

type VisibleTiles = {
  minX: number
  maxX: number
  minY: number
  maxY: number
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

// Calcula zoom automático para boards grandes
function calculateInitialZoom(cols: number, rows: number, viewportWidth: number, viewportHeight: number): number {
  const maxDim = Math.max(cols, rows)
  const baseTileSize = 48

  // Para boards normais (até 25x25), usar zoom normal
  if (maxDim <= 25) return 1

  // Para boards maiores, calcular zoom que cabe na tela
  const maxTileSize = Math.min(viewportWidth / cols, viewportHeight / rows) * 0.9
  return Math.max(0.25, Math.min(1, maxTileSize / baseTileSize))
}

export default function DungeonGrid({ level, playerX, playerY, playerDirection, enemies, isRunning }: Props) {
  const cols = level.grid[0]?.length || 0
  const rows = level.grid.length
  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [viewportHeight, setViewportHeight] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 800)

  const initialZoom = useMemo(
    () => calculateInitialZoom(cols, rows, viewportWidth, viewportHeight),
    [cols, rows, viewportWidth, viewportHeight]
  )

  const [zoom, setZoom] = useState(initialZoom)
  const [playerFrame, setPlayerFrame] = useState(0)
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = React.useRef<HTMLDivElement>(null)
  const gridRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onResize = () => {
      setViewportWidth(window.innerWidth)
      setViewportHeight(window.innerHeight)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setScrollPosition({ x: target.scrollLeft, y: target.scrollTop })
  }, [])

  // Calcular tiles visíveis baseado no scroll
  const baseTileSize = 48
  const tileSize = Math.max(24, baseTileSize * zoom)
  const visibleTiles = useMemo((): VisibleTiles => {
    if (!containerRef.current) return { minX: 0, maxX: cols, minY: 0, maxY: rows }

    const paddingTiles = 2 // Buffer para pré-carregar tiles adjacentes
    const minX = Math.max(0, Math.floor(scrollPosition.x / tileSize) - paddingTiles)
    const maxX = Math.min(cols, Math.ceil((scrollPosition.x + viewportWidth) / tileSize) + paddingTiles)
    const minY = Math.max(0, Math.floor(scrollPosition.y / tileSize) - paddingTiles)
    const maxY = Math.min(rows, Math.ceil((scrollPosition.y + viewportHeight) / tileSize) + paddingTiles)

    return { minX, maxX, minY, maxY }
  }, [scrollPosition, tileSize, viewportWidth, viewportHeight, cols, rows])

  // Handlers para drag/pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Apenas botão esquerdo (button 0)
    e.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    containerRef.current.scrollLeft -= deltaX
    containerRef.current.scrollTop -= deltaY

    setDragStart({
      x: e.clientX,
      y: e.clientY,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (!isDragging) return

    window.addEventListener('mousemove', handleMouseMove as any)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3, prev + 0.15))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.25, prev - 0.15))
  }

  const handleResetZoom = () => {
    setZoom(initialZoom)
  }

  // Centralizar na posição do jogador
  const centerOnPlayer = useCallback(() => {
    if (!containerRef.current) return
    const playerPixelX = playerX * tileSize
    const playerPixelY = playerY * tileSize
    containerRef.current.scrollLeft = playerPixelX - viewportWidth / 2 + tileSize / 2
    containerRef.current.scrollTop = playerPixelY - viewportHeight / 2 + tileSize / 2
  }, [playerX, playerY, tileSize, viewportWidth, viewportHeight])

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

  // Auto-centralizar na posição do jogador quando executando código grande
  useEffect(() => {
    if (cols > 30 && rows > 30) {
      // Para boards grandes, centralizar no jogador quando iniciar
      const timer = setTimeout(centerOnPlayer, 100)
      return () => clearTimeout(timer)
    }
  }, [])

  const zoomPercentage = Math.round(zoom * 100)

  // Renderizar apenas tiles visíveis para performance
  const visibleRows = useMemo(() => {
    const tiles = []
    for (let y = visibleTiles.minY; y < visibleTiles.maxY; y++) {
      for (let x = visibleTiles.minX; x < visibleTiles.maxX; x++) {
        tiles.push({ x, y })
      }
    }
    return tiles
  }, [visibleTiles])

  return (
    <div className="panel h-full flex flex-col">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg/50 border-b border-primary/20 flex-wrap gap-2">
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
        {cols > 30 && (
          <button
            onClick={centerOnPlayer}
            className="px-3 py-1 text-sm bg-primary/20 hover:bg-primary/40 rounded transition-colors"
            title="Centralizar no jogador"
          >
            📍 Jogador
          </button>
        )}
        <div className="text-xs text-primary/60 ml-auto flex items-center gap-3">
          <span className="italic">🖱️ Clique + arraste para navegar</span>
          <span>{cols} × {rows}</span>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`flex-1 overflow-auto p-2 bg-bg/30 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
      >
        <div
          ref={gridRef}
          className="relative"
          style={{
            width: `${cols * tileSize}px`,
            height: `${rows * tileSize}px`,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Render apenas tiles visíveis */}
          {visibleRows.map(({ x, y }) => {
            const tile = level.grid[y][x]
            const isPlayer = x === playerX && y === playerY
            const key = `${x}-${y}`
            const enemy = enemyAt(enemies, x, y)
            const tileImage = getTileImage(tile, x, y)
            const tileStyle: React.CSSProperties = {
              position: 'absolute',
              left: `${x * tileSize}px`,
              top: `${y * tileSize}px`,
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
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
                <div key={key} style={tileStyle} className="bg-danger text-bg font-bold text-lg flex items-center justify-center">
                  M
                </div>
              )
            }

            return (
              <div key={key} style={tileStyle} className={tileImage ? '' : renderTileFallback(tile)}>
                {tileImage && zoom > 0.4 ? (
                  <Image
                    src={tileImage}
                    alt={tile}
                    fill
                    className="object-cover"
                    sizes={`${tileSize}px`}
                  />
                ) : zoom <= 0.4 ? (
                  // Para zoom baixo, renderizar apenas cor para melhor performance
                  <div className="w-full h-full" />
                ) : (
                  <span className="z-10 font-bold" style={{ fontSize: `${Math.max(12, tileSize * 0.5)}px` }}>
                    {tile === 'KEY' ? 'K' : tile === 'DOOR' ? 'D' : tile === 'CHEST' ? 'C' : ''}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
