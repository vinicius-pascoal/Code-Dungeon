import React from 'react'
import PixelButton from '../ui/PixelButton'
import PixelPanel from '../ui/PixelPanel'

type Props = {
  isOpen: boolean
  onClose: () => void
}

type CommandDoc = {
  command: string
  title: string
  text: string
  example: string
}

type ConceptDoc = {
  title: string
  meaning: string
  whenToUse: string
  code: string[]
}

const firstSteps = [
  'Leia o objetivo da fase.',
  'Descubra o que esta na frente do personagem.',
  'Escreva poucos comandos, execute e observe o resultado.',
  'Quando uma acao se repete, transforme em loop ou funcao.',
]

const movementCommands: CommandDoc[] = [
  {
    command: 'moveForward()',
    title: 'Andar',
    text: 'Avanca uma casa na direcao atual.',
    example: 'moveForward();',
  },
  {
    command: 'turnLeft()',
    title: 'Virar para esquerda',
    text: 'Muda apenas a direcao do personagem.',
    example: 'turnLeft();',
  },
  {
    command: 'turnRight()',
    title: 'Virar para direita',
    text: 'Muda apenas a direcao do personagem.',
    example: 'turnRight();',
  },
  {
    command: 'look()',
    title: 'Olhar a frente',
    text: 'Retorna o que existe na proxima casa: WALL, ENEMY, KEY, SPIKE, DOOR, CHEST, EXIT, VOID ou FLOOR.',
    example: 'if (look() == "ENEMY") {\n  attack();\n}',
  },
]

const interactionCommands: CommandDoc[] = [
  {
    command: 'grabKey()',
    title: 'Pegar chave',
    text: 'Coleta uma chave quando o personagem esta em cima dela.',
    example: 'grabKey();',
  },
  {
    command: 'openDoor()',
    title: 'Abrir porta',
    text: 'Abre a porta que esta na frente, se voce tiver uma chave.',
    example: 'openDoor();',
  },
  {
    command: 'openChest()',
    title: 'Abrir bau',
    text: 'Abre o bau que esta na frente do personagem.',
    example: 'openChest();',
  },
  {
    command: 'attack()',
    title: 'Atacar',
    text: 'Derrota um inimigo que esta exatamente na casa da frente.',
    example: 'attack();\nmoveForward();',
  },
  {
    command: 'print(value)',
    title: 'Mostrar no console',
    text: 'Ajuda a entender o que o codigo esta vendo ou calculando.',
    example: 'print(look());',
  },
]

const concepts: ConceptDoc[] = [
  {
    title: 'Variavel',
    meaning: 'Guarda um valor com nome para usar depois.',
    whenToUse: 'Use quando precisar contar passos, lembrar um resultado ou controlar repeticoes.',
    code: ['let passos = 3;', 'print(passos);'],
  },
  {
    title: 'Condicional',
    meaning: 'Escolhe um caminho quando uma pergunta e verdadeira ou falsa.',
    whenToUse: 'Use com look() para reagir ao mapa sem adivinhar.',
    code: ['if (look() == "ENEMY") {', '  attack();', '} else {', '  moveForward();', '}'],
  },
  {
    title: 'Loop for',
    meaning: 'Repete um bloco uma quantidade definida de vezes.',
    whenToUse: 'Use quando voce sabe quantas casas quer andar.',
    code: ['for (let i = 0; i < 3; i++) {', '  moveForward();', '}'],
  },
  {
    title: 'Funcao',
    meaning: 'Cria um comando novo juntando varios comandos menores.',
    whenToUse: 'Use quando uma sequencia aparece varias vezes na solucao.',
    code: ['function walk(times) {', '  for (let i = 0; i < times; i++) {', '    moveForward();', '  }', '}', '', 'walk(4);'],
  },
]

function CodeBlock({ lines }: { lines: string[] }) {
  return (
    <pre className="mt-3 overflow-auto border border-border/70 bg-bg p-3 font-mono text-xs leading-5 text-primaryText">
      <code>{lines.join('\n')}</code>
    </pre>
  )
}

function CommandCard({ item }: { item: CommandDoc }) {
  return (
    <article className="border-2 border-border bg-black p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="pixel-command-chip">{item.command}</span>
        <h4 className="pixel-type text-xs font-black text-primaryText">{item.title}</h4>
      </div>
      <p className="mt-2 text-sm leading-6 text-secondaryText">{item.text}</p>
      <CodeBlock lines={item.example.split('\n')} />
    </article>
  )
}

function ConceptCard({ item }: { item: ConceptDoc }) {
  return (
    <article className="border-2 border-border bg-black p-3">
      <h4 className="pixel-type text-sm font-black text-primaryText">{item.title}</h4>
      <p className="mt-2 text-sm leading-6 text-secondaryText">{item.meaning}</p>
      <p className="mt-2 text-sm leading-6 text-secondaryText">
        <span className="font-black text-primaryText">Quando usar:</span> {item.whenToUse}
      </p>
      <CodeBlock lines={item.code} />
    </article>
  )
}

export default function DocumentationModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null

  return (
    <div className="pixel-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <PixelPanel
        variant="modal"
        className="max-h-[92vh] w-full max-w-5xl overflow-hidden"
        eyebrow="Guia rapido"
        title="Como programar a dungeon"
        icon="help"
        headerAction={
          <PixelButton type="button" icon="reset" size="sm" variant="ghost" onClick={onClose} aria-label="Fechar ajuda">
            Fechar
          </PixelButton>
        }
        bodyClassName="max-h-[calc(92vh-5rem)] overflow-auto p-3 sm:p-4"
      >
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="border-2 border-border bg-black p-3">
            <h3 className="pixel-type text-sm font-black text-primaryText">Comece assim</h3>
            <div className="mt-3 grid gap-2">
              {firstSteps.map((step, index) => (
                <div key={step} className="flex gap-3 border border-border/70 bg-bg p-2 text-sm leading-6 text-secondaryText">
                  <span className="pixel-type text-primaryText">{index + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 border border-border/70 bg-bg p-3">
              <p className="text-sm leading-6 text-secondaryText">
                Um programa e lido de cima para baixo. Cada linha termina com <code className="font-mono text-primaryText">;</code>.
              </p>
              <CodeBlock lines={['moveForward();', 'turnRight();', 'moveForward();']} />
            </div>
          </section>

          <section className="border-2 border-border bg-black p-3">
            <h3 className="pixel-type text-sm font-black text-primaryText">Mapa mental</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="border border-border/70 bg-bg p-3">
                <p className="pixel-type text-xs text-primaryText">Comando</p>
                <p className="mt-2 text-sm leading-6 text-secondaryText">Uma acao direta, como andar ou virar.</p>
              </div>
              <div className="border border-border/70 bg-bg p-3">
                <p className="pixel-type text-xs text-primaryText">Pergunta</p>
                <p className="mt-2 text-sm leading-6 text-secondaryText">Uma decisao feita com if e look().</p>
              </div>
              <div className="border border-border/70 bg-bg p-3">
                <p className="pixel-type text-xs text-primaryText">Repeticao</p>
                <p className="mt-2 text-sm leading-6 text-secondaryText">Um bloco que evita escrever a mesma linha varias vezes.</p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-4">
          <h3 className="pixel-type text-sm font-black text-primaryText">Comandos de movimento</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {movementCommands.map((item) => (
              <CommandCard key={item.command} item={item} />
            ))}
          </div>
        </section>

        <section className="mt-4">
          <h3 className="pixel-type text-sm font-black text-primaryText">Comandos de interacao</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {interactionCommands.map((item) => (
              <CommandCard key={item.command} item={item} />
            ))}
          </div>
        </section>

        <section className="mt-4">
          <h3 className="pixel-type text-sm font-black text-primaryText">Conceitos de programacao</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {concepts.map((item) => (
              <ConceptCard key={item.title} item={item} />
            ))}
          </div>
        </section>
      </PixelPanel>
    </div>
  )
}
