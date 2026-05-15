# Code Dungeon

Code Dungeon é um protótipo de jogo educativo que ensina conceitos de programação através de puzzles em um mapa em grade (grid). O jogador programa o personagem usando comandos e estruturas simples (em JavaScript-like) e observa a execução passo a passo no mapa.

Tecnologias
- Next.js + React
- TypeScript
- Tailwind CSS
- Editor integrado (CodeMirror / componente próprio)

Principais funcionalidades
- Execução de comandos de jogo (sequenciais): `moveForward()`, `turnLeft()`, `turnRight()`, `attack()`, `grabKey()`, `openDoor()`, `openChest()`
- Sensoriamento: `look()` retorna o tipo do tile à frente (`WALL`, `FLOOR`, `ENEMY`, `OUT_OF_BOUNDS`)
- Debug/saída: `print(value)` — envia texto ao Console do jogo (aceita expressões como `print(look() == 'WALL')`)
- Executor avançado: suporte a `if`, `while`, `for`, `function`, variáveis e expressões
- Sistema de fases, estrelas e progresso salvo no `localStorage`

Pré-requisitos
- Node.js 18+ recomendado
- npm ou yarn

Instalação

```bash
git clone https://github.com/vinicius-pascoal/Code-Dungeon.git
cd Code-Dungeon
npm install
```

Executar em desenvolvimento

```bash
npm run dev
# Abra http://localhost:3000
```

Executar build (produção)

```bash
npm run build
npm run start
```

Como jogar
- Abra uma fase e escreva comandos no editor.
- Pressione **Executar** para executar o código.
- A cada passo, o mapa e a posição do personagem são atualizados e o Console exibe logs e mensagens de `print()`.
- Use **Resetar** para voltar ao estado inicial da fase.

Exemplo simples

```js
moveForward();
moveForward();
turnRight();
moveForward();
```

Sensoriamento e debug

```js
// imprime o que há à frente (WALL, FLOOR, ENEMY, OUT_OF_BOUNDS)
print(look());

// imprime true/false se houver uma parede à frente
print(look() == 'WALL');

// usar em condicionais
if (look() == 'ENEMY') {
	attack();
}
```

Observações de comportamento
- `look()` retorna sempre strings normalizadas (sem espaços e em maiúsculas) para garantir comparações consistentes.
- O executor avançado normaliza comparações de strings (`==` / `!=`) automaticamente quando ambos os lados são strings.

Estrutura do projeto (resumo)
- `src/pages` — rotas do Next.js e páginas (Game, Levels, Index)
- `src/components` — componentes React (GamePage, DungeonGrid, CodeEditor, modais)
- `src/utils` — parser/execução: `commandParser.ts`, `commandExecutor.ts`, `advancedParser.ts`, `advancedExecutor.ts`
- `src/data/levels` — definições de fases e metadados
- `public` — assets (tiles, sprites, etc.)

Comandos do jogo (API)
- `moveForward()` — anda uma célula para frente
- `turnLeft()` — gira 90° para a esquerda
- `turnRight()` — gira 90° para a direita
- `attack()` — ataca a célula à frente (se houver inimigo)
- `grabKey()` — pega a chave na célula atual
- `openDoor()` — abre a porta à frente (se tiver chave)
- `openChest()` — abre o baú à frente
- `look()` — retorna o tipo do tile à frente: `FLOOR`, `WALL`, `SPIKE`, `DOOR`, `OPEN_DOOR`, `CHEST`, `OPEN_CHEST`, `KEY`, `EXIT`, `ENEMY`, `OUT_OF_BOUNDS`
- `print(value)` — imprime `value` no Console do jogo (aceita literais, variáveis e expressões)

Executor avançado
- Para script com `if`, `while`, `for` ou funções definidas pelo usuário, o projeto usa um parser/tokenizer que gera uma AST e um executor que avalia expressões e chama os comandos do jogo.

Como contribuir
- Abra uma issue descrevendo a sugestão ou bug.
- Crie um fork e um branch com sua feature/bugfix.
- Faça PR com descrição clara e testes quando aplicável.

Testes
- Não há suíte de testes completa no repositório (ainda). Sugestão: adicionar testes unitários para `commandParser`, `advancedParser` e os executores.

Licença
- Projeto mantido pelo autor. Adicione uma licença se desejar publicar.

Contato
- Repo: https://github.com/vinicius-pascoal/Code-Dungeon

------

Se quiser, eu posso:
- adicionar exemplos com `look()`/`print()` nos `starterCode` de níveis selecionados, ou
- criar testes unitários básicos para `look()` e para comparações string/boolean.
