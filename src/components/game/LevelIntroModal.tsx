import { useEffect, useState } from 'react'
import PixelButton from '../ui/PixelButton'
import PixelPanel from '../ui/PixelPanel'
import { useI18n } from '../../i18n'

const DEMO_GRID = [
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'floor', 'floor', 'floor', 'floor', 'exit', 'wall'],
  ['wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall'],
  ['wall', 'start', 'floor', 'floor', 'wall', 'wall', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
]

const DEMO_STEPS = [
  { command: 'moveForward();', x: 1, y: 3 },
  { command: 'moveForward();', x: 2, y: 3 },
  { command: 'turnLeft();', x: 3, y: 3 },
  { command: 'moveForward();', x: 3, y: 2 },
  { command: 'moveForward();', x: 3, y: 1 },
  { command: 'turnRight();', x: 3, y: 1 },
  { command: 'moveForward();', x: 4, y: 1 },
  { command: 'moveForward();', x: 5, y: 1 },
]

type Props = {
  isOpen: boolean
  levelName: string
  lines: string[]
  onClose: () => void
  onOpenHelp: () => void
}

function isCodeLine(line: string) {
  return line.includes(';') || line.endsWith('{') || line === '}' || line.startsWith('  ')
}

export default function LevelIntroModal({ isOpen, levelName, lines, onClose, onOpenHelp }: Props) {
  const { t } = useI18n()
  const [demoStep, setDemoStep] = useState(0)

  useEffect(() => {
    if (!isOpen) return

    setDemoStep(0)
    const timer = window.setInterval(() => {
      setDemoStep((currentStep) => (currentStep + 1) % DEMO_STEPS.length)
    }, 1500)

    return () => window.clearInterval(timer)
  }, [isOpen])

  if (!isOpen) return null

  const exampleIndex = lines.findIndex((line) => line === t('game.example'))
  const explanationLines = lines.slice(0, exampleIndex >= 0 ? exampleIndex : lines.length)
  const codeLines = exampleIndex >= 0 ? lines.slice(exampleIndex + 1).filter(isCodeLine) : []

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
              <div className="grid w-full max-w-[280px] grid-cols-7 gap-1" role="img" aria-label={t('game.introDemoMap')}>
                {DEMO_GRID.flatMap((row, y) => row.map((tile, x) => {
                  const isPlayer = DEMO_STEPS[demoStep].x === x && DEMO_STEPS[demoStep].y === y
                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`aspect-square border ${tile === 'wall' ? 'border-border bg-panel' : 'border-border/50 bg-[#171717]'} ${tile === 'exit' ? 'bg-accent/70' : ''}`}
                    >
                      {isPlayer ? <div className="m-1 h-[calc(100%-0.5rem)] bg-primaryText shadow-[2px_2px_0_#000]" /> : null}
                    </div>
                  )
                }))}
              </div>
            </div>
            <div className="border border-border/70 bg-bg p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-secondaryText">{t('game.introDemoCode')}</p>
              <pre className="mt-2 overflow-auto font-mono text-xs leading-6 text-primaryText" aria-live="polite">
                {DEMO_STEPS.map((step, index) => (
                  <code key={`${step.command}-${index}`} className={`block px-2 ${index === demoStep ? 'bg-primaryText text-bg' : 'text-secondaryText'}`}>
                    {step.command}
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
