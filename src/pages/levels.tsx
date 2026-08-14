import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import PixelButton from '../components/ui/PixelButton'
import PixelIcon from '../components/ui/PixelIcon'
import PixelPanel from '../components/ui/PixelPanel'
import { getLevelById, worlds } from '../data/levels'
import { UI_SPRITES } from '../game/ui/uiSprites'

export default function Levels() {
  const [activeWorldId, setActiveWorldId] = useState<number | null>(null)

  const selectedWorld = useMemo(
    () => worlds.find((world) => world.id === activeWorldId) ?? null,
    [activeWorldId]
  )

  const selectedLevels = useMemo(
    () => (selectedWorld?.levelIds ?? []).map((levelId) => getLevelById(levelId)),
    [selectedWorld]
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

  const worldAssets: Record<number, string> = {
    1: '/assets/mundos/mundo1.png',
    2: '/assets/mundos/mundo2.png',
    3: '/assets/mundos/mundo3.png',
    4: '/assets/mundos/mundo4.png',
    5: '/assets/mundos/mundo5.png',
    99: '/assets/mundos/mundo6.png',
  }

  const worldPlacements: Record<number, string> = {
    1: 'md:left-[2%] md:top-[8%] md:-rotate-6',
    2: 'md:left-[35%] md:top-[2%] md:rotate-2',
    3: 'md:right-[2%] md:top-[14%] md:rotate-6',
    4: 'md:left-[8%] md:bottom-[12%] md:rotate-1',
    5: 'md:left-1/2 md:bottom-[8%] md:-rotate-4',
    99: 'md:right-[2%] md:bottom-[-1%] md:-translate-x-1/2 md:rotate-1',
  }

  const worldPoints: Record<number, { x: number; y: number }> = {
    1: { x: 10, y: 16 },
    2: { x: 44, y: 10 },
    3: { x: 88, y: 22 },
    4: { x: 18, y: 76 },
    5: { x: 52, y: 84 },
    99: { x: 86, y: 96 },
  }

  const journeyLinks = [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 99],
  ] as const

  const activeWorldPlayableCount = selectedLevels.filter((level) => level.isPlayable !== false).length

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
                <p className="pixel-eyebrow">Selecao de mundo</p>
                <h1 className="pixel-type text-2xl font-black leading-tight text-primaryText sm:text-4xl">
                  Fases
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-secondaryText">
                  Escolha um mundo no mapa para abrir as fases disponiveis e continuar sua jornada.
                </p>
              </div>
            </div>

            <PixelButton href="/" icon="left">
              Voltar
            </PixelButton>
          </div>
        </PixelPanel>

        <PixelPanel
          variant="default"
          className="min-h-[calc(100vh-10rem)] overflow-hidden"
          bodyClassName="relative min-h-[calc(100vh-14.5rem)] p-3 sm:p-5 lg:p-6"
        >
          <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(235,237,233,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(235,237,233,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="pointer-events-none absolute inset-4 border-2 border-border/60 bg-black/20" />
          <div className="pointer-events-none absolute inset-x-[10%] top-[18%] hidden h-px bg-border md:block" />
          <div className="pointer-events-none absolute inset-x-[12%] top-[63%] hidden h-px bg-border md:block" />
          <div className="pointer-events-none absolute left-[22%] top-[10%] hidden h-[58%] w-px bg-border md:block" />
          <div className="pointer-events-none absolute right-[18%] top-[8%] hidden h-[64%] w-px bg-border md:block" />

          <div className="pointer-events-none absolute inset-0 hidden md:block">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <marker id="journeyArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#ebede9" />
                </marker>
              </defs>

              {journeyLinks.map(([fromId, toId]) => {
                const from = worldPoints[fromId]
                const to = worldPoints[toId]
                const controlX1 = from.x + (to.x - from.x) * 0.35
                const controlY1 = from.y
                const controlX2 = from.x + (to.x - from.x) * 0.65
                const controlY2 = to.y
                const path = `M ${from.x} ${from.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${to.x} ${to.y}`

                return (
                  <g key={`${fromId}-${toId}`}>
                    <path d={path} fill="none" stroke="#ebede9" strokeWidth="0.55" strokeLinecap="square" strokeDasharray="1 1.4" markerEnd="url(#journeyArrow)" />
                    <circle cx={from.x} cy={from.y} r="0.9" fill="#090a14" stroke="#ebede9" strokeWidth="0.35" />
                  </g>
                )
              })}
              <circle cx={worldPoints[99].x} cy={worldPoints[99].y} r="1.2" fill="#ebede9" />
            </svg>
          </div>

          <div className="relative grid gap-3 md:block md:min-h-[inherit]">
            {worlds.map((world) => {
              const worldLevels = world.levelIds.map((levelId) => getLevelById(levelId))
              const isAvailable = worldAvailability[world.id] !== false
              const worldClasses = worldPlacements[world.id] ?? 'md:left-[50%] md:top-[50%] md:-translate-x-1/2 md:-translate-y-1/2'
              const isFinalChallenge = world.id === 99
              const playableCount = worldLevels.filter((level) => level.isPlayable !== false).length

              return (
                <button
                  key={world.id}
                  type="button"
                  onClick={() => isAvailable && setActiveWorldId(world.id)}
                  className={`group relative w-full border-2 border-primaryText bg-black text-left shadow-[inset_0_0_0_2px_#090a14] transition duration-100 hover:bg-wall focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wood md:absolute md:w-[230px] ${worldClasses} ${isAvailable
                    ? isFinalChallenge
                      ? 'md:w-[200px] md:scale-[0.92]'
                      : ''
                    : 'cursor-not-allowed grayscale opacity-50'
                    }`}
                  aria-disabled={!isAvailable}
                  aria-label={world.name}
                >
                  <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-border bg-black">
                    {worldAssets[world.id] ? (
                      <Image
                        src={worldAssets[world.id]}
                        alt={`Asset do ${world.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 230px"
                        className={`object-cover [image-rendering:pixelated] transition duration-100 group-hover:scale-[1.03] ${isAvailable ? '' : 'grayscale opacity-60'}`}
                        priority={world.id === 1}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-black p-4">
                        <PixelIcon sprite={UI_SPRITES.icons.target} scale={2} />
                      </div>
                    )}
                    <div className="absolute right-2 top-2 border border-primaryText bg-black px-2 py-1 font-mono text-[10px] font-black uppercase text-primaryText">
                      {isFinalChallenge ? 'Extra' : `${playableCount}/${worldLevels.length}`}
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="flex items-start gap-2">
                      <PixelIcon sprite={isFinalChallenge ? UI_SPRITES.icons.target : UI_SPRITES.icons.play} scale={1} />
                      <div className="min-w-0">
                        <h2 className="pixel-type text-sm font-black leading-5 text-primaryText">
                          {world.name}
                        </h2>
                        <p className="mt-1 text-xs leading-5 text-secondaryText">
                          {world.theme}
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
            className="w-full max-w-5xl"
            eyebrow="Selecionar fase"
            title={selectedWorld.name}
            icon="list"
            headerAction={
              <PixelButton
                type="button"
                icon="reset"
                size="sm"
                variant="ghost"
                onClick={() => setActiveWorldId(null)}
                aria-label="Fechar modal"
              >
                Fechar
              </PixelButton>
            }
            bodyClassName="p-4 sm:p-5"
          >
            <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="min-w-0">
                <div className="border-2 border-primaryText bg-black">
                  <div className="relative aspect-[4/3] border-b-2 border-border bg-black">
                    {worldAssets[selectedWorld.id] ? (
                      <Image
                        src={worldAssets[selectedWorld.id]}
                        alt={`Asset do ${selectedWorld.name}`}
                        fill
                        sizes="280px"
                        className="object-cover [image-rendering:pixelated]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <PixelIcon sprite={UI_SPRITES.icons.target} scale={2} />
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="text-sm leading-6 text-secondaryText">{selectedWorld.description}</p>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="border-2 border-border bg-bg p-2">
                        <div className="pixel-eyebrow">Tema</div>
                        <div className="truncate font-mono text-xs font-black text-primaryText">{selectedWorld.theme}</div>
                      </div>
                      <div className="border-2 border-border bg-bg p-2">
                        <div className="pixel-eyebrow">Fases</div>
                        <div className="font-mono text-lg font-black text-primaryText">{selectedLevels.length}</div>
                      </div>
                      <div className="border-2 border-border bg-bg p-2">
                        <div className="pixel-eyebrow">Abertas</div>
                        <div className="font-mono text-lg font-black text-primaryText">{activeWorldPlayableCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="max-h-[68vh] min-w-0 overflow-y-auto pr-1">
                <div className="grid gap-3">
                  {selectedLevels.map((level, index) => {
                    const isPlayable = level.isPlayable !== false

                    return (
                      <article key={level.id} className="border-2 border-border bg-black p-3">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="pixel-command-chip">
                                Fase {String(index + 1).padStart(2, '0')}
                              </span>
                              <span className={`border px-2 py-1 font-mono text-[10px] font-black uppercase ${isPlayable ? 'border-primaryText text-primaryText' : 'border-border text-secondaryText'}`}>
                                {isPlayable ? 'Jogavel' : 'Em breve'}
                              </span>
                            </div>

                            <h3 className="pixel-type mt-3 text-base font-black leading-5 text-primaryText">
                              {level.name}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-secondaryText">{level.description}</p>

                            <div className="mt-3 border-l-2 border-border pl-3 text-sm leading-6 text-secondaryText">
                              <span className="font-mono font-black text-primaryText">Objetivo: </span>
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

                          <div className="shrink-0">
                            {isPlayable ? (
                              <PixelButton href={`/game?level=${level.id}`} icon="play" variant="primary">
                                Jogar
                              </PixelButton>
                            ) : (
                              <span className="pixel-button pixel-button--secondary pixel-button--md" aria-disabled="true">
                                <PixelIcon sprite={UI_SPRITES.icons.reset} scale={1} />
                                <span>Bloqueado</span>
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
