import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Direction, Enemy, Level, PlayerAnimationState, TileType } from '../../types/game'
import { resolveTileSprite } from '../../game/tiles/tileResolver'
import { DETAILS_TILESET_CONFIG } from '../../game/tiles/detailConfig'
import { resolveDetailSprite } from '../../game/tiles/detailResolver'
import SpriteTile from './SpriteTile'
import PixelButton from '../ui/PixelButton'
import BatSprite from './entities/BatSprite'
import PlayerSprite from './entities/PlayerSprite'
import SpikeSprite from './SpikeSprite'

type Props = {
  level: Level
  grid?: TileType[][]
  playerX: number
  playerY: number
  playerDirection: Direction
  playerAnimationState?: PlayerAnimationState
  enemies: Enemy[]
  isRunning?: boolean
  hideWalls?: boolean
  spikesActive?: boolean
}

type VisibleTiles = {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

const DISPLAY_TILE_SIZE = 48
const MIN_ZOOM = 0.2
const MAX_ZOOM = 3
const PLAYER_SPRITE_SCALE = 2

type ViewportSize = {
  width: number
  height: number
}

function enemyAt(enemies: Enemy[], x: number, y: number) {
  return enemies.find((enemy) => !enemy.defeated && enemy.x === x && enemy.y === y)
}

function getCellClassName(tile: TileType, hideWalls?: boolean) {
  if (tile === 'WALL' && hideWalls) return 'relative dungeon-cell bg-transparent'
  return 'relative dungeon-cell'
}

function renderObjectOverlay(tile: TileType, tileSize: number, spikesActive: boolean) {
  if (tile === 'SPIKE') {
    return (
      <SpikeSprite
        active={spikesActive}
        size={tileSize}
        className="absolute inset-0 z-10 pointer-events-none"
        ariaLabel={spikesActive ? 'Espinhos ativos' : 'Espinhos recolhidos'}
      />
    )
  }

  const detailSprite = resolveDetailSprite(tile)
  if (detailSprite) {
    const ariaLabel =
      tile === 'EXIT'
        ? 'Saida'
        : tile === 'KEY'
            ? 'Chave'
            : tile === 'OPEN_CHEST'
              ? 'Bau aberto'
              : 'Bau fechado'

    return (
      <SpriteTile
        sprite={detailSprite}
        atlas={DETAILS_TILESET_CONFIG}
        size={tileSize}
        className="absolute inset-0 z-10 pointer-events-none"
        ariaLabel={ariaLabel}
      />
    )
  }

  return null
}

function getTileAriaLabel(tile: TileType) {
  if (tile === 'WALL') return 'Parede'
  if (tile === 'DOOR') return 'Porta fechada'
  if (tile === 'OPEN_DOOR') return 'Porta aberta'
  return 'Piso'
}

function clampZoom(value: number, max = MAX_ZOOM): number {
  return Math.max(MIN_ZOOM, Math.min(max, value))
}

function calculateContainZoom(cols: number, rows: number, viewportWidth: number, viewportHeight: number, max = MAX_ZOOM): number {
  if (!cols || !rows || !viewportWidth || !viewportHeight) return 1

  const padding = 0.96
  const maxTileSize = Math.min(
    (viewportWidth / cols) * padding,
    (viewportHeight / rows) * padding
  )

  return clampZoom(maxTileSize / DISPLAY_TILE_SIZE, max)
}

// Calcula zoom automatico usando o tamanho real do painel do mapa.
function calculateAutoZoom(cols: number, rows: number, viewportWidth: number, viewportHeight: number): number {
  if (!cols || !rows || !viewportWidth || !viewportHeight) return 1

  const containZoom = calculateContainZoom(cols, rows, viewportWidth, viewportHeight)
  const maxDim = Math.max(cols, rows)

  if (maxDim > 25) {
    return Math.min(1, containZoom)
  }

  const fillTileSize = Math.max(
    (viewportWidth / cols) * 0.96,
    (viewportHeight / rows) * 0.96
  )
  const fillZoom = clampZoom(fillTileSize / DISPLAY_TILE_SIZE)

  return clampZoom(Math.min(fillZoom, containZoom * 1.45))
}

export default function DungeonGrid({
  level,
  grid,
  playerX,
  playerY,
  playerDirection,
  playerAnimationState,
  enemies,
  isRunning,
  hideWalls,
  spikesActive = true,
}: Props) {
  const map = grid ?? level.grid
  const cols = map[0]?.length || 0
  const rows = map.length
  const [viewportSize, setViewportSize] = useState<ViewportSize>({ width: 0, height: 0 })

  const viewportWidth = viewportSize.width || 900
  const viewportHeight = viewportSize.height || 520

  const autoZoom = useMemo(
    () => calculateAutoZoom(cols, rows, viewportWidth, viewportHeight),
    [cols, rows, viewportWidth, viewportHeight]
  )

  const [zoom, setZoom] = useState(autoZoom)
  const [zoomMode, setZoomMode] = useState<'auto' | 'manual'>('auto')
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = React.useRef<HTMLDivElement>(null)
  const gridRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      setViewportSize({
        width: container.clientWidth,
        height: container.clientHeight,
      })
    }

    measure()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }

    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (zoomMode === 'auto') {
      setZoom(autoZoom)
    }
  }, [autoZoom, zoomMode])

  useEffect(() => {
    setZoomMode('auto')
    setZoom(autoZoom)
    setScrollPosition({ x: 0, y: 0 })
  }, [level.id, cols, rows])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setScrollPosition({ x: target.scrollLeft, y: target.scrollTop })
  }, [])

  // Calcular tiles visíveis baseado no scroll
  const tileSize = Math.max(10, DISPLAY_TILE_SIZE * zoom)
  const gridPixelWidth = cols * tileSize
  const gridPixelHeight = rows * tileSize
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
    setZoomMode('manual')
    setZoom((prev) => Math.min(MAX_ZOOM, prev + 0.15))
  }

  const handleZoomOut = () => {
    setZoomMode('manual')
    setZoom((prev) => Math.max(MIN_ZOOM, prev - 0.15))
  }

  const handleResetZoom = () => {
    setZoomMode('auto')
    setZoom(autoZoom)
  }

  const handleFitToScreen = () => {
    setZoomMode('manual')
    const fitZoom = calculateContainZoom(cols, rows, viewportWidth, viewportHeight)
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

  // Auto-centralizar na posição do jogador quando executando código grande
  useEffect(() => {
    if (cols > 30 && rows > 30) {
      // Para boards grandes, centralizar no jogador quando iniciar
      const timer = setTimeout(centerOnPlayer, 100)
      return () => clearTimeout(timer)
    }
  }, [])

  const zoomPercentage = Math.round(zoom * 100)
  const resolvedPlayerAnimationState: PlayerAnimationState = playerAnimationState ?? (isRunning ? 'walk' : 'idle')

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
        className={`flex-1 overflow-auto bg-[#030303] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
      >
        <div
          className="flex items-center justify-center p-2"
          style={{
            boxSizing: 'border-box',
            minWidth: `${Math.max(gridPixelWidth + 16, viewportWidth)}px`,
            minHeight: `${Math.max(gridPixelHeight + 16, viewportHeight)}px`,
          }}
        >
        <div
          ref={gridRef}
          className="relative"
          style={{
            width: `${gridPixelWidth}px`,
            height: `${gridPixelHeight}px`,
            backgroundColor: '#050505',
          }}
        >
          {/* Render apenas tiles visíveis */}
          {visibleRows.map(({ x, y }) => {
            const tile = map[y][x]
            const key = `${x}-${y}`
            const enemy = enemyAt(enemies, x, y)
            const tileSprite = resolveTileSprite({ tile, map, x, y, hideWalls, levelId: level.id })
            const enemySize = Math.max(18, Math.round(tileSize * 0.78))
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
                  ariaLabel={getTileAriaLabel(tile)}
                />
                {renderObjectOverlay(tile, tileSize, spikesActive)}
                {enemy ? (
                  <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                    <BatSprite size={enemySize} x={x} y={y} />
                  </div>
                ) : null}
              </div>
            )
          })}

          <div
            className="absolute z-30 pointer-events-none flex items-center justify-center"
            style={{
              left: `${playerX * tileSize}px`,
              top: `${playerY * tileSize}px`,
              width: `${tileSize}px`,
              height: `${tileSize}px`,
            }}
          >
            <PlayerSprite
              direction={playerDirection}
              animationState={resolvedPlayerAnimationState}
              size={tileSize * PLAYER_SPRITE_SCALE}
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
