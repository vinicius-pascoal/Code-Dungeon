# Code Dungeon — MVP

## 1. Visão geral

**Code Dungeon** é um jogo web de puzzle em dungeon onde o jogador controla um personagem escrevendo comandos de programação. O personagem não é controlado diretamente pelo teclado ou mouse; ele executa uma sequência de comandos escrita pelo jogador, como:

```js
moveForward();
turnLeft();
turnRight();
attack();
grabKey();
openDoor();
```

O objetivo do projeto é ensinar lógica de programação de forma visual e interativa, começando por comandos sequenciais e evoluindo futuramente para loops, condicionais, funções e debugging.

---

## 2. Objetivo do MVP

O MVP tem como objetivo validar a mecânica principal do jogo:

> O jogador escreve comandos, executa o código e vê o personagem se mover no mapa em grid.

Nesta primeira versão, o foco será em comandos diretos e sequenciais. Conceitos mais avançados, como `for`, `if`, `while` e funções criadas pelo jogador, ficam para versões posteriores.

---

## 3. Público-alvo

O projeto é voltado para:

- iniciantes em programação;
- estudantes aprendendo lógica;
- pessoas que gostam de jogos de puzzle;
- jogadores interessados em aprender programação de forma prática;
- professores que desejam usar uma ferramenta visual para ensinar conceitos básicos.

---

## 4. Conceito principal

O jogador visualiza uma fase em formato de grid. Cada célula pode conter chão, parede, espinhos, inimigo, chave, porta, baú ou saída.

O jogador escreve uma sequência de comandos no editor de código e pressiona o botão **Executar**.

O personagem executa os comandos um por um, com feedback visual e mensagens no console.

Se a sequência estiver correta, o personagem chega ao objetivo da fase. Se houver erro, a execução para e o jogo informa o motivo.

---

## 5. Mecânica central

### 5.1. Fluxo básico

1. O jogador escolhe uma fase.
2. A fase carrega o mapa, personagem e objetivo.
3. O jogador escreve comandos no editor.
4. O jogador clica em **Executar**.
5. O sistema interpreta os comandos.
6. O personagem executa cada ação em sequência.
7. O jogo valida vitória ou erro.
8. O jogador pode resetar e tentar novamente.

---

## 6. Comandos do MVP

O MVP deve suportar inicialmente os seguintes comandos:

```js
moveForward();
turnLeft();
turnRight();
attack();
grabKey();
openDoor();
openChest();
```

Além disso, o sistema evoluiu para incluir sensores e saída de debug:

```js
look();   // retorna uma string com o tipo do tile à frente: 'FLOOR', 'WALL', 'ENEMY', 'OUT_OF_BOUNDS'
print(x); // imprime valores no Console do jogo (aceita expressões e chamadas a look())
```

Observações:
- `look()` retorna strings normalizadas (trim + UPPERCASE) para evitar falsos negativos em comparações.
- O executor avançado aceita expressões como `print(look() == 'WALL')` e estruturas `if/while/for`.

### 6.1. `moveForward()`

Move o personagem uma célula para frente, considerando a direção atual.

Falha se:

- houver uma parede à frente;
- houver uma porta fechada à frente;
- a próxima célula estiver fora do mapa;
- a próxima célula for um espinho.

---

### 6.2. `turnLeft()`

Gira o personagem 90 graus para a esquerda.

Exemplo:

```txt
UP -> LEFT -> DOWN -> RIGHT -> UP
```

---

### 6.3. `turnRight()`

Gira o personagem 90 graus para a direita.

Exemplo:

```txt
UP -> RIGHT -> DOWN -> LEFT -> UP
```

---

### 6.4. `attack()`

Ataca a célula à frente do personagem.

Funciona se houver um inimigo na célula à frente.

Falha se:

- não houver inimigo à frente;
- houver parede;
- houver porta;
- houver baú ou outro objeto não atacável.

---

### 6.5. `grabKey()`

Coleta uma chave se o personagem estiver sobre uma célula com chave.

Falha se:

- não houver chave na posição atual.

---

### 6.6. `openDoor()`

Abre uma porta na célula à frente do personagem.

Funciona se:

- houver uma porta à frente;
- o jogador possuir pelo menos uma chave.

Falha se:

- não houver porta à frente;
- o jogador não possuir chave.

---

### 6.7. `openChest()`

Abre um baú próximo ao personagem.

Para o MVP, a regra recomendada é:

> O baú deve estar na célula à frente do personagem.

Falha se:

- não houver baú à frente;
- o baú já estiver aberto.

---

## 7. Conceitos de programação trabalhados no MVP

O MVP deve trabalhar principalmente:

- sequência de comandos;
- ordem de execução;
- pensamento algorítmico;
- causa e efeito;
- debugging básico;
- leitura de erro;
- planejamento antes da execução.

Conceitos avançados ficam para versões futuras:

- loops;
- condicionais;
- funções;
- variáveis;
- sensores de ambiente;
- validação automática de algoritmos mais complexos.

---

## 8. Stack sugerida

### 8.1. Frontend

- React
- TypeScript
- Tailwind CSS
- Vite
- Zustand
- CodeMirror ou Monaco Editor

### 8.2. Persistência local

- LocalStorage

### 8.3. Futuramente

- Next.js
- Prisma
- PostgreSQL
- Docker
- API backend para progresso do usuário
- ranking online

---

## 9. Recomendação técnica para o MVP

Para o MVP, recomenda-se **não usar Phaser inicialmente**.

O grid pode ser renderizado diretamente com React e CSS Grid. Isso reduz a complexidade inicial e facilita a implementação da lógica de estado, comandos e validações.

Phaser pode entrar em uma versão futura, quando o projeto precisar de:

- animações mais avançadas;
- efeitos visuais;
- partículas;
- sons;
- movimentação mais fluida;
- transições de fase mais elaboradas.

---

## 10. Estrutura visual da aplicação

A tela principal do jogo deve ser dividida em quatro áreas:

```txt
+----------------------------------------------------------+
| Header: Code Dungeon | Fase atual | Resetar | Executar   |
+------------------------------+---------------------------+
|                              |                           |
|          MAPA GRID           |      EDITOR DE CÓDIGO     |
|                              |                           |
+------------------------------+---------------------------+
| Console de execução e mensagens de erro                  |
+----------------------------------------------------------+
```

---

## 11. Telas do MVP

### 11.1. Tela inicial

Deve conter:

- nome do jogo;
- frase curta de apresentação;
- botão **Jogar**;
- botão **Como jogar**;
- botão **Fases**.

Texto sugerido:

```txt
Explore dungeons by writing code.
```

---

### 11.2. Tela de seleção de fases

Deve conter:

- lista de fases disponíveis;
- nome da fase;
- número da fase;
- estrelas obtidas;
- status bloqueada/desbloqueada.

No MVP, as fases podem começar todas desbloqueadas para facilitar testes.

---

### 11.3. Tela do jogo

Deve conter:

- mapa em grid;
- personagem;
- direção atual do personagem;
- editor de código;
- comandos disponíveis;
- objetivo da fase;
- botão executar;
- botão resetar;
- botão voltar para fases;
- console de mensagens.

---

### 11.4. Modal de vitória

Deve conter:

- mensagem de sucesso;
- estrelas obtidas;
- quantidade de comandos usados;
- botão repetir fase;
- botão próxima fase;
- botão voltar para seleção de fases.

---

### 11.5. Modal ou painel de erro

Deve mostrar:

- comando que causou erro;
- motivo do erro;
- sugestão simples.

Exemplo:

```txt
Erro no comando 3: moveForward()
O personagem tentou andar contra uma parede.
Tente virar antes de avançar.
```

---

## 12. Tipos de célula

```ts
type TileType =
  | "FLOOR"
  | "WALL"
  | "SPIKE"
  | "DOOR"
  | "OPEN_DOOR"
  | "CHEST"
  | "OPEN_CHEST"
  | "KEY"
  | "EXIT";
```

---

## 13. Tipos de entidade

```ts
type EntityType =
  | "PLAYER"
  | "ENEMY";
```

---

## 14. Direções do personagem

```ts
type Direction = "UP" | "RIGHT" | "DOWN" | "LEFT";
```

---

## 15. Estado do jogador

```ts
type PlayerState = {
  x: number;
  y: number;
  direction: Direction;
  keys: number;
  openedChests: number;
};
```

---

## 16. Estrutura de uma fase

```ts
type Level = {
  id: number;
  name: string;
  description: string;
  objective: string;
  availableCommands: CommandName[];
  playerStart: PlayerState;
  grid: TileType[][];
  enemies: Enemy[];
  starRules: StarRules;
};
```

---

## 17. Exemplo de fase

```ts
export const levelOne: Level = {
  id: 1,
  name: "Primeiros Passos",
  description: "Aprenda a mover o personagem para frente.",
  objective: "Chegue até a saída.",
  availableCommands: ["moveForward"],
  playerStart: {
    x: 1,
    y: 1,
    direction: "RIGHT",
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ["WALL", "WALL", "WALL", "WALL", "WALL"],
    ["WALL", "FLOOR", "FLOOR", "EXIT", "WALL"],
    ["WALL", "WALL", "WALL", "WALL", "WALL"],
  ],
  enemies: [],
  starRules: {
    threeStars: 2,
    twoStars: 3,
  },
};
```

---

## 18. Sistema de execução de comandos

O jogo deve transformar o texto escrito pelo jogador em uma lista de comandos válidos.

Exemplo de entrada:

```js
moveForward();
turnRight();
moveForward();
attack();
```

Resultado esperado:

```ts
[
  "moveForward",
  "turnRight",
  "moveForward",
  "attack"
]
```

---

## 19. Validação de comandos

O MVP não precisa executar JavaScript real.

A abordagem recomendada é criar um parser simples que aceite apenas os comandos cadastrados.

Comandos inválidos devem gerar erro.

Exemplo:

```js
move();
```

Mensagem:

```txt
Comando inválido: move()
Você quis dizer moveForward()?
```

---

## 20. Regras de erro

A execução deve parar quando ocorrer qualquer erro.

Erros possíveis:

- comando desconhecido;
- tentativa de andar contra parede;
- tentativa de andar para fora do mapa;
- tentativa de pisar em espinhos;
- tentativa de atacar sem inimigo;
- tentativa de pegar chave onde não existe chave;
- tentativa de abrir porta sem chave;
- tentativa de abrir porta onde não existe porta;
- tentativa de abrir baú onde não existe baú.

---

## 21. Condição de vitória

O jogador vence a fase quando o personagem chega na célula `EXIT`.

Regra recomendada:

> A vitória deve ser verificada após cada comando executado.

Assim, se o personagem alcançar a saída antes de todos os comandos terminarem, a fase pode ser concluída imediatamente.

---

## 22. Sistema de estrelas

Cada fase deve ter uma regra simples baseada na quantidade de comandos usados.

Exemplo:

```ts
type StarRules = {
  threeStars: number;
  twoStars: number;
};
```

Exemplo prático:

```txt
3 estrelas: até 5 comandos
2 estrelas: até 8 comandos
1 estrela: acima de 8 comandos
```

---

## 23. Persistência no MVP

O progresso pode ser salvo no LocalStorage.

Deve salvar:

- fases concluídas;
- melhor quantidade de estrelas por fase;
- menor quantidade de comandos usada por fase.

Exemplo:

```ts
type UserProgress = {
  completedLevels: number[];
  levelStars: Record<number, number>;
  bestCommandCount: Record<number, number>;
};
```

---

## 24. Primeiras fases do MVP

O MVP deve ter pelo menos 10 fases.

---

### Fase 1 — Primeiros Passos

Objetivo: chegar até a saída andando para frente.

Comando ensinado:

```js
moveForward();
```

---

### Fase 2 — Virando à Direita

Objetivo: chegar até a saída fazendo uma curva para a direita.

Comandos usados:

```js
moveForward();
turnRight();
```

---

### Fase 3 — Virando à Esquerda

Objetivo: chegar até a saída fazendo uma curva para a esquerda.

Comandos usados:

```js
moveForward();
turnLeft();
```

---

### Fase 4 — Caminho com Paredes

Objetivo: evitar bater nas paredes.

Conceito trabalhado:

- planejamento de rota;
- ordem dos comandos;
- debugging básico.

---

### Fase 5 — Espinhos

Objetivo: evitar células perigosas.

Novo elemento:

```txt
SPIKE
```

Mensagem de erro sugerida:

```txt
Você pisou em espinhos. Revise o caminho antes de executar.
```

---

### Fase 6 — Primeiro Inimigo

Objetivo: derrotar um inimigo bloqueando o caminho.

Novo comando:

```js
attack();
```

---

### Fase 7 — Chave e Porta

Objetivo: pegar uma chave e abrir uma porta.

Novos comandos:

```js
grabKey();
openDoor();
```

---

### Fase 8 — Baú Opcional

Objetivo: chegar até a saída. Abrir o baú concede bônus.

Novo comando:

```js
openChest();
```

---

### Fase 9 — Caminho Longo

Objetivo: resolver uma fase maior usando sequência de comandos.

Conceito trabalhado:

- decomposição do problema;
- organização da sequência;
- preparação para loops.

---

### Fase 10 — Desafio Final do MVP

Objetivo: combinar tudo que foi aprendido.

Elementos presentes:

- paredes;
- espinhos;
- inimigo;
- chave;
- porta;
- saída.

Comandos disponíveis:

```js
moveForward();
turnLeft();
turnRight();
attack();
grabKey();
openDoor();
openChest();
```

---

## 25. Componentes principais

### 25.1. `GamePage`

Tela principal da fase.

Responsável por:

- carregar fase atual;
- exibir grid;
- exibir editor;
- executar comandos;
- controlar reset;
- exibir console.

---

### 25.2. `DungeonGrid`

Renderiza o mapa.

Responsável por:

- desenhar células;
- exibir personagem;
- exibir inimigos;
- exibir objetos;
- destacar posição atual.

---

### 25.3. `CodeEditor`

Editor onde o jogador escreve comandos.

Responsável por:

- capturar código;
- aplicar highlight;
- exibir comandos disponíveis;
- enviar código para execução.

---

### 25.4. `ExecutionConsole`

Mostra mensagens de execução.

Exemplos:

```txt
Comando 1 executado: moveForward()
Comando 2 executado: turnRight()
Erro no comando 3: parede à frente.
```

---

### 25.5. `LevelSelectPage`

Tela de seleção de fases.

Responsável por:

- listar fases;
- mostrar estrelas;
- indicar progresso;
- iniciar fase selecionada.

---

### 25.6. `VictoryModal`

Modal exibido ao concluir uma fase.

Responsável por:

- mostrar sucesso;
- mostrar estrelas;
- permitir avançar;
- permitir repetir.

---

## 26. Serviços e utilitários

### 26.1. `commandParser`

Responsável por transformar texto em comandos.

Entrada:

```js
moveForward();
turnRight();
```

Saída:

```ts
["moveForward", "turnRight"]
```

---

### 26.2. `commandExecutor`

Responsável por executar comandos sobre o estado da fase.

Funções esperadas:

```ts
executeCommand(command, gameState): ExecutionResult;
executeCommands(commands, gameState): ExecutionResult[];
```

---

### 26.3. `levelValidator`

Responsável por verificar:

- se venceu;
- se perdeu;
- se caiu em armadilha;
- se fez movimento inválido.

---

### 26.4. `starCalculator`

Responsável por calcular as estrelas da fase.

---

### 26.5. `progressStorage`

Responsável por salvar e recuperar progresso do LocalStorage.

---

## 27. Estrutura de pastas sugerida

```txt
src/
  app/
    App.tsx
    routes.tsx
  components/
    game/
      DungeonGrid.tsx
      DungeonCell.tsx
      PlayerSprite.tsx
      EnemySprite.tsx
      CodeEditor.tsx
      ExecutionConsole.tsx
      VictoryModal.tsx
    layout/
      Header.tsx
      Button.tsx
      Card.tsx
  data/
    levels/
      level-01.ts
      level-02.ts
      level-03.ts
      level-04.ts
      level-05.ts
      level-06.ts
      level-07.ts
      level-08.ts
      level-09.ts
      level-10.ts
    levels.ts
  pages/
    HomePage.tsx
    LevelSelectPage.tsx
    GamePage.tsx
  store/
    gameStore.ts
    progressStore.ts
  types/
    game.ts
    level.ts
    command.ts
  utils/
    commandParser.ts
    commandExecutor.ts
    gridUtils.ts
    starCalculator.ts
    progressStorage.ts
  styles/
    globals.css
```

---

## 28. Identidade visual

### 28.1. Estilo recomendado

**Dungeon Pixel Minimalista**

Características:

- visual escuro;
- tiles simples;
- grid bem legível;
- personagens pequenos;
- destaque visual para comandos e erros;
- estética de dungeon retrô com interface moderna.

---

### 28.2. Paleta de cores

```txt
Background principal: #0F172A
Painéis: #111827
Chão da dungeon: #1E293B
Parede: #334155
Borda: #475569
Texto principal: #F8FAFC
Texto secundário: #CBD5E1
Destaque mágico: #38BDF8
Perigo: #EF4444
Sucesso: #22C55E
Tesouro: #FACC15
Porta/madeira: #92400E
```

---

## 29. Feedback visual

O jogo deve mostrar claramente o que está acontecendo.

### Exemplos de feedback

- personagem anima ao andar;
- personagem gira ao usar `turnLeft()` ou `turnRight()`;
- célula atual recebe destaque;
- inimigo desaparece ao ser derrotado;
- porta muda para aberta;
- chave desaparece ao ser coletada;
- erro destaca a célula problemática;
- vitória mostra brilho na saída.

---

## 30. Feedback textual

O console deve ajudar o jogador a entender a execução.

Exemplo:

```txt
Executando comandos...
1. moveForward() executado com sucesso.
2. turnRight() executado com sucesso.
3. moveForward() falhou: existe uma parede à frente.
Execução interrompida.
```

---

## 31. Restrições do MVP

O MVP não precisa ter:

- login;
- backend;
- ranking online;
- multiplayer;
- Phaser;
- sons;
- editor de fases;
- loops reais;
- condicionais reais;
- funções criadas pelo jogador;
- banco de dados;
- sistema de conta de usuário.

---

## 32. Fora do escopo inicial

As seguintes funcionalidades devem ficar para versões futuras:

- suporte completo a JavaScript;
- interpretação segura de código real;
- sistema de mundos;
- editor de mapas;
- criação de fases pela comunidade;
- ranking;
- conquistas;
- skins;
- cutscenes;
- modo professor;
- exportação de progresso;
- backend com autenticação.

---

## 33. Roadmap pós-MVP

### Versão 0.2 — Loops

Adicionar suporte a:

```js
for (let i = 0; i < 3; i++) {
  moveForward();
}
```

Objetivo:

- ensinar repetição;
- reduzir comandos repetidos;
- pontuar soluções otimizadas.

---

### Versão 0.3 — Condicionais

Adicionar comandos de leitura do ambiente:

```js
isEnemyAhead();
isWallAhead();
isDoorAhead();
hasKey();
```

Exemplo:

```js
if (isEnemyAhead()) {
  attack();
}
```

---

### Versão 0.4 — Funções

Permitir que o jogador crie funções simples.

Exemplo:

```js
function walkThreeSteps() {
  moveForward();
  moveForward();
  moveForward();
}

walkThreeSteps();
```

---

### Versão 0.5 — Sistema de mundos

Criar mundos temáticos:

- Mundo 1: Sequência de comandos;
- Mundo 2: Interações;
- Mundo 3: Loops;
- Mundo 4: Condicionais;
- Mundo 5: Funções;
- Mundo 6: Debugging.

---

### Versão 1.0 — Produto completo

Funcionalidades esperadas:

- conta de usuário;
- progresso salvo em backend;
- ranking;
- editor de fases;
- compartilhamento de fases;
- sistema de conquistas;
- trilha educacional completa.

---

## 34. Critérios de aceite do MVP

O MVP será considerado concluído quando:

- o jogador conseguir abrir a tela inicial;
- o jogador conseguir selecionar uma fase;
- o mapa em grid for exibido corretamente;
- o personagem aparecer na posição inicial correta;
- o personagem possuir uma direção visível;
- o jogador conseguir escrever comandos no editor;
- o botão executar interpretar comandos válidos;
- comandos inválidos exibirem erro;
- o personagem executar comandos em sequência;
- paredes bloquearem movimento;
- espinhos causarem erro;
- inimigos puderem ser derrotados com `attack()`;
- chaves puderem ser coletadas com `grabKey()`;
- portas puderem ser abertas com `openDoor()`;
- baús puderem ser abertos com `openChest()`;
- a fase for concluída ao chegar na saída;
- estrelas forem calculadas ao vencer;
- progresso for salvo no LocalStorage;
- o jogador conseguir resetar a fase;
- existirem pelo menos 10 fases jogáveis.

---

## 35. Nome e descrição do projeto

### Nome

```txt
Code Dungeon
```

### Frase curta

```txt
Explore dungeons by writing code.
```

### Descrição curta

```txt
Code Dungeon é um jogo web de puzzle onde o jogador controla um aventureiro escrevendo comandos de programação para explorar masmorras, derrotar inimigos, abrir portas e resolver desafios lógicos.
```

### Descrição para README

```md
Code Dungeon is a web-based programming puzzle game where players control a dungeon adventurer by writing code commands. Each level introduces programming concepts such as command sequencing, debugging, loops, conditionals and functions through interactive grid-based challenges.
```

---

## 36. Resumo do MVP

O MVP de **Code Dungeon** deve entregar uma experiência simples, funcional e divertida onde o jogador escreve comandos para controlar um personagem em uma dungeon.

A prioridade é validar a mecânica principal:

- escrever comandos;
- executar comandos;
- mover personagem;
- resolver fases;
- receber feedback visual e textual.

Com essa base pronta, o projeto poderá evoluir naturalmente para um jogo educacional completo de programação.
