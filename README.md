# Code Dungeon

Code Dungeon é um jogo educativo/experimental que ensina lógica e programação através de puzzles em uma grade (grid). O jogador escreve scripts (estilo JavaScript/TypeScript) que controlam um personagem e observa a execução passo a passo.

Principais pontos
- Foco em aprendizado — comandos simples e visualização passo a passo.
- Parser e executor próprios com suporte a estruturas (`if`, `while`, `for`, `function`).
- Sistema de fases e progresso local.

Iniciando (desenvolvimento)

Pré-requisitos:
- Node.js 18+ (recomendado)
- npm ou yarn

Instalação:

```bash
git clone https://github.com/vinicius-pascoal/Code-Dungeon.git
cd Code-Dungeon
npm install
```

Rodar em modo desenvolvimento:

```bash
npm run dev
# Acesse http://localhost:3000
```

Build e execução em produção:

```bash
npm run build
npm run start
```

Estrutura útil do projeto
- `src/pages` — páginas Next.js, incl. a página do jogo ([src/pages/game.tsx](src/pages/game.tsx)).
- `src/components/game` — UI do jogo: `GamePage`, `DungeonGrid`, `CodeEditor`, modais.
- `src/utils` — parser/execução: `commandParser.ts`, `commandExecutor.ts`, `advancedParser.ts`, `advancedExecutor.ts`.
- `src/data/levels` — definições de níveis e metadados.
- `public/assets` — sprites e tiles.

Endpoints / Rotas
- `/` — Página inicial ([src/pages/index.tsx](src/pages/index.tsx)).
- `/game` — Página do jogo; aceita query param `level` (ex.: `/game?level=1`, `/game?level=999`) ([src/pages/game.tsx](src/pages/game.tsx)).
- `/levels` — Lista de fases e links para jogar ([src/pages/levels.tsx](src/pages/levels.tsx)).

Observação: não há rotas de API em `pages/api` neste repositório.

API de comandos (exemplos)
- `moveForward()` — avança uma célula.
- `turnLeft()` / `turnRight()` — roda 90°.
- `attack()` — ataca a célula à frente.
- `grabKey()` / `openDoor()` / `openChest()` — interações com itens.
- `look()` — inspeciona o tile à frente (retorna strings normalizadas como `WALL`, `FLOOR`, `ENEMY`, `OUT_OF_BOUNDS`).
- `print(value)` — envia saída para o Console do jogo.

Exemplo rápido:

```js
moveForward();
moveForward();
turnRight();
moveForward();
```

Como contribuir
- Abra uma issue ou PR com uma descrição clara.
- Para alterações de funcionalidade, adicione testes quando aplicável.

Notas
- O repositório contém um executor avançado que transforma código em AST e executa comandos no ambiente do jogo; os arquivos principais estão em `src/utils`.

Links úteis
- [Página do jogo](https://code-dungeons.vercel.app)

Contato
- Repositório: https://github.com/vinicius-pascoal/Code-Dungeon
