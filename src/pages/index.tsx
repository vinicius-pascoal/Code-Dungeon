import { useState } from 'react'
import PixelButton from '../components/ui/PixelButton'
import PixelFrame from '../components/ui/PixelFrame'
import PixelIcon from '../components/ui/PixelIcon'
import LanguageSelect from '../components/ui/LanguageSelect'
import PixelPanel from '../components/ui/PixelPanel'
import SpriteTile from '../components/game/SpriteTile'
import SpikeSprite from '../components/game/SpikeSprite'
import { DETAILS_TILESET_CONFIG } from '../game/tiles/detailConfig'
import { resolveDetailSprite } from '../game/tiles/detailResolver'
import { resolveTileSprite } from '../game/tiles/tileResolver'
import { UI_SPRITES } from '../game/ui/uiSprites'
import { levelFifteen } from '../data/levels/level-15'
import { useI18n } from '../i18n'
import type { TileType } from '../types/game'

const previewLevel = levelFifteen
const previewTiles: TileType[][] = previewLevel.grid

const HOME_PLAYER_SPRITE_SCALE = 2

function renderTileOverlay(tile: TileType, tileSize: number, labels: Record<string, string>) {
  if (tile === 'SPIKE') {
    return (
      <SpikeSprite
        active={true}
        size={tileSize}
        fill
        className="absolute inset-0 z-10 pointer-events-none"
        ariaLabel={labels.SPIKE}
      />
    )
  }

  const sprite = resolveDetailSprite(tile)
  if (!sprite) return null

  const ariaLabel =
    tile === 'EXIT'
      ? labels.EXIT
      : tile === 'KEY'
        ? labels.KEY
        : tile === 'OPEN_CHEST'
          ? labels.OPEN_CHEST
          : labels.CHEST

  return (
    <SpriteTile
      sprite={sprite}
      atlas={DETAILS_TILESET_CONFIG}
      size={tileSize}
      fill
      className="absolute inset-0 z-10 pointer-events-none"
      ariaLabel={ariaLabel}
    />
  )
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

const howToPlaySteps = [
  'Observe o mapa e leia o objetivo da fase.',
  'Escreva poucos comandos no editor.',
  'Execute para ver o personagem agir passo a passo.',
  'Use o erro ou o console para corrigir a rota.',
]

const basicCommands = [
  {
    command: 'moveForward();',
    title: 'Andar',
    text: 'Move uma casa na direcao atual.',
  },
  {
    command: 'turnRight();',
    title: 'Virar',
    text: 'Muda a direcao sem sair do lugar.',
  },
  {
    command: 'grabKey();',
    title: 'Interagir',
    text: 'Pega uma chave quando voce esta em cima dela.',
  },
  {
    command: 'openDoor();',
    title: 'Abrir caminho',
    text: 'Abre a porta que esta na frente, se houver chave.',
  },
]

const learningMoments = [
  { title: 'Sequencia', text: 'O codigo roda de cima para baixo.' },
  { title: 'Decisao', text: 'Depois voce usa if e look() para reagir ao mapa.' },
  { title: 'Repeticao', text: 'Loops evitam escrever o mesmo comando muitas vezes.' },
]

function HomeCodeBlock({ lines }: { lines: string[] }) {
  return (
    <pre className="mt-3 overflow-auto border border-border/70 bg-bg p-3 font-mono text-xs leading-5 text-primaryText">
      <code>{lines.join('\n')}</code>
    </pre>
  )
}

export default function Home() {
  const [showHow, setShowHow] = useState(false)
  const { t } = useI18n()

  const tileLabels = {
    SPIKE: t('error.spike.title'),
    EXIT: t('common.objective'),
    KEY: 'KEY',
    OPEN_CHEST: 'OPEN_CHEST',
    CHEST: 'CHEST',
  }

  const localizedStats = [
    { value: '19', label: t('home.stat.guided') },
    { value: '5', label: t('home.stat.worlds') },
    { value: '999', label: t('home.stat.extra') },
  ]

  const localizedSteps = [
    { title: t('home.step.write.title'), text: t('home.step.write.text') },
    { title: t('home.step.run.title'), text: t('home.step.run.text') },
    { title: t('home.step.win.title'), text: t('home.step.win.text') },
  ]

  const localizedHowToPlaySteps = [
    t('home.step.write.text'),
    t('home.guide.exampleText'),
    t('home.step.run.text'),
    t('home.guide.tip'),
  ]

  const localizedBasicCommands = [
    { command: 'moveForward();', title: t('home.command.walk.title'), text: t('home.command.walk.text') },
    { command: 'turnRight();', title: t('home.command.turn.title'), text: t('home.command.turn.text') },
    { command: 'grabKey();', title: t('home.command.interact.title'), text: t('home.command.interact.text') },
    { command: 'openDoor();', title: t('home.command.open.title'), text: t('home.command.open.text') },
  ]

  const localizedLearningMoments = [
    { title: t('home.learn.sequence.title'), text: t('home.learn.sequence.text') },
    { title: t('home.learn.condition.title'), text: t('home.learn.condition.text') },
    { title: t('home.learn.loop.title'), text: t('home.learn.loop.text') },
  ]

  return (
    <div className="pixel-app min-h-screen overflow-auto">
      <main className="mx-auto grid min-h-screen max-w-6xl gap-5 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:items-center">
        <section className="min-w-0">
          <PixelPanel variant="default" className="overflow-hidden" bodyClassName="p-5 sm:p-7">
            <div className="mb-5 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
              <PixelIcon sprite={UI_SPRITES.decor.swordShield} scale={2} />
              <LanguageSelect />
            </div>

            <div className="pixel-type max-w-3xl text-center sm:text-left">
              <h1 className="text-2xl font-black leading-relaxed text-primaryText sm:text-4xl">
                Code Dungeon
              </h1>
              <p className="mt-5 text-xs leading-7 text-secondaryText sm:text-sm">
                {t('home.subtitle')}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PixelButton href="/game?level=15" icon="play" size="lg" variant="primary">
                {t('home.start')}
              </PixelButton>
              <PixelButton href="/levels" icon="list" size="lg">
                {t('home.viewLevels')}
              </PixelButton>
              <PixelButton type="button" icon="help" size="lg" onClick={() => setShowHow(true)}>
                {t('home.howToPlay')}
              </PixelButton>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {localizedStats.map((item) => (
                <div key={item.label} className="border-2 border-border bg-black p-4">
                  <div className="font-mono text-lg font-black text-primaryText">{item.value}</div>
                  <div className="mt-2 text-[10px] leading-5 text-secondaryText">{item.label}</div>
                </div>
              ))}
            </div>
          </PixelPanel>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {localizedSteps.map((step) => (
              <PixelPanel key={step.title} variant="hud" bodyClassName="p-4">
                <h2 className="pixel-type text-[11px] font-black leading-5 text-primaryText">{step.title}</h2>
                <p className="mt-2 text-[10px] leading-5 text-secondaryText">{step.text}</p>
              </PixelPanel>
            ))}
          </div>
        </section>

        <aside className="min-w-0">
          <PixelPanel
            variant="default"
            title={t('home.preview.title')}
            eyebrow={t('home.preview.eyebrow')}
            headerAction={
              <PixelButton href="/game?level=999" icon="play" size="sm" variant="ghost">
                {t('common.extra')}
              </PixelButton>
            }
            bodyClassName="p-3"
          >
            <PixelFrame className="aspect-[9/7] min-h-0">
              <div
                className="grid h-full overflow-hidden bg-black"
                style={{
                  gridTemplateColumns: `repeat(${previewTiles[0]?.length ?? 0}, minmax(0, 1fr))`,
                  gap: 0,
                  lineHeight: 0,
                  fontSize: 0,
                }}
              >
                {previewTiles.flatMap((row, y) =>
                  row.map((tile, x) => {
                    const sprite = resolveTileSprite({ tile, map: previewTiles, x, y })
                    const isPlayer = x === previewLevel.playerStart.x && y === previewLevel.playerStart.y

                    return (
                      <div
                        key={`${x}-${y}`}
                        className="relative aspect-square"
                        style={{
                          margin: 0,
                          padding: 0,
                          overflow: isPlayer ? 'visible' : 'hidden',
                          zIndex: isPlayer ? 30 : 0,
                        }}
                      >
                        {sprite ? <SpriteTile sprite={sprite} size={48} fill className="absolute inset-0" /> : null}
                        {renderTileOverlay(tile, 48, tileLabels)}
                        {isPlayer ? (
                          <img
                            src="/assets/personagem/Idle/Ghost_idle_side_1.png"
                            alt="Player"
                            className="absolute left-1/2 top-1/2 z-20 object-contain dungeon-entity-sprite"
                            style={{
                              width: `${HOME_PLAYER_SPRITE_SCALE * 100}%`,
                              height: `${HOME_PLAYER_SPRITE_SCALE * 100}%`,
                              maxWidth: 'none',
                              maxHeight: 'none',
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                        ) : null}
                      </div>
                    )
                  })
                )}
              </div>
            </PixelFrame>

            <div className="mt-3 border-2 border-border bg-black p-3 font-mono text-[10px] leading-5 text-primaryText">
              <div>for (let i = 0; i &lt; 3; i++) {'{'}</div>
              <div>&nbsp;&nbsp;moveForward();</div>
              <div>{'}'}</div>
              <div>// Um loop reduz comandos repetidos.</div>
            </div>
          </PixelPanel>
        </aside>
      </main>

      {showHow && (
        <div className="pixel-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <PixelPanel
            variant="modal"
            className="max-h-[92vh] w-full max-w-5xl overflow-hidden"
            eyebrow={t('home.guide.eyebrow')}
            title={t('home.guide.title')}
            icon="help"
            headerAction={
              <PixelButton type="button" icon="reset" size="sm" variant="ghost" onClick={() => setShowHow(false)} aria-label={t('common.close')}>
                {t('common.close')}
              </PixelButton>
            }
            bodyClassName="max-h-[calc(92vh-5rem)] overflow-auto p-3 sm:p-4"
          >
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <section className="border-2 border-border bg-black p-3">
                <h3 className="pixel-type text-sm font-black text-primaryText">{t('home.guide.firstIdea')}</h3>
                <div className="mt-3 grid gap-2">
                  {localizedHowToPlaySteps.map((step, index) => (
                    <div key={step} className="flex gap-3 border border-border/70 bg-bg p-2 text-sm leading-6 text-secondaryText">
                      <span className="pixel-type text-primaryText">{index + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border-2 border-border bg-black p-3">
                <h3 className="pixel-type text-sm font-black text-primaryText">{t('home.guide.smallExample')}</h3>
                <p className="mt-2 text-sm leading-6 text-secondaryText">
                  {t('home.guide.exampleText')}
                </p>
                <HomeCodeBlock lines={['moveForward();', 'turnRight();', 'moveForward();']} />
              </section>
            </div>

            <section className="mt-4">
              <h3 className="pixel-type text-sm font-black text-primaryText">{t('home.guide.initialCommands')}</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {localizedBasicCommands.map((item) => (
                  <article key={item.command} className="border-2 border-border bg-black p-3">
                    <span className="pixel-command-chip font-mono">{item.command}</span>
                    <h4 className="pixel-type mt-3 text-xs font-black text-primaryText">{item.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-secondaryText">{item.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-4">
              <h3 className="pixel-type text-sm font-black text-primaryText">{t('home.guide.learning')}</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {localizedLearningMoments.map((item) => (
                  <div key={item.title} className="border-2 border-border bg-black p-3">
                    <p className="pixel-type text-xs text-primaryText">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-secondaryText">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-4 border-2 border-border bg-black p-3 text-sm leading-6 text-secondaryText">
              {t('home.guide.tip')}
            </div>
          </PixelPanel>
        </div>
      )}
    </div>
  )
}
