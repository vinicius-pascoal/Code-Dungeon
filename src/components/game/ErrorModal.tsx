import Link from 'next/link'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="w-full max-w-lg rounded-lg border border-border bg-panel p-6 shadow-2xl">
        <div className="mb-3 inline-flex rounded-full bg-danger/20 px-3 py-1 text-sm font-semibold text-danger">
          Erro na execução
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>

        {commandLabel ? (
          <div className="mt-4 rounded-md bg-black/30 p-3 text-sm">
            <div className="text-secondaryText">Comando afetado</div>
            <div className="mt-1 font-mono text-primaryText">{commandLabel}</div>
          </div>
        ) : null}

        <div className="mt-4 rounded-md bg-black/30 p-3 text-sm">
          <div className="text-secondaryText">Motivo</div>
          <p className="mt-1 text-primaryText">{reason}</p>
        </div>

        <div className="mt-4 rounded-md bg-black/30 p-3 text-sm">
          <div className="text-secondaryText">Sugestão</div>
          <p className="mt-1 text-primaryText">{suggestion}</p>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button onClick={onRetry} className="rounded-md border border-border px-4 py-2 text-sm">
            Tentar novamente
          </button>
          <Link href="/levels" className="rounded-md bg-magic px-4 py-2 text-sm font-semibold text-bg">
            Ver fases
          </Link>
        </div>
      </div>
    </div>
  )
}
