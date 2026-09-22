import { useEffect, useMemo, useState } from 'react'
import PixelButton from '../components/ui/PixelButton'
import PixelIcon from '../components/ui/PixelIcon'
import PixelPanel from '../components/ui/PixelPanel'
import SpriteTile from '../components/game/SpriteTile'
import SpikeSprite from '../components/game/SpikeSprite'
import { getLevelById, worlds } from '../data/levels'
import { BAT_SPRITE_CONFIG } from '../game/entities/batConfig'
import { DETAILS_TILESET_CONFIG } from '../game/tiles/detailConfig'
import { resolveDetailSprite } from '../game/tiles/detailResolver'
import { resolveTileSprite } from '../game/tiles/tileResolver'
import { UI_SPRITES } from '../game/ui/uiSprites'
import { localizeLevel, localizeWorld, useI18n } from '../i18n'
import type { Level } from '../types/game'

function getFinalLevelForWorld(world: { levelIds: number[] }) {
  return getLevelById(world.levelIds[world.levelIds.length - 1])
}

const worldCardOrderClasses: Record<number, string> = {
  1: 'xl:order-1',
  2: 'xl:order-2',
  3: 'xl:order-3',
  4: 'xl:order-6',
  5: 'xl:order-5',
  99: 'xl:order-4',
}

function MiniLevelMap({ level, label }: { level: Level; label: string }) {
  const rows = level.grid.length
  const cols = level.grid[0]?.length ?? 0
  const fillsWidth = cols && rows ? cols / rows >= 4 / 3 : true
  const enemyPositions = new Set(level.enemies.filter((enemy) => !enemy.defeated).map((enemy) => `${enemy.x}-${enemy.y}`))

  return (
    <div className="flex h-full w-full items-center justify-center bg-black p-2" aria-label={label}>
      <div
        className="grid max-h-full max-w-full border-2 border-border bg-black"
        style={{
          aspectRatio: cols && rows ? `${cols} / ${rows}` : '1 / 1',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          height: fillsWidth ? 'auto' : '100%',
          width: fillsWidth ? '100%' : 'auto',
        }}
      >
        {level.grid.flatMap((row, y) =>
          row.map((tile, x) => {
            const isPlayer = level.playerStart.x === x && level.playerStart.y === y
            const isEnemy = enemyPositions.has(`${x}-${y}`)
            const tileSprite = resolveTileSprite({ tile, map: level.grid, x, y, hideWalls: level.hideWalls, levelId: level.id })
            const detailSprite = resolveDetailSprite(tile)

            return (
              <span
                key={`${x}-${y}`}
                className={`relative block aspect-square ${isPlayer ? 'overflow-visible' : 'overflow-hidden'} ${tile === 'VOID' ? 'bg-black/70' : 'bg-black'}`}
                aria-hidden="true"
              >
                {tileSprite ? (
                  <SpriteTile
                    sprite={tileSprite}
                    size={20}
                    fill
                    className="absolute inset-0"
                  />
                ) : null}
                {tile === 'SPIKE' ? (
                  <SpikeSprite
                    active
                    size={20}
                    fill
                    className="absolute inset-0 z-10 pointer-events-none"
                  />
                ) : null}
                {detailSprite ? (
                  <SpriteTile
                    sprite={detailSprite}
                    atlas={DETAILS_TILESET_CONFIG}
                    size={20}
                    fill
                    className="absolute inset-0 z-10 pointer-events-none"
                  />
                ) : null}
                {isEnemy ? (
                  <span
                    className="absolute inset-[8%] z-20 bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url("${BAT_SPRITE_CONFIG.src}")`,
                      backgroundSize: `${BAT_SPRITE_CONFIG.frameCount * 100}% 100%`,
                      backgroundPosition: '0% 0%',
                    }}
                  />
                ) : null}
                {isPlayer ? (
                  <img
                    src="/assets/personagem/Ghost.png"
                    alt=""
                    draggable={false}
                    className="absolute left-1/2 top-1/2 z-30 h-[200%] w-[200%] max-h-none max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
                  />
                ) : null}
              </span>
            )
          })
        )}
      </div>
    </div>
  )
}

function WorldPath() {
  return (
    <svg className="pointer-events-none absolute inset-0 hidden h-full w-full xl:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M 16.6 24 C 28 24, 38 24, 50 24 S 72 24, 83.4 24 C 91 24, 91 76, 83.4 76 S 62 76, 50 76 S 28 76, 16.6 76"
        fill="none"
        stroke="#ebede9"
        strokeDasharray="1.2 1.6"
        strokeLinecap="square"
        strokeWidth="0.55"
      />
      {[{ x: 16.6, y: 24 }, { x: 50, y: 24 }, { x: 83.4, y: 24 }, { x: 83.4, y: 76 }, { x: 50, y: 76 }, { x: 16.6, y: 76 }].map((point, index) => (
        <g key={`${point.x}-${point.y}`}>
          <circle cx={point.x} cy={point.y} r="1.05" fill="#090a14" stroke="#ebede9" strokeWidth="0.35" />
          <text x={point.x} y={point.y + 0.45} textAnchor="middle" fontSize="1.7" fill="#ebede9">
            {index + 1}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function Levels() {
  const [activeWorldId, setActiveWorldId] = useState<number | null>(null)
  const { locale, t } = useI18n()

  const selectedWorld = useMemo(
    () => worlds.find((world) => world.id === activeWorldId) ?? null,
    [activeWorldId]
  )

  const selectedLocalizedWorld = useMemo(
    () => selectedWorld ? localizeWorld(selectedWorld, locale) : null,
    [locale, selectedWorld]
  )

  const selectedLevels = useMemo(
    () => (selectedWorld?.levelIds ?? []).map((levelId) => localizeLevel(getLevelById(levelId), locale)),
    [locale, selectedWorld]
  )

  useEffect(() => {
    if (!activeWorldId) return undefined

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveWorldId(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [activeWorldId])

  const worldAvailability: Record<number, boolean> = {
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    99: true,
  }

  const activeWorldPlayableCount = selectedLevels.filter((level) => level.isPlayable !== false).length
  const selectedWorldFinalLevel = selectedWorld ? localizeLevel(getFinalLevelForWorld(selectedWorld), locale) : null

  return (
    <div className="pixel-app min-h-screen overflow-auto">
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-4 py-5">
        <PixelPanel variant="hud" bodyClassName="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-primaryText bg-black">
                <PixelIcon sprite={UI_SPRITES.icons.list} scale={1} />
              </div>
              <div className="min-w-0">
                <p className="pixel-eyebrow">{t('levels.eyebrow')}</p>
                <h1 className="pixel-type text-2xl font-black leading-tight text-primaryText sm:text-4xl">
                  {t('levels.title')}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-secondaryText">
                  {t('levels.subtitle')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <PixelButton href="/" icon="left">
                {t('common.back')}
              </PixelButton>
            </div>
          </div>
        </PixelPanel>

        <PixelPanel
          variant="default"
          className="overflow-hidden"
          bodyClassName="relative p-3 sm:p-5 lg:p-6"
        >
          <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(235,237,233,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(235,237,233,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="pointer-events-none absolute inset-4 border-2 border-border/60 bg-black/20" />

          <div className="relative mx-auto grid w-full max-w-6xl gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-16 xl:gap-y-12">
            <WorldPath />
            {worlds.map((world) => {
              const localizedWorld = localizeWorld(world, locale)
              const worldLevels = world.levelIds.map((levelId) => localizeLevel(getLevelById(levelId), locale))
              const isAvailable = worldAvailability[world.id] !== false
              const isFinalChallenge = world.id === 99
              const playableCount = worldLevels.filter((level) => level.isPlayable !== false).length
              const finalLevel = localizeLevel(getFinalLevelForWorld(world), locale)
              const worldOrder = worlds.findIndex((item) => item.id === world.id) + 1
              const orderClass = worldCardOrderClasses[world.id] ?? ''

              return (
                <button
                  key={world.id}
                  type="button"
                  onClick={() => isAvailable && setActiveWorldId(world.id)}
                  className={`group relative z-10 mx-auto flex min-h-[250px] w-full max-w-[260px] flex-col border-2 border-primaryText bg-black text-left shadow-[inset_0_0_0_2px_#090a14] transition duration-100 hover:bg-wall focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wood ${orderClass} ${isAvailable
                    ? ''
                    : 'cursor-not-allowed grayscale opacity-50'
                  }`}
                  aria-disabled={!isAvailable}
                  aria-label={localizedWorld.name}
                >
                  <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-border bg-black">
                    <MiniLevelMap level={finalLevel} label={t('levels.finalMap', { name: localizedWorld.name })} />
                    <div className="absolute left-1.5 top-1.5 border border-primaryText bg-black px-1.5 py-1 font-mono text-[9px] font-black uppercase text-primaryText">
                      {isFinalChallenge ? t('common.maze') : `${t('common.final')} ${finalLevel.id}`}
                    </div>
                    <div className="absolute right-1.5 top-1.5 border border-primaryText bg-black px-1.5 py-1 font-mono text-[9px] font-black uppercase text-primaryText">
                      {isFinalChallenge ? t('common.extra') : `${playableCount}/${worldLevels.length}`}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-2.5">
                    <div className="flex items-start gap-2">
                      <PixelIcon sprite={isFinalChallenge ? UI_SPRITES.icons.target : UI_SPRITES.icons.play} scale={1} />
                      <div className="min-w-0">
                        <p className="pixel-eyebrow">{t('common.world')} {String(worldOrder).padStart(2, '0')}</p>
                        <h2 className="pixel-type text-xs font-black leading-5 text-primaryText">
                          {localizedWorld.name}
                        </h2>
                        <p className="mt-1 text-[10px] leading-4 text-secondaryText">
                          {localizedWorld.theme}
                        </p>
                        <p className="mt-2 text-[10px] leading-4 text-secondaryText">
                          {localizedWorld.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </PixelPanel>
      </main>

      {selectedWorld ? (
        <div className="pixel-modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <PixelPanel
            variant="modal"
            className="max-h-[92vh] w-full max-w-5xl overflow-hidden"
            eyebrow={t('levels.selectPhase')}
            title={selectedLocalizedWorld?.name ?? selectedWorld.name}
            icon="list"
            headerAction={
              <PixelButton
                type="button"
                icon="reset"
                size="sm"
                variant="ghost"
                onClick={() => setActiveWorldId(null)}
                aria-label={t('common.close')}
              >
                {t('common.close')}
              </PixelButton>
            }
            bodyClassName="max-h-[calc(92vh-5rem)] overflow-y-auto p-4 sm:p-5"
          >
            <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="min-w-0">
                <div className="border-2 border-primaryText bg-black">
                  <div className="relative aspect-[4/3] border-b-2 border-border bg-black">
                    {selectedWorldFinalLevel ? (
                      <MiniLevelMap
                        level={selectedWorldFinalLevel}
                        label={t('levels.finalMap', { name: selectedLocalizedWorld?.name ?? selectedWorld.name })}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <PixelIcon sprite={UI_SPRITES.icons.target} scale={2} />
                      </div>
                    )}
                    {selectedWorldFinalLevel ? (
                      <div className="absolute left-2 top-2 border border-primaryText bg-black px-2 py-1 font-mono text-[10px] font-black uppercase text-primaryText">
                        {t('common.final')} {selectedWorldFinalLevel.id}
                      </div>
                    ) : null}
                  </div>

                  <div className="p-3">
                    <p className="text-sm leading-6 text-secondaryText">{selectedLocalizedWorld?.description ?? selectedWorld.description}</p>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="border-2 border-border bg-bg p-2">
                        <div className="pixel-eyebrow">{t('common.theme')}</div>
                        <div className="truncate font-mono text-xs font-black text-primaryText">{selectedLocalizedWorld?.theme ?? selectedWorld.theme}</div>
                      </div>
                      <div className="border-2 border-border bg-bg p-2">
                        <div className="pixel-eyebrow">{t('common.levels')}</div>
                        <div className="font-mono text-lg font-black text-primaryText">{selectedLevels.length}</div>
                      </div>
                      <div className="border-2 border-border bg-bg p-2">
                        <div className="pixel-eyebrow">{t('common.open')}</div>
                        <div className="font-mono text-lg font-black text-primaryText">{activeWorldPlayableCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="min-w-0 overflow-visible pr-1 lg:max-h-[68vh] lg:overflow-y-auto">
                <div className="grid gap-3">
                  {selectedLevels.map((level, index) => {
                    const isPlayable = level.isPlayable !== false

                    return (
                      <article key={level.id} className="border-2 border-border bg-black p-3">
                        <div className="grid gap-4 md:grid-cols-[132px_minmax(0,1fr)_auto] md:items-start">
                          <div className="relative aspect-[4/3] overflow-hidden border-2 border-border bg-black">
                            <MiniLevelMap level={level} label={t('levels.mapOf', { name: level.name })} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="pixel-command-chip">
                                {t('common.level')} {String(index + 1).padStart(2, '0')}
                              </span>
                              <span className={`border px-2 py-1 font-mono text-[10px] font-black uppercase ${isPlayable ? 'border-primaryText text-primaryText' : 'border-border text-secondaryText'}`}>
                                {isPlayable ? t('common.playable') : t('common.soon')}
                              </span>
                            </div>

                            <h3 className="pixel-type mt-3 text-base font-black leading-5 text-primaryText">
                              {level.name}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-secondaryText">{level.description}</p>

                            <div className="mt-3 border-l-2 border-border pl-3 text-sm leading-6 text-secondaryText">
                              <span className="font-mono font-black text-primaryText">{t('common.objective')}: </span>
                              {level.objective}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {(level.concepts ?? []).map((concept) => (
                                <span key={concept} className="border border-border bg-bg px-2 py-1 font-mono text-xs text-secondaryText">
                                  {concept}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="shrink-0 md:justify-self-end">
                            {isPlayable ? (
                              <PixelButton href={`/game?level=${level.id}`} icon="play" variant="primary">
                                {t('common.play')}
                              </PixelButton>
                            ) : (
                              <span className="pixel-button pixel-button--secondary pixel-button--md" aria-disabled="true">
                                <PixelIcon sprite={UI_SPRITES.icons.reset} scale={1} />
                                <span>{t('common.locked')}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            </div>
          </PixelPanel>
        </div>
      ) : null}
    </div>
  )
}
