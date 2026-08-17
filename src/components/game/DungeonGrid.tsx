import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Enemy, Level, TileType } from '../../types/game'
import { resolveTileSprite } from '../../game/tiles/tileResolver'
import SpriteTile from './SpriteTile'
import PixelButton from '../ui/PixelButton'

type Props = {
  level: Level
  grid?: TileType[][]
  playerX: number
  playerY: number
  playerDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'
  enemies: Enemy[]
  isRunning?: boolean
  hideWalls?: boolean
}

type VisibleTiles = {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

const DISPLAY_TILE_SIZE = 48

function enemyAt(enemies: Enemy[], x: number, y: number) {
  return enemies.find((enemy) => !enemy.defeated && enemy.x === x && enemy.y === y)
}

function getCellClassName(tile: TileType, hideWalls?: boolean) {
  if (tile === 'WALL' && hideWalls) return 'relative dungeon-cell bg-transparent'
  return 'relative dungeon-cell'
}

function renderToken(label: string, tileSize: number, className: string) {
  return (
    <span
      className={`absolute inset-0 z-10 pointer-events-none flex items-center justify-center font-mono font-black ${className}`}
      style={{ fontSize: `${Math.max(12, tileSize * 0.48)}px` }}
    >
      {label}
    </span>
  )
}

function renderObjectOverlay(tile: TileType, tileSize: number) {
  switch (tile) {
    case 'EXIT':
      return (
        <img
          src="/assets/portal.png"
          alt="Saida"
          className="absolute inset-[7%] z-10 pointer-events-none h-[86%] w-[86%] object-contain dungeon-object-sprite"
        />
      )
    case 'SPIKE':
      return (
        <img
          src="/assets/espinhos.png"
          alt="Espinhos"
          className="absolute inset-0 z-10 pointer-events-none h-full w-full object-cover dungeon-object-sprite"
        />
      )
    case 'KEY':
      return renderToken('K', tileSize, 'text-treasure')
    case 'DOOR':
      return renderToken('D', tileSize, 'text-wood')
    case 'OPEN_DOOR':
      return renderToken('D', tileSize, 'text-wood/45')
    case 'CHEST':
      return renderToken('C', tileSize, 'text-treasure')
    case 'OPEN_CHEST':
      return renderToken('C', tileSize, 'text-treasure/45')
    default:
      return null
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
  const baseTileSize = DISPLAY_TILE_SIZE

  // Para boards normais (até 25x25), usar zoom normal
  if (maxDim <= 25) return 1

  // Para boards maiores, calcular zoom que cabe na tela
  const maxTileSize = Math.min(viewportWidth / cols, viewportHeight / rows) * 0.9
  return Math.max(0.25, Math.min(1, maxTileSize / baseTileSize))
}

// Calcula zoom para visualizar o board inteiro
function calculateFitZoom(cols: number, rows: number, viewportWidth: number, viewportHeight: number): number {
  const baseTileSize = DISPLAY_TILE_SIZE
  const padding = 0.95 // 5% de margem
  const maxTileSize = Math.min(
    (viewportWidth / cols) * padding,
    (viewportHeight / rows) * padding
  )
  return Math.max(0.1, maxTileSize / baseTileSize)
}

export default function DungeonGrid({ level, grid, playerX, playerY, playerDirection, enemies, isRunning, hideWalls }: Props) {
  const map = grid ?? level.grid
  const cols = map[0]?.length || 0
  const rows = map.length
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
  const tileSize = Math.max(24, DISPLAY_TILE_SIZE * zoom)
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
    setZoom((prev) => Math.max(0.1, prev - 0.15))
  }

  const handleResetZoom = () => {
    setZoom(initialZoom)
  }

  const handleFitToScreen = () => {
    const fitZoom = calculateFitZoom(cols, rows, viewportWidth, viewportHeight)
    setZoom(fitZoom)
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
    <div className="h-full flex flex-col bg-[#050505]">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between border-b-2 border-border bg-bg px-3 py-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <PixelButton
            type="button"
            onClick={handleZoomOut}
            size="sm"
            title="Diminuir zoom"
          >
            −
          </PixelButton>
          <span className="w-14 text-center font-mono text-sm text-primaryText">{zoomPercentage}%</span>
          <PixelButton
            type="button"
            onClick={handleZoomIn}
            size="sm"
            title="Aumentar zoom"
          >
            +
          </PixelButton>
        </div>
        <PixelButton
          type="button"
          onClick={handleResetZoom}
          size="sm"
          title="Resetar zoom"
        >
          Resetar
        </PixelButton>
        <PixelButton
          type="button"
          onClick={handleFitToScreen}
          size="sm"
          title="Visualizar tabuleiro completo"
        >
          Tudo
        </PixelButton>
        {cols > 30 && (
          <PixelButton
            type="button"
            onClick={centerOnPlayer}
            size="sm"
            title="Centralizar no jogador"
          >
            Jogador
          </PixelButton>
        )}
        <div className="pixel-type ml-auto flex items-center gap-3 text-xs text-secondaryText">
          <span>Clique + arraste</span>
          <span>{cols} x {rows}</span>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`flex-1 overflow-auto p-2 bg-[#030303] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
      >
        <div
          ref={gridRef}
          className="relative"
          style={{
            width: `${cols * tileSize}px`,
            height: `${rows * tileSize}px`,
            backgroundColor: '#050505',
          }}
        >
          {/* Render apenas tiles visíveis */}
          {visibleRows.map(({ x, y }) => {
            const tile = map[y][x]
            const isPlayer = x === playerX && y === playerY
            const key = `${x}-${y}`
            const enemy = enemyAt(enemies, x, y)
            const tileSprite = resolveTileSprite({ tile, map, x, y, hideWalls, levelId: level.id })
            const playerImage = isPlayer
              ? isRunning
                ? directionToWalkingFrames(playerDirection)[playerFrame]
                : directionToRotation(playerDirection)
              : null
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

            return (
              <div key={key} style={tileStyle} className={getCellClassName(tile, hideWalls)}>
                <SpriteTile
                  sprite={tileSprite}
                  size={tileSize}
                  className="absolute inset-0"
                  ariaLabel={tile === 'WALL' ? 'Parede' : 'Piso'}
                />
                {renderObjectOverlay(tile, tileSize)}
                {enemy ? (
                  <span
                    className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center font-mono font-black text-danger"
                    style={{ fontSize: `${Math.max(12, tileSize * 0.48)}px` }}
                  >
                    M
                  </span>
                ) : null}
                {playerImage ? (
                  <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
                    <img
                      src={playerImage}
                      alt="Personagem do jogador"
                      className="h-full w-full object-contain dungeon-entity-sprite"
                    />
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
