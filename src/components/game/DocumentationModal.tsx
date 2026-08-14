import React from 'react'
import PixelButton from '../ui/PixelButton'
import PixelPanel from '../ui/PixelPanel'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const sections = [
  {
    title: 'Variaveis',
    text: 'Armazene valores para usar ao longo do codigo.',
    code: ['let x = 5;', 'const name = "player";', 'var count = 0;'],
  },
  {
    title: 'Condicionais',
    text: 'Tome decisoes baseadas em condicoes.',
    code: ['if (look() == "WALL") {', '  turnRight();', '} else {', '  moveForward();', '}'],
  },
  {
    title: 'Loops',
    text: 'Repita comandos enquanto uma condicao for verdadeira ou por contagem.',
    code: ['for (let i = 0; i < 3; i++) {', '  moveForward();', '}'],
  },
  {
    title: 'Funcoes',
    text: 'Agrupe comandos reutilizaveis.',
    code: ['function walk(n) {', '  for (let i = 0; i < n; i++) {', '    moveForward();', '  }', '}'],
  },
]

const gameCommands = [
  'moveForward()',
  'turnLeft()',
  'turnRight()',
  'attack()',
  'grabKey()',
  'openDoor()',
  'openChest()',
  'look()',
  'print(value)',
]

export default function DocumentationModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null

  return (
    <div className="pixel-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <PixelPanel
        variant="modal"
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden"
        eyebrow="Ajuda"
        title="Comandos disponiveis"
        icon="help"
        headerAction={
          <PixelButton type="button" icon="reset" size="sm" variant="ghost" onClick={onClose} aria-label="Fechar ajuda">
            Fechar
          </PixelButton>
        }
        bodyClassName="max-h-[calc(90vh-5rem)] overflow-auto p-4"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <section key={section.title} className="border-2 border-border bg-black p-3">
              <h3 className="pixel-type text-sm font-black text-primaryText">{section.title}</h3>
              <p className="mt-2 text-sm leading-6 text-secondaryText">{section.text}</p>
              <pre className="mt-3 overflow-auto bg-bg p-3 font-mono text-xs leading-5 text-primaryText">
                <code>{section.code.join('\n')}</code>
              </pre>
            </section>
          ))}
        </div>

        <section className="mt-4 border-2 border-border bg-black p-3">
          <h3 className="pixel-type text-sm font-black text-primaryText">Comandos do jogo</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {gameCommands.map((command) => (
              <span key={command} className="pixel-command-chip">
                {command}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-secondaryText">
            Seu codigo e salvo automaticamente no navegador. Use look() para ler o tile a frente e print() para enviar valores ao console.
          </p>
        </section>
      </PixelPanel>
    </div>
  )
}
