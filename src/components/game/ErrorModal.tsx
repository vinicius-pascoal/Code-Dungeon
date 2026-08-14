import PixelButton from '../ui/PixelButton'
import PixelPanel from '../ui/PixelPanel'

type Props = {
  isOpen: boolean
  title: string
  commandLabel?: string
  reason: string
  suggestion: string
  onRetry: () => void
}

export default function ErrorModal({ isOpen, title, commandLabel, reason, suggestion, onRetry }: Props) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="pixel-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <PixelPanel variant="modal" className="w-full max-w-lg" eyebrow="Erro na execucao" title={title}>
        {commandLabel ? (
          <div className="border-2 border-border bg-black p-3 text-sm">
            <div className="pixel-eyebrow">Comando afetado</div>
            <div className="mt-1 font-mono text-primaryText">{commandLabel}</div>
          </div>
        ) : null}

        <div className="mt-4 border-2 border-border bg-black p-3 text-sm">
          <div className="pixel-eyebrow">Motivo</div>
          <p className="mt-1 text-primaryText">{reason}</p>
        </div>

        <div className="mt-4 border-2 border-border bg-black p-3 text-sm">
          <div className="pixel-eyebrow">Sugestao</div>
          <p className="mt-1 text-primaryText">{suggestion}</p>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <PixelButton type="button" icon="reset" variant="danger" onClick={onRetry}>
            Tentar
          </PixelButton>
          <PixelButton href="/levels" icon="list" variant="primary">
            Fases
          </PixelButton>
        </div>
      </PixelPanel>
    </div>
  )
}
