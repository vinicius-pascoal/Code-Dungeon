import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { getLevelById, worlds } from '../data/levels'

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
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_85%_5%,rgba(34,197,94,0.14),transparent_24%),linear-gradient(180deg,rgba(10,15,28,0.98),rgba(7,12,20,0.96))]" />
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(248,250,252,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(248,250,252,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-magic/25 to-transparent" />

      <section className="mx-auto flex min-h-[calc(100vh)] flex-col gap-6">
        <header className="flex flex-col gap-4 border border-white/10 bg-panel/95 p-5 shadow-2xl backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="mt-2 text-3xl font-black text-primaryText sm:text-4xl">Fases</h1>
          </div>

          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-floor px-4 text-sm font-semibold text-primaryText transition hover:border-magic/60 hover:bg-wall"
          >
            Voltar
          </Link>
        </header>

        <main className="relative min-h-[calc(100vh-12rem)] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.06),transparent_42%)]" />
          <div className="absolute inset-x-[10%] top-[18%] hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:block" />
          <div className="absolute inset-x-[12%] top-[63%] hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:block" />
          <div className="absolute left-[22%] top-[10%] hidden h-[58%] w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent md:block" />
          <div className="absolute right-[18%] top-[8%] hidden h-[64%] w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent md:block" />

          <div className="pointer-events-none absolute inset-0 hidden md:block">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="journeyLine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(56,189,248,0.7)" />
                  <stop offset="55%" stopColor="rgba(34,197,94,0.55)" />
                  <stop offset="100%" stopColor="rgba(251,191,36,0.55)" />
                </linearGradient>
                <marker id="journeyArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L6,3 L0,6 Z" fill="rgba(248,250,252,0.75)" />
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
                    <path d={path} fill="none" stroke="url(#journeyLine)" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="1.2 1.4" markerEnd="url(#journeyArrow)" />
                    <circle cx={from.x} cy={from.y} r="0.9" fill="rgba(248,250,252,0.55)" />
                  </g>
                )
              })}
              <circle cx={worldPoints[99].x} cy={worldPoints[99].y} r="1.2" fill="rgba(251,191,36,0.85)" />
            </svg>
          </div>

          <div className="relative min-h-[inherit] p-3 sm:p-6 lg:p-8">
            {worlds.map((world) => {
              const worldLevels = world.levelIds.map((levelId) => getLevelById(levelId))
              const isAvailable = worldAvailability[world.id] !== false
              const worldClasses = worldPlacements[world.id] ?? 'md:left-[50%] md:top-[50%] md:-translate-x-1/2 md:-translate-y-1/2'
              const isFinalChallenge = world.id === 99

              return (
                <button
                  key={world.id}
                  type="button"
                  onClick={() => isAvailable && setActiveWorldId(world.id)}
                  className={`group relative mb-4 w-full text-left transition duration-200 md:absolute md:mb-0 md:w-[220px] ${worldClasses} ${isAvailable
                    ? isFinalChallenge
                      ? 'hover:-translate-y-1 md:w-[190px] md:scale-[0.92]'
                      : 'hover:-translate-y-1'
                    : 'cursor-not-allowed grayscale opacity-60'
                    }`}
                  aria-disabled={!isAvailable}
                  aria-label={world.name}
                >
                  <div className="relative overflow-hidden bg-transparent">
                    {worldAssets[world.id] ? (
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={worldAssets[world.id]}
                          alt={`Asset do ${world.name}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 220px"
                          className={`object-cover transition duration-300 group-hover:scale-[1.03] ${isAvailable ? '' : 'grayscale opacity-60'}`}
                          priority={world.id === 1}
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[4/3] items-end justify-between bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.2),transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.85),rgba(2,6,23,0.98))] p-4">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-treasure">Final secreto</div>
                          <div className="mt-2 text-sm text-amber-100/80">O desafio fica escondido no fim da jornada.</div>
                        </div>
                        <div className="rounded-full border border-treasure/20 bg-treasure/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-treasure">
                          Boss
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-x-0 bottom-2 flex items-center justify-center px-2">
                    <div className="flex max-w-[90%] items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5 backdrop-blur-sm">
                      <h2 className={`text-center text-[11px] font-black leading-none sm:text-xs ${isFinalChallenge ? 'text-treasure' : 'text-primaryText'}`}>
                        {world.name}
                      </h2>
                      <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.16em] ${isAvailable ? (isFinalChallenge ? 'bg-treasure/15 text-treasure' : 'bg-success/15 text-success') : 'bg-border text-secondaryText'}`}>
                        {isAvailable ? (isFinalChallenge ? 'Final' : 'Aberto') : 'Indisponível'}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </main>
      </section>

      {selectedWorld ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-panel/95 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_42%)]" />

            <div className="relative flex flex-col gap-4 border-b border-border/70 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-magic">Mundo selecionado</p>
                <h2 className="mt-2 text-2xl font-black text-primaryText sm:text-3xl">{selectedWorld.name}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-secondaryText">{selectedWorld.description}</p>
              </div>

              <button
                type="button"
                onClick={() => setActiveWorldId(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-floor text-primaryText transition hover:border-magic/60 hover:bg-wall"
                aria-label="Fechar modal"
              >
                X
              </button>
            </div>

            <div className="relative grid gap-4 p-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="rounded-lg border border-white/10 bg-bg/70 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.22em] text-secondaryText">Tema</div>
                    <div className="mt-1 font-semibold text-primaryText">{selectedWorld.theme}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-bg/70 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.22em] text-secondaryText">Fases</div>
                    <div className="mt-1 font-semibold text-primaryText">{selectedLevels.length}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-bg/70 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.22em] text-secondaryText">Jogáveis</div>
                    <div className="mt-1 font-semibold text-primaryText">{activeWorldPlayableCount}</div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-secondaryText">
                  Este mundo aparece como um cartão flutuante no mapa. Quando os assets entrarem, a arte pode substituir esse bloco sem mudar a estrutura.
                </p>
              </div>

              <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {selectedLevels.map((level, index) => {
                  const isPlayable = level.isPlayable !== false

                  return (
                    <article key={level.id} className="rounded-xl border border-white/10 bg-bg/75 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-magic/15 px-2.5 py-1 text-xs font-bold text-magic">
                              Fase {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className="text-lg font-bold text-primaryText">{level.name}</h3>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isPlayable ? 'bg-success/15 text-success' : 'bg-border text-secondaryText'}`}>
                              {isPlayable ? 'Jogável' : 'Em breve'}
                            </span>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-secondaryText">{level.description}</p>

                          <div className="mt-3 text-sm text-secondaryText">
                            <span className="font-semibold text-primaryText">Objetivo: </span>
                            {level.objective}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {(level.concepts ?? []).map((concept) => (
                              <span key={concept} className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-secondaryText">
                                {concept}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isPlayable ? (
                            <Link
                              href={`/game?level=${level.id}`}
                              className="inline-flex h-11 items-center justify-center rounded-md border border-magic bg-magic px-4 text-sm font-bold text-bg transition hover:bg-sky-300"
                            >
                              Jogar fase
                            </Link>
                          ) : (
                            <span className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-border/70 px-4 text-sm font-semibold text-secondaryText">
                              Bloqueado
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
        </div>
      ) : null}
    </div>
  )
}
