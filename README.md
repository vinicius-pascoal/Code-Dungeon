# Code Dungeon

Code Dungeon é um jogo educativo de lógica e programação em que o jogador resolve fases de masmorra escrevendo comandos em uma linguagem inspirada em JavaScript/TypeScript. Cada script controla um personagem em uma grade, permitindo visualizar a execução passo a passo, testar estratégias e aprender conceitos de programação de forma prática.

## Sumário

- [Resumo do projeto](#resumo-do-projeto)
- [Objetivos](#objetivos)
- [Funcionalidades](#funcionalidades)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Como executar](#como-executar)
- [Scripts disponíveis](#scripts-disponíveis)
- [Rotas da aplicação](#rotas-da-aplicação)
- [Comandos do jogo](#comandos-do-jogo)
- [Conceitos trabalhados](#conceitos-trabalhados)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuição](#contribuição)

## Resumo do projeto

O projeto combina uma interface de jogo com um editor de código. O jogador lê o objetivo da fase, escreve uma sequência de comandos e executa o programa para mover o personagem até a saída. Ao longo das fases, novos recursos são liberados gradualmente, como movimentação, interação com chaves, portas, inimigos e baús, além de estruturas de programação como variáveis, condicionais, loops e funções.

A aplicação possui 19 fases guiadas, organizadas em mundos temáticos, e um modo extra de labirinto procedural. O progresso do código de cada fase é salvo localmente no navegador, facilitando tentativas, ajustes e experimentação.

## Objetivos

- Ensinar lógica de programação com feedback visual imediato.
- Transformar conceitos abstratos em desafios de movimentação e decisão.
- Incentivar leitura de problemas, depuração e melhoria gradual das soluções.
- Oferecer uma base extensível para novas fases, comandos e mecânicas.

## Funcionalidades

- Editor de código integrado à tela do jogo.
- Execução passo a passo dos comandos escritos pelo jogador.
- Sistema de fases com objetivos, comandos disponíveis e regras de estrelas.
- Mundos organizados por tema: fundamentos, interações, loops, condicionais e funções.
- Labirinto procedural disponível pela fase `999`.
- Parser simples para listas diretas de comandos.
- Parser e executor avançados para variáveis, expressões, loops, condicionais e funções.
- Salvamento automático do código no `localStorage`.
- Modais de ajuda, introdução da fase, vitória e erro.
- Assets visuais para personagem, pisos, paredes, espinhos, mundos e portal.

## Tecnologias utilizadas

- [Next.js](https://nextjs.org/) 14
- [React](https://react.dev/) 18
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Node.js e npm

## Como executar

### Pré-requisitos

- Node.js 18 ou superior
- npm

### Instalação

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

### Produção

```bash
npm run build
npm run start
```

## Scripts disponíveis

| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento na porta `3000`. |
| `npm run build` | Gera a versão de produção da aplicação. |
| `npm run start` | Executa a aplicação em modo produção na porta `3000`. |

## Rotas da aplicação

| Rota | Descrição |
| --- | --- |
| `/` | Página inicial com apresentação do jogo e links principais. |
| `/levels` | Lista de fases e mundos disponíveis. |
| `/game` | Tela principal do jogo, iniciando pela fase padrão. |
| `/game?level=1` | Abre uma fase específica pelo ID. |
| `/game?level=999` | Abre o modo de labirinto procedural. |

Não há rotas de API em `pages/api` neste repositório.

## Comandos do jogo

| Comando | Função |
| --- | --- |
| `moveForward()` | Move o personagem uma célula à frente. |
| `turnLeft()` | Gira o personagem 90 graus para a esquerda. |
| `turnRight()` | Gira o personagem 90 graus para a direita. |
| `attack()` | Ataca um inimigo na célula à frente. |
| `grabKey()` | Coleta uma chave na célula atual. |
| `openDoor()` | Abre uma porta à frente quando o jogador possui chave. |
| `openChest()` | Abre um baú à frente. |
| `look()` | Inspeciona a célula à frente e retorna valores como `WALL`, `FLOOR`, `ENEMY` ou `OUT_OF_BOUNDS`. |
| `print(value)` | Envia valores e expressões para o console do jogo. |

Exemplo simples:

```js
moveForward();
moveForward();
turnRight();
moveForward();
```

Exemplo com repetição:

```js
for (let i = 0; i < 3; i++) {
  moveForward();
}
turnRight();
moveForward();
```

## Conceitos trabalhados

- Sequência de instruções
- Direção e movimentação em grade
- Leitura de objetivo e planejamento de rota
- Variáveis com `let`, `const` e `var`
- Operadores aritméticos, lógicos e de comparação
- Condicionais com `if`, `else if` e `else`
- Repetição com `while` e `for`
- Funções e reutilização de código
- Depuração com `look()` e `print()`

## Estrutura do projeto

```text
.
├── public/
│   └── assets/                 # Sprites, tiles, mundos e imagens do jogo
├── src/
│   ├── components/game/         # Componentes da interface do jogo
│   ├── data/levels/             # Definições das fases e mundos
│   ├── pages/                   # Rotas Next.js
│   ├── styles/                  # Estilos globais
│   ├── types/                   # Tipos compartilhados
│   └── utils/                   # Parser, executor e geração de labirinto
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

Arquivos importantes:

- `src/pages/index.tsx`: página inicial.
- `src/pages/levels.tsx`: tela de seleção de fases.
- `src/pages/game.tsx`: rota da tela do jogo.
- `src/components/game/GamePage.tsx`: orquestra estado, execução, progresso e interface principal.
- `src/components/game/DungeonGrid.tsx`: renderiza o mapa da fase.
- `src/components/game/CodeEditor.tsx`: editor usado pelo jogador.
- `src/utils/commandParser.ts`: parser para comandos simples.
- `src/utils/commandExecutor.ts`: executor dos comandos simples.
- `src/utils/advancedParser.ts`: parser para recursos avançados da linguagem.
- `src/utils/advancedExecutor.ts`: executor do programa avançado.
- `src/utils/mazeGenerator.ts`: geração do labirinto procedural.
- `src/data/levels/index.ts`: registro de fases, mundos e fase procedural.

## Testes

O repositório possui testes para partes do parser e executor avançados em:

```text
src/utils/advancedExecutor.test.ts
```

Atualmente não há um script `test` definido no `package.json`.

## Deploy

A aplicação publicada pode ser acessada em:

[https://code-dungeons.vercel.app](https://code-dungeons.vercel.app)

## Contribuição

Contribuições são bem-vindas. Para colaborar:

1. Abra uma issue ou descreva claramente a melhoria desejada.
2. Crie uma branch para a alteração.
3. Faça commits pequenos e objetivos.
4. Adicione testes quando a mudança envolver parser, executor ou regras de jogo.
5. Abra um pull request explicando o problema resolvido e como validar a alteração.

## Licença

Este repositório não informa uma licença no momento.
