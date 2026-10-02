import { useEffect, useState } from 'react'
import PixelButton from '../ui/PixelButton'
import PixelPanel from '../ui/PixelPanel'
import { useI18n } from '../../i18n'
import { resolveDetailSprite } from '../../game/tiles/detailResolver'
import { DETAILS_TILESET_CONFIG } from '../../game/tiles/detailConfig'
import { resolveTileSprite } from '../../game/tiles/tileResolver'
import type { Direction, TileType } from '../../types/game'
import SpriteTile from './SpriteTile'
import PlayerSprite from './entities/PlayerSprite'
import BatSprite from './entities/BatSprite'
import SpikeSprite from './SpikeSprite'
import { demoConfigs } from '../../data/demos'

type DemoStep = {
  command: string
  x: number
  y: number
  direction: Direction
  spikesActive: boolean
}

type DemoConfig = {
  grid: TileType[][]
  code: string[]
  steps: DemoStep[]
  enemy?: { x: number; y: number }
  hiddenCells?: Array<{ x: number; y: number }>
  hiddenRevealStep?: number
}

const BASE_DEMO_GRID: TileType[][] = [
  ['WALL', 'WALL', 'FLOOR', 'FLOOR', 'EXIT'],
  ['FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
  ['WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
]

const DEMO_POSITIONS = [
  { x: 0, y: 1, direction: 'RIGHT' as Direction },
  { x: 1, y: 1, direction: 'RIGHT' as Direction },
  { x: 2, y: 1, direction: 'UP' as Direction },
  { x: 2, y: 0, direction: 'UP' as Direction },
  { x: 2, y: 0, direction: 'RIGHT' as Direction },
  { x: 3, y: 0, direction: 'RIGHT' as Direction },
  { x: 4, y: 0, direction: 'RIGHT' as Direction },
]

function demoSteps(commands: string[]): DemoStep[] {
  return commands.map((command, index) => {
    const position = DEMO_POSITIONS[Math.min(index, DEMO_POSITIONS.length - 1)]
    return { command, ...position, spikesActive: true }
  })
}

const LEVEL_ONE_STEPS: DemoStep[] = [
  { command: 'moveForward();', x: 0, y: 1, direction: 'RIGHT', spikesActive: true },
  { command: 'moveForward();', x: 1, y: 1, direction: 'RIGHT', spikesActive: true },
  { command: 'moveForward();', x: 2, y: 1, direction: 'RIGHT', spikesActive: true },
]

const SPIKE_DEMO_STEPS: DemoStep[] = [
  { command: 'await();', x: 0, y: 1, direction: 'RIGHT', spikesActive: true },
  { command: 'await();', x: 0, y: 1, direction: 'RIGHT', spikesActive: false },
  { command: 'moveForward();', x: 1, y: 1, direction: 'RIGHT', spikesActive: false },
  { command: 'moveForward();', x: 2, y: 1, direction: 'RIGHT', spikesActive: false },
]

function demoGrid(overrides: Array<[number, number, TileType]> = []) {
  const grid = BASE_DEMO_GRID.map((row) => [...row])
  overrides.forEach(([x, y, tile]) => {
    grid[y][x] = tile
  })
  return grid
}

function getDemoConfig(levelId: number): DemoConfig {
  switch (levelId) {
    case 1:
      return { grid: demoGrid([[2, 1, 'EXIT']]), code: LEVEL_ONE_STEPS.map((step) => step.command), steps: LEVEL_ONE_STEPS }
    case 2:
      return { grid: demoGrid(), code: ['moveForward();', 'turnLeft();', 'moveForward();'], steps: demoSteps(['moveForward();', 'turnLeft();', 'moveForward();']) }
    case 3:
      return { grid: demoGrid(), code: ['// comentario', 'moveForward();', 'turnLeft();'], steps: demoSteps(['moveForward();', 'turnLeft();']) }
    case 4:
      return { grid: demoGrid(), code: ['moveForward();', 'turnLeft();', 'moveForward();', 'turnRight();'], steps: demoSteps(['moveForward();', 'turnLeft();', 'moveForward();', 'turnRight();']) }
    case 5:
      return { grid: demoGrid([[1, 1, 'SPIKE']]), code: SPIKE_DEMO_STEPS.map((step) => step.command), steps: SPIKE_DEMO_STEPS }
    case 6:
      return { grid: demoGrid(), code: ['attack();', 'moveForward();'], steps: demoSteps(['attack();', 'moveForward();']), enemy: { x: 1, y: 1 } }
    case 7:
      return { grid: demoGrid([[1, 1, 'KEY'], [3, 1, 'DOOR']]), code: ['grabKey();', 'moveForward();', 'openDoor();'], steps: demoSteps(['grabKey();', 'moveForward();', 'openDoor();']) }
    case 8:
      return { grid: demoGrid([[2, 1, 'CHEST']]), code: ['moveForward();', 'openChest();'], steps: demoSteps(['moveForward();', 'openChest();']) }
    case 9:
      return { grid: demoGrid(), code: ['moveForward();', 'moveForward();', 'turnLeft();', 'moveForward();'], steps: demoSteps(['moveForward();', 'moveForward();', 'turnLeft();', 'moveForward();']) }
    case 10:
      return { grid: demoGrid([[1, 1, 'KEY'], [3, 1, 'DOOR']]), code: ['grabKey();', 'attack();', 'openDoor();'], steps: demoSteps(['grabKey();', 'attack();', 'openDoor();']), enemy: { x: 2, y: 1 } }
    case 11:
      return { grid: demoGrid(), code: ['if (look() == "ENEMY") {', '  attack();', '}'], steps: demoSteps(['look();', 'attack();']), enemy: { x: 1, y: 1 }, hiddenCells: [{ x: 1, y: 1 }], hiddenRevealStep: 1 }
    case 12:
      return { grid: demoGrid([[2, 1, 'KEY'], [3, 1, 'SPIKE']]), code: ['if (look() == "KEY") {', '  grabKey();', '} else {', '  turnRight();', '}'], steps: demoSteps(['look();', 'turnRight();']), hiddenCells: [{ x: 2, y: 1 }, { x: 3, y: 1 }], hiddenRevealStep: 1 }
    case 13:
      return { grid: demoGrid([[1, 1, 'KEY']]), code: ['look();', 'grabKey();', 'moveForward();'], steps: demoSteps(['look();', 'grabKey();', 'moveForward();']), enemy: { x: 2, y: 1 } }
    case 14:
      return { grid: demoGrid(), code: ['let steps = 0;', 'while (steps < 2) {', '  moveForward();', '  steps++;', '}'], steps: demoSteps(['moveForward();', 'moveForward();']) }
    case 15:
      return { grid: demoGrid(), code: ['for (let i = 0; i < 3; i++) {', '  moveForward();', '}'], steps: demoSteps(['moveForward();', 'moveForward();', 'moveForward();']) }
    case 16:
      return { grid: demoGrid(), code: ['function step() {', '  moveForward();', '}', 'step();'], steps: demoSteps(['moveForward();']) }
    case 17:
      return { grid: demoGrid([[1, 1, 'KEY']]), code: ['function collectKey() {', '  grabKey();', '}', 'collectKey();'], steps: demoSteps(['grabKey();']) }
    case 18:
      return { grid: demoGrid(), code: ['function clearAndStep() {', '  attack();', '  moveForward();', '}'], steps: demoSteps(['attack();', 'moveForward();']), enemy: { x: 1, y: 1 } }
    case 19:
      return { grid: demoGrid([[1, 1, 'KEY'], [3, 1, 'DOOR']]), code: ['for (...) {', '  if (look() == "ENEMY") {', '    attack();', '  } else {', '    moveForward();', '  }', '}'], steps: demoSteps(['look();', 'attack();', 'moveForward();']), enemy: { x: 2, y: 1 } }
    case 999:
      return { grid: demoGrid(), code: ['while (true) {', '  if (look() == "ENEMY") {', '    attack();', '  } else {', '    moveForward();', '  }', '}'], steps: demoSteps(['look();', 'attack();', 'moveForward();']), enemy: { x: 1, y: 1 } }
    default:
      return { grid: demoGrid(), code: ['look();', 'moveForward();'], steps: demoSteps(['look();', 'moveForward();']) }
  }
}

type Props = {
  isOpen: boolean
  levelId: number
  levelName: string
  lines: string[]
  onClose: () => void
  onOpenHelp: () => void
}

function isCodeLine(line: string) {
  return line.includes(';') || line.endsWith('{') || line === '}' || line.startsWith('  ')
}

export default function LevelIntroModal({ isOpen, levelId, levelName, lines, onClose, onOpenHelp }: Props) {
  const { t } = useI18n()
  const [demoStep, setDemoStep] = useState(0)
  const demo = demoConfigs[levelId] ?? demoConfigs[1]

  useEffect(() => {
    if (!isOpen) return

    setDemoStep(0)
    const timer = window.setInterval(() => {
      setDemoStep((currentStep) => (currentStep + 1) % demo.steps.length)
    }, 1500)

    return () => window.clearInterval(timer)
  }, [demo.steps.length, isOpen])

  if (!isOpen) return null

  const exampleIndex = lines.findIndex((line) => line === t('game.example'))
  const explanationLines = lines.slice(0, exampleIndex >= 0 ? exampleIndex : lines.length)
  const codeLines = exampleIndex >= 0 ? lines.slice(exampleIndex + 1).filter(isCodeLine) : []
  const activeDemoCommand = demo.steps[demoStep]?.command.replace('();', '')
  const activeDemoLine = demo.code.findIndex((line) => line.includes(activeDemoCommand))
  const hasExecuted = (command: string) => demo.steps
    .slice(0, demoStep + 1)
    .some((step) => step.command === command || step.effects?.includes(command))
  const enemyDefeated = hasExecuted('attack();')
  const keyCollected = hasExecuted('grabKey();')
  const chestOpened = hasExecuted('openChest();')
  const doorOpened = hasExecuted('openDoor();')

  return (
    <div className="pixel-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <PixelPanel
        variant="modal"
        className="max-h-[92vh] w-full max-w-2xl overflow-hidden"
        eyebrow={t('game.introEyebrow')}
        title={levelName}
        headerAction={
          <PixelButton type="button" icon="reset" variant="ghost" size="sm" onClick={onClose} aria-label={t('common.close')}>
            {t('common.close')}
          </PixelButton>
        }
        bodyClassName="max-h-[calc(92vh-5rem)] overflow-y-auto p-3 sm:p-4"
      >
        <div className="grid gap-3">
          {explanationLines.map((line, index) => (
            <section key={`${line}-${index}`} className="border-2 border-border bg-black p-3 text-sm leading-6 text-secondaryText">
              {index === 0 ? <p className="pixel-eyebrow">{t('game.introTopic')}</p> : null}
              <p className={index === 0 ? 'mt-2' : ''}>{line}</p>
            </section>
          ))}
        </div>

        <section className="mt-4 border-2 border-primaryText bg-black p-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="pixel-eyebrow">{t('game.introDemoTitle')}</p>
            <span className="font-mono text-[10px] uppercase text-secondaryText">{t('game.introDemoLoop')}</span>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(180px,0.8fr)]">
            <div className="flex items-center justify-center border border-border/70 bg-bg p-3" aria-label={t('game.introDemoMap')}>
              <div
                className="grid w-full max-w-[280px] gap-0 leading-none"
                style={{ gridTemplateColumns: `repeat(${demo.grid[0]?.length ?? 1}, minmax(0, 1fr))` }}
                role="img"
                aria-label={t('game.introDemoMap')}
              >
                {demo.grid.flatMap((row, y) => row.map((tile, x) => {
                  const isPlayer = demo.steps[demoStep].x === x && demo.steps[demoStep].y === y
                  const isEnemy = Boolean(demo.enemy && !enemyDefeated && demo.enemy.x === x && demo.enemy.y === y)
                  const isHidden = Boolean(demo.hiddenCells?.some((cell) => cell.x === x && cell.y === y))
                    && demoStep < (demo.hiddenRevealStep ?? Number.POSITIVE_INFINITY)
                  const displayedTile = tile === 'KEY' && keyCollected
                    ? 'FLOOR'
                    : tile === 'CHEST' && chestOpened
                      ? 'OPEN_CHEST'
                      : tile === 'DOOR' && doorOpened
                        ? 'OPEN_DOOR'
                        : tile
                  const tileSprite = resolveTileSprite({ tile: displayedTile, map: demo.grid, x, y, levelId: `intro-demo-${levelId}` })
                  const detailSprite = resolveDetailSprite(displayedTile)
                  return (
                    <div
                      key={`${x}-${y}`}
                      className="relative aspect-square overflow-visible bg-black"
                    >
                      {tileSprite ? <SpriteTile sprite={tileSprite} size={48} fill className="absolute inset-0" /> : null}
                      {detailSprite ? (
                        <SpriteTile
                          sprite={detailSprite}
                          atlas={DETAILS_TILESET_CONFIG}
                          size={48}
                          fill
                          className="absolute inset-0 z-10"
                          ariaLabel={t('game.introDemoExit')}
                        />
                      ) : null}
                      {tile === 'SPIKE' ? (
                        <SpikeSprite
                          active={demo.steps[demoStep].spikesActive}
                          size={48}
                          fill
                          className="absolute inset-0 z-10 pointer-events-none"
                          ariaLabel={t('game.introDemoSpikes')}
                        />
                      ) : null}
                      {isEnemy ? (
                        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                          <BatSprite size={42} x={x} y={y} />
                        </div>
                      ) : null}
                      {isHidden ? (
                        <div
                          className="dungeon-hidden-cell absolute inset-0 z-30"
                          aria-label={t('game.introDemoHidden')}
                        />
                      ) : null}
                      {isPlayer ? (
                        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                          <PlayerSprite
                            direction={demo.steps[demoStep].direction}
                            animationState="walk"
                            animationSpeed="normal"
                            size={96}
                          />
                        </div>
                      ) : null}
                    </div>
                  )
                }))}
              </div>
            </div>
            <div className="border border-border/70 bg-bg p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-secondaryText">{t('game.introDemoCode')}</p>
              <pre className="mt-2 overflow-auto font-mono text-xs leading-6 text-primaryText" aria-live="polite">
                {demo.code.map((line, index) => (
                  <code key={`${line}-${index}`} className={`block px-2 ${index === activeDemoLine ? 'bg-primaryText text-bg' : 'text-secondaryText'}`}>
                    {line}
                  </code>
                ))}
              </pre>
            </div>
          </div>
        </section>

        {codeLines.length ? (
          <section className="mt-4 border-2 border-border bg-black p-3">
            <p className="pixel-eyebrow">{t('game.introExampleTitle')}</p>
            <pre className="mt-3 overflow-auto border border-border/70 bg-bg p-3 font-mono text-xs leading-5 text-primaryText">
              <code>{codeLines.join('\n')}</code>
            </pre>
          </section>
        ) : null}

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <PixelButton type="button" icon="help" variant="ghost" onClick={onOpenHelp}>
            {t('common.help')}
          </PixelButton>
          <PixelButton type="button" icon="play" variant="primary" onClick={onClose}>
            {t('common.understood')}
          </PixelButton>
        </div>
      </PixelPanel>
    </div>
  )
}
