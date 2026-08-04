import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const previewTiles = [
  ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ['WALL', 'FLOOR', 'FLOOR', 'SPIKE', 'FLOOR', 'FLOOR', 'EXIT', 'WALL'],
  ['WALL', 'FLOOR', 'WALL', 'WALL', 'FLOOR', 'WALL', 'FLOOR', 'WALL'],
  ['WALL', 'PLAYER', 'FLOOR', 'KEY', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
  ['WALL', 'FLOOR', 'WALL', 'FLOOR', 'CHEST', 'WALL', 'FLOOR', 'WALL'],
  ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
]

function tileImage(tile: string, x: number, y: number) {
  const variation = ((x + y * 7) % 3) + 1

  if (tile === 'WALL') return `/assets/paredes/parede${variation}.png`
  if (tile === 'FLOOR' || tile === 'PLAYER' || tile === 'KEY' || tile === 'CHEST') return `/assets/pisos/piso${variation}.png`
  if (tile === 'EXIT') return '/assets/portal.png'
  if (tile === 'SPIKE') return '/assets/espinhos.png'

  return `/assets/pisos/piso${variation}.png`
}

export default function Home() {
  const [showHow, setShowHow] = useState(false)

  return (
    <div className="relative overflow-hidden w-full h-full">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.18),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(17,24,39,0.92)_46%,rgba(20,83,45,0.38))]" />
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(248,250,252,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(248,250,252,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />

      <section className="mx-auto grid min-h-[calc(100vh)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="max-w-2xl">

          <h1 className="text-5xl font-black leading-tight text-primaryText sm:text-6xl lg:text-7xl">
            Code Dungeon
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-secondaryText">
            Resolva masmorras escrevendo codigo de verdade. Cada fase treina raciocinio logico,
            leitura de problemas e comandos cada vez mais poderosos.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/game"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-magic bg-magic px-5 text-sm font-bold text-bg shadow-[0_18px_38px_rgba(56,189,248,0.24)] transition hover:bg-sky-300"
            >
              <span aria-hidden="true">&gt;</span>
              Comecar jornada
            </Link>
            <Link
              href="/levels"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-floor/80 px-5 text-sm font-semibold text-primaryText transition hover:border-magic/70 hover:bg-wall"
            >
              <span aria-hidden="true">#</span>
              Ver fases
            </Link>
            <button
              onClick={() => setShowHow(true)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-black/25 px-5 text-sm font-semibold text-primaryText transition hover:border-success/70 hover:bg-success/10"
            >
              <span aria-hidden="true">?</span>
              Como jogar
            </button>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            <div className="rounded-md border border-white/10 bg-black/[0.24] p-4">
              <div className="text-2xl font-black text-treasure">19</div>
              <div className="mt-1 text-sm text-secondaryText">fases guiadas</div>
            </div>
            <div className="rounded-md border border-white/10 bg-black/[0.24] p-4">
              <div className="text-2xl font-black text-success">5</div>
              <div className="mt-1 text-sm text-secondaryText">mundos de logica</div>
            </div>
            <div className="rounded-md border border-white/10 bg-black/[0.24] p-4">
              <div className="text-2xl font-black text-magic">999</div>
              <div className="mt-1 text-sm text-secondaryText">labirinto extra</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-lg border border-magic/10 bg-magic/5 blur-2xl" />
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-panel/95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/70 bg-bg/70 px-4 py-3">
              <div>
                <div className="text-sm font-bold text-primaryText">Fase 01</div>
                <div className="text-xs text-secondaryText">Mover, virar, executar</div>
              </div>
              <Link
                href="/game?level=999"
                className="rounded-md border border-success/40 bg-success/10 px-3 py-1.5 text-xs font-bold text-success transition hover:bg-success/20"
              >
                Labirinto procedural
              </Link>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-md border border-black/50 bg-black/40 p-2 shadow-inner">
                <div className="grid aspect-[8/6] grid-cols-8 overflow-hidden rounded-sm">
                  {previewTiles.flatMap((row, y) =>
                    row.map((tile, x) => (
                      <div key={`${x}-${y}`} className="relative aspect-square overflow-hidden">
                        <Image
                          src={tileImage(tile, x, y)}
                          alt=""
                          fill
                          className="object-cover [image-rendering:pixelated]"
                          sizes="64px"
                        />
                        {tile === 'PLAYER' ? (
                          <Image
                            src="/assets/personagem/rotations/east.png"
                            alt="Personagem"
                            fill
                            className="object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.65)] [image-rendering:pixelated]"
                            sizes="64px"
                            priority
                          />
                        ) : null}
                        {tile === 'KEY' ? (
                          <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-treasure drop-shadow">K</span>
                        ) : null}
                        {tile === 'CHEST' ? (
                          <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-treasure drop-shadow">C</span>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex min-h-0 flex-col rounded-md border border-white/10 bg-bg/80">
                <div className="border-b border-border/70 px-3 py-2 text-xs font-bold text-secondaryText">
                  editor.ts
                </div>
                <pre className="flex-1 overflow-hidden p-4 font-mono text-sm leading-7 text-slate-200">
                  <code>
                    <span className="text-magic">moveForward</span>();{'\n'}
                    <span className="text-magic">turnRight</span>();{'\n'}
                    <span className="text-magic">moveForward</span>();{'\n'}
                    <span className="text-success">grabKey</span>();{'\n'}
                    <span className="text-treasure">openDoor</span>();
                  </code>
                </pre>
                <div className="border-t border-border/70 px-3 py-2 text-xs text-success">
                  Saida encontrada
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showHow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-2xl rounded-lg border border-magic/20 bg-panel p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Como jogar</h2>
                <p className="mt-1 text-sm text-secondaryText">Escreva uma rota, execute e ajuste ate chegar ao portal.</p>
              </div>
              <button
                onClick={() => setShowHow(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-floor text-primaryText transition hover:bg-wall"
                aria-label="Fechar"
              >
                X
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {['moveForward();', 'turnRight();', 'grabKey();'].map((command) => (
                <div key={command} className="rounded-md border border-white/10 bg-bg/75 p-3 font-mono text-sm text-magic">
                  {command}
                </div>
              ))}
            </div>

            <p className="mt-5 text-sm leading-7 text-secondaryText">
              Os comandos rodam em sequencia. Se bater em parede, cair em espinhos ou usar um comando fora de hora,
              o console mostra o problema para voce corrigir a estrategia.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
