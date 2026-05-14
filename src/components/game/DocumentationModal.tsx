import React from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function DocumentationModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-panel border border-border rounded-lg max-w-2xl max-h-[90vh] overflow-auto shadow-2xl">
        <div className="sticky top-0 bg-panel border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Documentação - Funcionalidades</h2>
          <button
            onClick={onClose}
            className="text-secondaryText hover:text-primaryText text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Variáveis */}
          <section>
            <h3 className="text-lg font-semibold text-magic mb-2">📦 Variáveis</h3>
            <p className="text-sm text-secondaryText mb-3">Armazene valores para usar ao longo do seu código:</p>
            <div className="bg-black/30 p-3 rounded-md font-mono text-xs text-green-400 space-y-1">
              <div>let x = 5;</div>
              <div>const name = "player";</div>
              <div>var count = 0;</div>
            </div>
          </section>

          {/* Condicionais */}
          <section>
            <h3 className="text-lg font-semibold text-magic mb-2">🔀 Condicionais (if/else)</h3>
            <p className="text-sm text-secondaryText mb-3">Tome decisões baseadas em condições:</p>
            <div className="bg-black/30 p-3 rounded-md font-mono text-xs text-green-400">
              <div>if (x &gt; 5) {'{'}</div>
              <div className="ml-4">moveForward();</div>
              <div>{'}'} else if (x == 3) {'{'}</div>
              <div className="ml-4">turnLeft();</div>
              <div>{'}'} else {'{'}</div>
              <div className="ml-4">attack();</div>
              <div>{'}'}</div>
            </div>
          </section>

          {/* Loops - While */}
          <section>
            <h3 className="text-lg font-semibold text-magic mb-2">🔄 Loop While</h3>
            <p className="text-sm text-secondaryText mb-3">Repita comandos enquanto uma condição é verdadeira:</p>
            <div className="bg-black/30 p-3 rounded-md font-mono text-xs text-green-400">
              <div>let count = 0;</div>
              <div>while (count &lt; 5) {'{'}</div>
              <div className="ml-4">moveForward();</div>
              <div className="ml-4">count++;</div>
              <div>{'}'}</div>
            </div>
          </section>

          {/* Loops - For */}
          <section>
            <h3 className="text-lg font-semibold text-magic mb-2">🔁 Loop For</h3>
            <p className="text-sm text-secondaryText mb-3">Repita um bloco de código um número específico de vezes:</p>
            <div className="bg-black/30 p-3 rounded-md font-mono text-xs text-green-400">
              <div>for (let i = 0; i &lt; 10; i++) {'{'}</div>
              <div className="ml-4">moveForward();</div>
              <div>{'}'}</div>
            </div>
          </section>

          {/* Funções */}
          <section>
            <h3 className="text-lg font-semibold text-magic mb-2">⚙️ Funções</h3>
            <p className="text-sm text-secondaryText mb-3">Agrupe comandos reutilizáveis em funções:</p>
            <div className="bg-black/30 p-3 rounded-md font-mono text-xs text-green-400">
              <div>function moveNTimes(n) {'{'}</div>
              <div className="ml-4">for (let i = 0; i &lt; n; i++) {'{'}</div>
              <div className="ml-8">moveForward();</div>
              <div className="ml-4">{'}'}</div>
              <div>{'}'}</div>
              <div className="mt-2">moveNTimes(5);</div>
            </div>
          </section>

          {/* Operadores */}
          <section>
            <h3 className="text-lg font-semibold text-magic mb-2">🔧 Operadores</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold text-primaryText mb-1">Aritmética</p>
                <div className="text-secondaryText space-y-1">
                  <div>+ adição</div>
                  <div>- subtração</div>
                  <div>* multiplicação</div>
                  <div>/ divisão</div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-primaryText mb-1">Comparação</p>
                <div className="text-secondaryText space-y-1">
                  <div>== igualdade</div>
                  <div>!= diferença</div>
                  <div>&gt; maior que</div>
                  <div>&lt; menor que</div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-primaryText mb-1">Lógica</p>
                <div className="text-secondaryText space-y-1">
                  <div>&amp;&amp; AND</div>
                  <div>|| OR</div>
                  <div>! NOT</div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-primaryText mb-1">Atribuição</p>
                <div className="text-secondaryText space-y-1">
                  <div>= atribui valor</div>
                  <div>+= adiciona</div>
                  <div>-= subtrai</div>
                </div>
              </div>
            </div>
          </section>

          {/* Comandos do Jogo */}
          <section>
            <h3 className="text-lg font-semibold text-magic mb-2">🎮 Comandos do Jogo</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-secondaryText">
              <div>• moveForward()</div>
              <div>• turnLeft()</div>
              <div>• turnRight()</div>
              <div>• attack()</div>
              <div>• grabKey()</div>
              <div>• openDoor()</div>
              <div>• openChest()</div>
            </div>
          </section>

          {/* Dicas */}
          <section className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-md">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">💡 Dicas</h3>
            <ul className="text-xs text-secondaryText space-y-1">
              <li>• Use variáveis para contar iterações e tomar decisões</li>
              <li>• Defina funções reutilizáveis para padrões repetidos</li>
              <li>• Combine loops e condicionais para lógica complexa</li>
              <li>• Seu código é automaticamente salvo a cada alteração</li>
            </ul>
          </section>
        </div>

        <div className="sticky bottom-0 bg-panel border-t border-border px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-magic text-bg border border-magic rounded-md hover:bg-blue-600 transition-colors font-semibold text-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
