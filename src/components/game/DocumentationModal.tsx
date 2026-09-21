import React from 'react'
import PixelButton from '../ui/PixelButton'
import PixelPanel from '../ui/PixelPanel'

type Props = {
  isOpen: boolean
  onClose: () => void
  availableCommands?: string[]
}

type CommandDoc = {
  key: string
  command: string
  title: string
  text: string
  example: string
}

type ConceptDoc = {
  keys: string[]
  title: string
  meaning: string
  whenToUse: string
  code: string[]
}

const firstSteps = [
  'Leia o objetivo da fase.',
  'Observe o mapa antes de escrever a rota.',
  'Escreva poucos comandos, execute e observe o resultado.',
  'Ajuste o codigo aos poucos ate chegar na saida.',
]

const movementCommands: CommandDoc[] = [
  {
    key: 'moveForward',
    command: 'moveForward()',
    title: 'Andar',
    text: 'Avanca uma casa na direcao atual.',
    example: 'moveForward();',
  },
  {
    key: 'turnLeft',
    command: 'turnLeft()',
    title: 'Virar para esquerda',
    text: 'Muda apenas a direcao do personagem.',
    example: 'turnLeft();',
  },
  {
    key: 'turnRight',
    command: 'turnRight()',
    title: 'Virar para direita',
    text: 'Muda apenas a direcao do personagem.',
    example: 'turnRight();',
  },
  {
    key: 'look',
    command: 'look()',
    title: 'Olhar a frente',
    text: 'Retorna o que existe na proxima casa: WALL, ENEMY, KEY, SPIKE, DOOR, CHEST, EXIT, VOID ou FLOOR.',
    example: 'if (look() == "ENEMY") {\n  attack();\n}',
  },
]

const interactionCommands: CommandDoc[] = [
  {
    key: 'grabKey',
    command: 'grabKey()',
    title: 'Pegar chave',
    text: 'Coleta uma chave quando o personagem esta em cima dela.',
    example: 'grabKey();',
  },
  {
    key: 'openDoor',
    command: 'openDoor()',
    title: 'Abrir porta',
    text: 'Abre a porta que esta na frente, se voce tiver uma chave.',
    example: 'openDoor();',
  },
  {
    key: 'openChest',
    command: 'openChest()',
    title: 'Abrir bau',
    text: 'Abre o bau que esta na frente do personagem.',
    example: 'openChest();',
  },
  {
    key: 'attack',
    command: 'attack()',
    title: 'Atacar',
    text: 'Derrota um inimigo que esta exatamente na casa da frente.',
    example: 'attack();\nmoveForward();',
  },
  {
    key: 'print',
    command: 'print(value)',
    title: 'Mostrar no console',
    text: 'Ajuda a entender o que o codigo esta vendo ou calculando.',
    example: 'print(look());',
  },
]

const concepts: ConceptDoc[] = [
  {
    keys: ['let', 'var', 'const'],
    title: 'Variavel',
    meaning: 'Guarda um valor com nome para usar depois.',
    whenToUse: 'Use quando precisar contar passos, lembrar um resultado ou controlar repeticoes.',
    code: ['let passos = 3;', 'print(passos);'],
  },
  {
    keys: ['if', 'else'],
    title: 'Condicional',
    meaning: 'Escolhe um caminho quando uma pergunta e verdadeira ou falsa.',
    whenToUse: 'Use com look() para reagir ao mapa sem adivinhar.',
    code: ['if (look() == "ENEMY") {', '  attack();', '} else {', '  moveForward();', '}'],
  },
  {
    keys: ['for'],
    title: 'Loop for',
    meaning: 'Repete um bloco uma quantidade definida de vezes.',
    whenToUse: 'Use quando voce sabe quantas casas quer andar.',
    code: ['for (let i = 0; i < 3; i++) {', '  moveForward();', '}'],
  },
  {
    keys: ['while'],
    title: 'Loop while',
    meaning: 'Repete um bloco enquanto uma pergunta continuar verdadeira.',
    whenToUse: 'Use quando a repeticao depende de uma condicao que pode mudar.',
    code: ['let passos = 0;', 'while (passos < 3) {', '  moveForward();', '  passos++;', '}'],
  },
  {
    keys: ['function'],
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

export default function DocumentationModal({ isOpen, onClose, availableCommands }: Props) {
  if (!isOpen) return null

  const availableSet = new Set(availableCommands ?? [])
  const shouldShowAll = !availableCommands?.length
  const isAvailable = (key: string) => shouldShowAll || availableSet.has(key)
  const availableMovementCommands = movementCommands.filter((item) => isAvailable(item.key))
  const availableInteractionCommands = interactionCommands.filter((item) => isAvailable(item.key))
  const availableConcepts = concepts.filter((item) => shouldShowAll || item.keys.some((key) => availableSet.has(key)))

  return (
    <div className="pixel-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <PixelPanel
        variant="modal"
        className="max-h-[92vh] w-full max-w-5xl overflow-hidden"
        eyebrow="Ajuda da fase"
        title="Comandos disponiveis"
        icon="help"
        headerAction={
          <PixelButton type="button" icon="reset" size="sm" variant="ghost" onClick={onClose} aria-label="Fechar ajuda">
            Fechar
          </PixelButton>
        }
        bodyClassName="max-h-[calc(92vh-5rem)] overflow-auto p-3 sm:p-4"
      >
        {availableMovementCommands.length ? (
          <section className="mt-4">
            <h3 className="pixel-type text-sm font-black text-primaryText">Comandos de movimento</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {availableMovementCommands.map((item) => (
                <CommandCard key={item.command} item={item} />
              ))}
            </div>
          </section>
        ) : null}

        {availableInteractionCommands.length ? (
          <section className="mt-4">
            <h3 className="pixel-type text-sm font-black text-primaryText">Comandos de interacao</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {availableInteractionCommands.map((item) => (
                <CommandCard key={item.command} item={item} />
              ))}
            </div>
          </section>
        ) : null}

        {availableConcepts.length ? (
          <section className="mt-4">
            <h3 className="pixel-type text-sm font-black text-primaryText">Conceitos de programacao</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {availableConcepts.map((item) => (
                <ConceptCard key={item.title} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </PixelPanel>
    </div>
  )
}
