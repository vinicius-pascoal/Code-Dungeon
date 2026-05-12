import Link from 'next/link'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="w-full max-w-lg rounded-lg border border-border bg-panel p-6 shadow-2xl">
        <div className="mb-3 inline-flex rounded-full bg-success/20 px-3 py-1 text-sm font-semibold text-success">
          Vitória
        </div>
        <h2 className="text-2xl font-bold">{levelName} concluída</h2>
        <p className="mt-2 text-sm text-secondaryText">
          Você chegou ao objetivo e resolveu a fase com sucesso.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-md bg-black/30 p-3">
            <div className="text-secondaryText">Estrelas</div>
            <div className="mt-1 text-xl font-bold text-treasure">{stars}</div>
          </div>
          <div className="rounded-md bg-black/30 p-3">
            <div className="text-secondaryText">Comandos</div>
            <div className="mt-1 text-xl font-bold">{commandCount}</div>
          </div>
          <div className="rounded-md bg-black/30 p-3">
            <div className="text-secondaryText">Status</div>
            <div className="mt-1 text-xl font-bold text-success">OK</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button onClick={onRetry} className="rounded-md border border-border px-4 py-2 text-sm">
            Repetir fase
          </button>
          {nextLevelHref ? (
            <Link href={nextLevelHref} className="rounded-md bg-magic px-4 py-2 text-sm font-semibold text-bg">
              Próxima fase
            </Link>
          ) : (
            <Link href="/levels" className="rounded-md bg-magic px-4 py-2 text-sm font-semibold text-bg">
              Voltar para fases
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
