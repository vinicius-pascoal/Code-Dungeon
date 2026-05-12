import React from 'react'

export default function Legend() {
  const items = [
    { label: 'Chão', symbol: '', cls: 'bg-floor' },
    { label: 'Parede', symbol: '', cls: 'bg-wall' },
    { label: 'Espinhos', symbol: '^', cls: 'bg-danger text-bg' },
    { label: 'Saída', symbol: 'E', cls: 'bg-success text-bg' },
    { label: 'Chave', symbol: 'K', cls: 'bg-treasure text-bg' },
    { label: 'Porta', symbol: 'D', cls: 'bg-wood text-primaryText' },
    { label: 'Baú', symbol: 'C', cls: 'bg-treasure text-bg' },
    { label: 'Inimigo', symbol: 'M', cls: 'bg-danger text-bg' },
    { label: 'Jogador', symbol: 'P', cls: 'bg-magic text-bg' },
  ]

  return (
    <div className="panel p-3 rounded-md">
      <h3 className="font-semibold mb-2">Legenda</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center border border-border rounded ${it.cls}`}>
              <span className="text-xs font-bold">{it.symbol}</span>
            </div>
            <div className="text-secondaryText">{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
