# Code Dungeon

Code Dungeon e um jogo educativo de logica e programacao em que o jogador resolve fases de masmorra escrevendo comandos em uma linguagem inspirada em JavaScript/TypeScript. Cada programa controla um personagem em uma grade, permitindo visualizar a execucao passo a passo, testar estrategias e aprender conceitos de programacao de forma pratica.

## Sumario

- [Resumo do projeto](#resumo-do-projeto)
- [Objetivos](#objetivos)
- [Funcionalidades](#funcionalidades)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Fontes dos assets](#fontes-dos-assets)
- [Como executar](#como-executar)
- [Scripts disponiveis](#scripts-disponiveis)
- [Rotas da aplicacao](#rotas-da-aplicacao)
- [Comandos do jogo](#comandos-do-jogo)
- [Conceitos trabalhados](#conceitos-trabalhados)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Validacao e testes](#validacao-e-testes)

## Resumo do projeto

O projeto combina uma interface de jogo com um editor de codigo. O jogador le o objetivo da fase, escreve comandos e executa o programa para mover o personagem ate a saida. Ao longo da progressao, novos recursos sao liberados gradualmente: movimento, curvas, espinhos, chaves, portas, inimigos, baus, leitura do ambiente, variaveis, condicionais, loops e funcoes.

A aplicacao possui 19 fases guiadas organizadas em mundos tematicos, alem do modo extra de labirinto procedural pela fase `999`. O progresso do codigo de cada fase e salvo no `localStorage`, facilitando tentativa, erro e refinamento.

## Objetivos

- Ensinar logica de programacao com feedback visual imediato.
- Transformar conceitos abstratos em desafios de movimentacao, leitura e decisao.
- Incentivar planejamento, depuracao e melhoria gradual de solucoes.
- Oferecer uma base extensivel para novas fases, comandos, assets e mecanicas.

## Funcionalidades

- Editor de codigo integrado a tela do jogo.
- Execucao passo a passo dos comandos escritos pelo jogador.
- Sistema de fases com objetivo, comandos disponiveis, comandos obrigatorios e regras de estrelas.
- Cinco mundos guiados: fundamentos, interacoes, condicionais, loops e funcoes.
- Modo extra de labirinto procedural em `/game?level=999`.
- Fases finais de funcoes com mapas grandes `20x20`, rotas longas e mecanicas combinadas.
- Tela `/levels` com cards de mundos, trilha pontilhada de progressao e previews reais dos mapas usando os assets do jogo.
- Modal de mundo com preview de cada fase e acesso direto ao botao de jogar.
- Modal inicial de fase focado apenas na novidade daquela fase.
- Botao `Ajuda` no jogo com documentacao filtrada pelos comandos disponiveis na fase atual.
- Modal "Como jogar" na pagina inicial com guia rapido, exemplos e comandos basicos.
- Parser simples para listas diretas de comandos.
- Parser e executor avancados para variaveis, expressoes, condicionais, loops e funcoes.
- Salvamento automatico do codigo no navegador.
- Modais de vitoria, erro, ajuda e introducao de fase.
- Assets visuais para personagem, pisos, paredes, espinhos, detalhes, inimigos, UI e previews.

## Tecnologias utilizadas

- [Next.js](https://nextjs.org/) 14
- [React](https://react.dev/) 18
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Node.js e npm

## Fontes dos assets

Os assets visuais utilizados no projeto vieram das seguintes fontes:

| Asset | Fonte |
| --- | --- |
| Interface / UI | [1 Bit Game UI Pack](https://andelrodis.itch.io/1-bit-game-ui-pack) |
| Personagem | [Dummy Dungeon Character Pack](https://sorto-dedd.itch.io/dummy-dungeon-character-pack) |
| Mapa, detalhes e inimigo | [Playdate Dungeon Tileset Top Down 20x20](https://schwarnhild.itch.io/playdate-dungeon-tileset-top-down-20x20) |

## Como executar

### Pre-requisitos

- Node.js 18 ou superior
- npm

### Instalacao

```bash
git clone https://github.com/vinicius-pascoal/Code-Dungeon.git
cd Code-Dungeon
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Depois acesse:

```text
http://localhost:3000
```

Se a porta `3000` estiver ocupada, rode o Next em outra porta:

```bash
npx next dev -p 3001
```

### Producao

```bash
npm run build
npm run start
```

## Scripts disponiveis

| Script | Descricao |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento na porta `3000`. |
| `npm run build` | Gera a versao de producao da aplicacao. |
| `npm run start` | Executa a aplicacao em modo producao na porta `3000`. |

## Rotas da aplicacao

| Rota | Descricao |
| --- | --- |
| `/` | Pagina inicial com apresentacao do jogo, preview e modal "Como jogar". |
| `/levels` | Selecao de mundos e fases, com previews dos mapas e trilha de progressao. |
| `/game` | Tela principal do jogo, iniciando pela fase padrao. |
| `/game?level=1` | Abre uma fase especifica pelo ID. |
| `/game?level=999` | Abre o modo de labirinto procedural. |

Nao ha rotas de API em `pages/api` neste repositorio.

## Comandos do jogo

| Comando | Funcao |
| --- | --- |
| `moveForward()` | Move o personagem uma celula a frente. |
| `turnLeft()` | Gira o personagem 90 graus para a esquerda. |
| `turnRight()` | Gira o personagem 90 graus para a direita. |
| `attack()` | Ataca um inimigo na celula a frente. |
| `grabKey()` | Coleta uma chave na celula atual. |
| `openDoor()` | Abre uma porta a frente quando o jogador possui chave. |
| `openChest()` | Abre um bau a frente. |
| `look()` | Inspeciona a celula a frente e retorna valores como `WALL`, `FLOOR`, `ENEMY`, `KEY`, `SPIKE`, `DOOR`, `CHEST`, `EXIT`, `VOID` ou `OUT_OF_BOUNDS`. |
| `print(value)` | Envia valores e expressoes para o console do jogo. |

Exemplo simples:

```js
moveForward();
turnRight();
moveForward();
```

Exemplo com condicional:

```js
if (look() == "ENEMY") {
  attack();
}
moveForward();
```

Exemplo com repeticao:

```js
for (let i = 0; i < 3; i++) {
  moveForward();
}
```

Exemplo com funcao:

```js
function walk(times) {
  for (let i = 0; i < times; i++) {
    moveForward();
  }
}

walk(4);
```

## Conceitos trabalhados

- Sequencia de instrucoes
- Direcao e movimentacao em grade
- Leitura de objetivo e planejamento de rota
- Espinhos e rotas seguras
- Chaves, portas, baus e inimigos
- Variaveis com `let`, `const` e `var`
- Operadores aritmeticos, logicos e de comparacao
- Condicionais com `if`, `else if` e `else`
- Leitura do ambiente com `look()`
- Repeticao com `while` e `for`
- Funcoes e reutilizacao de codigo
- Depuracao com `print()`

## Estrutura do projeto

```text
.
|-- public/
|   `-- assets/                 # Sprites, tilesets, UI, personagem e imagens do jogo
|-- src/
|   |-- components/game/         # Componentes da interface do jogo
|   |-- components/ui/           # Componentes visuais reutilizaveis
|   |-- data/levels/             # Definicoes das fases, mundos e helper de grid
|   |-- game/                    # Configuracoes de sprites, tiles e entidades
|   |-- pages/                   # Rotas Next.js
|   |-- styles/                  # Estilos globais
|   |-- types/                   # Tipos compartilhados
|   `-- utils/                   # Parser, executor e geracao de labirinto
|-- package.json
|-- tailwind.config.js
`-- tsconfig.json
```

Arquivos importantes:

- `src/pages/index.tsx`: pagina inicial e modal "Como jogar".
- `src/pages/levels.tsx`: tela de selecao de mundos, fases, previews e trilha de progressao.
- `src/pages/game.tsx`: rota da tela do jogo.
- `src/components/game/GamePage.tsx`: orquestra estado, execucao, progresso, modais e interface principal.
- `src/components/game/DungeonGrid.tsx`: renderiza o mapa jogavel da fase.
- `src/components/game/DocumentationModal.tsx`: ajuda contextual filtrada pelos comandos da fase.
- `src/components/game/CodeEditor.tsx`: editor usado pelo jogador.
- `src/utils/commandParser.ts`: parser para comandos simples.
- `src/utils/commandExecutor.ts`: executor dos comandos simples.
- `src/utils/advancedParser.ts`: parser para recursos avancados da linguagem.
- `src/utils/advancedExecutor.ts`: executor do programa avancado.
- `src/utils/mazeGenerator.ts`: geracao do labirinto procedural.
- `src/data/levels/index.ts`: registro de fases, mundos e fase procedural.
- `src/data/levels/grid.ts`: helper para declarar mapas de fase por caracteres.

## Validacao e testes

O repositorio possui testes para partes do parser e executor avancados em:

```text
src/utils/advancedExecutor.test.ts
```

Atualmente nao ha um script `test` definido no `package.json`.

Validacoes usadas durante desenvolvimento:

```bash
npx tsc --noEmit
npm run build
```

## Deploy

A aplicacao publicada pode ser acessada em:

[https://code-dungeons.vercel.app](https://code-dungeons.vercel.app)
