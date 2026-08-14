import PixelButton from '../ui/PixelButton'
import PixelPanel from '../ui/PixelPanel'
import PixelStars from '../ui/PixelStars'

type Props = {
  isOpen: boolean
  levelName: string
  stars: number
  commandCount: number
  onRetry: () => void
  nextLevelHref?: string
}

export default function VictoryModal({
  isOpen,
  levelName,
  stars,
  commandCount,
  onRetry,
  nextLevelHref,
}: Props) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="pixel-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <PixelPanel variant="modal" className="w-full max-w-lg" eyebrow="Resultado da fase" title="Fase concluida">
        <div className="text-center">
          <p className="text-sm leading-6 text-secondaryText">{levelName} concluida com sucesso.</p>
          <div className="mt-5 flex justify-center">
            <PixelStars count={stars} scale={2} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="border-2 border-border bg-black p-3">
            <div className="pixel-eyebrow">Estrelas</div>
            <div className="font-mono text-xl font-black text-primaryText">{stars}</div>
          </div>
          <div className="border-2 border-border bg-black p-3">
            <div className="pixel-eyebrow">Executados</div>
            <div className="font-mono text-xl font-black text-primaryText">{commandCount}</div>
          </div>
          <div className="border-2 border-border bg-black p-3">
            <div className="pixel-eyebrow">Status</div>
            <div className="font-mono text-xl font-black text-primaryText">OK</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <PixelButton type="button" icon="reset" variant="danger" onClick={onRetry}>
            Repetir
          </PixelButton>
          {nextLevelHref ? (
            <PixelButton href={nextLevelHref} icon="right" variant="primary">
              Proxima
            </PixelButton>
          ) : (
            <PixelButton href="/levels" icon="list" variant="primary">
              Fases
            </PixelButton>
          )}
        </div>
      </PixelPanel>
    </div>
  )
}
