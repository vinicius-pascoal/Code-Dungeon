import { useState } from 'react'
import PixelButton from '../components/ui/PixelButton'
import PixelFrame from '../components/ui/PixelFrame'
import PixelIcon from '../components/ui/PixelIcon'
import PixelPanel from '../components/ui/PixelPanel'
import SpriteTile from '../components/game/SpriteTile'
import { resolveTileSprite } from '../game/tiles/tileResolver'
import { UI_SPRITES } from '../game/ui/uiSprites'
import type { TileType } from '../types/game'

const previewTiles: TileType[][] = [
  ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ['WALL', 'FLOOR', 'FLOOR', 'SPIKE', 'FLOOR', 'FLOOR', 'EXIT', 'WALL'],
  ['WALL', 'FLOOR', 'WALL', 'WALL', 'FLOOR', 'WALL', 'FLOOR', 'WALL'],
  ['WALL', 'FLOOR', 'FLOOR', 'KEY', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
  ['WALL', 'FLOOR', 'WALL', 'FLOOR', 'CHEST', 'WALL', 'FLOOR', 'WALL'],
  ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
]

function renderTileOverlay(tile: string, tileSize: number) {
  switch (tile) {
    case 'EXIT':
      return (
        <img
          src="/assets/portal.png"
          alt="Saida"
          className="absolute inset-[7%] z-10 pointer-events-none h-[86%] w-[86%] object-contain"
        />
      )
    case 'SPIKE':
      return (
        <img
          src="/assets/espinhos.png"
          alt="Espinhos"
          className="absolute inset-0 z-10 pointer-events-none h-full w-full object-cover"
        />
      )
    case 'KEY':
      return <span className="absolute inset-0 z-10 flex items-center justify-center font-mono text-lg font-black text-amber-300">K</span>
    case 'CHEST':
      return <span className="absolute inset-0 z-10 flex items-center justify-center font-mono text-lg font-black text-amber-300">C</span>
    default:
      return null
  }
}

const stats = [
  { value: '19', label: 'fases guiadas' },
  { value: '5', label: 'mundos de logica' },
  { value: '999', label: 'labirinto extra' },
]

const steps = [
  { title: 'Escreva codigo', text: 'Monte uma rota com comandos reais.' },
  { title: 'Execute', text: 'Veja cada passo acontecer na dungeon.' },
  { title: 'Venca a fase', text: 'Chegue ao portal com menos comandos.' },
]

export default function Home() {
  const [showHow, setShowHow] = useState(false)

  return (
    <div className="pixel-app min-h-screen overflow-auto">
      <main className="mx-auto grid min-h-screen max-w-6xl gap-5 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:items-center">
        <section className="min-w-0">
          <PixelPanel variant="default" className="overflow-hidden" bodyClassName="p-5 sm:p-7">
            <div className="mb-5 flex justify-center sm:justify-start">
              <PixelIcon sprite={UI_SPRITES.decor.swordShield} scale={2} />
            </div>

            <div className="pixel-type max-w-3xl text-center sm:text-left">
              <h1 className="text-4xl font-black leading-tight text-primaryText sm:text-6xl">
                Code Dungeon
              </h1>
              <p className="mt-5 text-base leading-7 text-secondaryText sm:text-lg">
                Aprenda programacao resolvendo dungeons. Escreva comandos, execute a rota e encontre o portal.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PixelButton href="/game" icon="play" size="lg" variant="primary">
                Comecar
              </PixelButton>
              <PixelButton href="/levels" icon="list" size="lg">
                Ver fases
              </PixelButton>
              <PixelButton type="button" icon="help" size="lg" onClick={() => setShowHow(true)}>
                Como jogar
              </PixelButton>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="border-2 border-border bg-black p-4">
                  <div className="font-mono text-2xl font-black text-primaryText">{item.value}</div>
                  <div className="mt-1 text-sm text-secondaryText">{item.label}</div>
                </div>
              ))}
            </div>
          </PixelPanel>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {steps.map((step) => (
              <PixelPanel key={step.title} variant="hud" bodyClassName="p-4">
                <h2 className="pixel-type text-sm font-black text-primaryText">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-secondaryText">{step.text}</p>
              </PixelPanel>
            ))}
          </div>
        </section>

        <aside className="min-w-0">
          <PixelPanel
            variant="default"
            title="Fase 01"
            eyebrow="Mover, virar, executar"
            headerAction={
              <PixelButton href="/game?level=999" icon="play" size="sm" variant="ghost">
                Extra
              </PixelButton>
            }
            bodyClassName="p-3"
          >
            <PixelFrame className="aspect-[8/6] min-h-0">
              <div
                className="grid h-full overflow-hidden bg-black"
                style={{
                  gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
                  gap: 0,
                  lineHeight: 0,
                  fontSize: 0,
                }}
              >
                {previewTiles.flatMap((row, y) =>
                  row.map((tile, x) => {
                    const sprite = resolveTileSprite({ tile, map: previewTiles, x, y })
                    const isPlayer = x === 1 && y === 3

                    return (
                      <div
                        key={`${x}-${y}`}
                        className="relative aspect-square overflow-hidden"
                        style={{ margin: 0, padding: 0 }}
                      >
                        {sprite ? <SpriteTile sprite={sprite} size={48} fill className="absolute inset-0" /> : null}
                        {renderTileOverlay(tile, 48)}
                        {isPlayer ? (
                          <img
                            src="/assets/personagem/rotations/east.png"
                            alt="Personagem"
                            className="absolute inset-0 z-20 h-full w-full object-contain"
                          />
                        ) : null}
                      </div>
                    )
                  })
                )}
              </div>
            </PixelFrame>

            <div className="mt-3 border-2 border-border bg-black p-3 font-mono text-xs leading-6 text-primaryText">
              <div>moveForward();</div>
              <div>turnRight();</div>
              <div>moveForward();</div>
              <div>grabKey();</div>
              <div>openDoor();</div>
            </div>
          </PixelPanel>
        </aside>
      </main>

      {showHow && (
        <div className="pixel-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
          <PixelPanel
            variant="modal"
            className="w-full max-w-2xl"
            eyebrow="Ajuda"
            title="Como jogar"
            icon="help"
            headerAction={
              <PixelButton type="button" icon="reset" size="sm" variant="ghost" onClick={() => setShowHow(false)} aria-label="Fechar ajuda">
                Fechar
              </PixelButton>
            }
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {['moveForward();', 'turnRight();', 'grabKey();'].map((command) => (
                <div key={command} className="pixel-command-chip font-mono">
                  {command}
                </div>
              ))}
            </div>

            <p className="mt-5 text-sm leading-7 text-secondaryText">
              Os comandos rodam em sequencia. Se bater em parede, cair em espinhos ou usar um comando fora de hora,
              o console mostra o problema para voce corrigir a estrategia.
            </p>
          </PixelPanel>
        </div>
      )}
    </div>
  )
}
