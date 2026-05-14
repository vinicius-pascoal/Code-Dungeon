import React from 'react'

type Props = {
  concepts?: string[]
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-6 h-6 flex items-center justify-center border border-border rounded-sm bg-floor flex-shrink-0">
      {children}
    </div>
  )
}

function conceptLabel(concept: string) {
  switch (concept) {
    case 'loops':
      return 'Loops (while / for)'
    case 'conditionals':
      return 'Condicionais (if)'
    case 'functions':
      return 'Funções'
    case 'repetition':
      return 'Repetição'
    case 'planning':
      return 'Planejamento'
    case 'reuse':
      return 'Reuso'
    case 'abstraction':
      return 'Abstração'
    case 'milestone':
      return 'Marco'
    case 'if':
      return 'if'
    default:
      return concept
  }
}

export default function Legend({ concepts = [] }: Props) {
  return (
    <div className="panel p-2 rounded-md h-full overflow-auto">
      <h3 className="font-semibold text-xs mb-2">Legenda</h3>
      <div className="flex flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Icon>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" fill="none" />
              <rect x="3" y="3" width="18" height="18" fill="#1E293B" />
            </svg>
          </Icon>
          <div className="text-secondaryText">Chão</div>
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap">
          <Icon>
            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" fill="#334155" />
            </svg>
          </Icon>
          <div className="text-secondaryText">Parede</div>
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap">
          <Icon>
            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3 L14 9 L20 9 L15 13 L17 19 L12 15 L7 19 L9 13 L4 9 L10 9 Z" fill="#EF4444" />
            </svg>
          </Icon>
          <div className="text-secondaryText">Espinhos</div>
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap">
          <Icon>
            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" fill="#22C55E" />
              <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#071">E</text>
            </svg>
          </Icon>
          <div className="text-secondaryText">Saída</div>
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap">
          <Icon>
            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="8" width="12" height="8" fill="#FACC15" />
              <rect x="10" y="10" width="4" height="4" fill="#111827" />
            </svg>
          </Icon>
          <div className="text-secondaryText">Chave/Baú</div>
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap">
          <Icon>
            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="7" width="12" height="10" fill="#92400E" />
              <rect x="10" y="11" width="4" height="3" fill="#F8FAFC" />
            </svg>
          </Icon>
          <div className="text-secondaryText">Porta</div>
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap">
          <Icon>
            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" fill="#EF4444" />
              <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff">M</text>
            </svg>
          </Icon>
          <div className="text-secondaryText">Inimigo</div>
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap">
          <Icon>
            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="3" fill="#38BDF8" />
              <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#071">P</text>
            </svg>
          </Icon>
          <div className="text-secondaryText">Jogador</div>
        </div>
      </div>

      {concepts.length > 0 ? (
        <div className="mt-3 border-t border-border pt-3">
          <div className="mb-2 text-[11px] uppercase tracking-wide text-secondaryText">Conceitos da fase</div>
          <div className="flex flex-wrap gap-2">
            {concepts.map((concept) => (
              <span key={concept} className="rounded-full border border-border bg-black/20 px-2 py-1 text-xs text-secondaryText">
                {conceptLabel(concept)}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
