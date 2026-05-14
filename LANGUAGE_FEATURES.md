# Suporte Completo de Linguagem - Code Dungeon

Implementação completa de suporte a estruturas de controle de fluxo e variáveis na linguagem do Code Dungeon.

## Funcionalidades Implementadas

### 1. Variáveis
```javascript
let x = 5;
let y = 10;
const z = 15;
var count = 0;
```

### 2. Condicionais (if/else)
```javascript
if (x > 5) {
  moveForward();
} else {
  turnLeft();
}

// else if
if (x == 0) {
  attack();
} else if (x < 3) {
  turnRight();
} else {
  moveForward();
}
```

### 3. Loops

#### While
```javascript
let count = 0;
while (count < 5) {
  moveForward();
  count++;
}
```

#### For
```javascript
for (let i = 0; i < 10; i++) {
  moveForward();
}
```

### 4. Funções
```javascript
function moveAndTurn() {
  moveForward();
  turnRight();
}

function moveNTimes(n) {
  for (let i = 0; i < n; i++) {
    moveForward();
  }
}

// Usar função
moveAndTurn();
moveNTimes(5);
```

### 5. Operadores Matemáticos
- Adição: `+`
- Subtração: `-`
- Multiplicação: `*`
- Divisão: `/`
- Módulo: `%`

### 6. Operadores de Comparação
- Igualdade: `==` ou `!=`
- Maior que: `>` ou `<`
- Maior ou igual: `>=` ou `<=`

### 7. Operadores Lógicos
- AND: `&&`
- OR: `||`
- NOT: `!`

### 8. Incremento/Decremento
```javascript
let x = 5;
x++;  // x = 6
x--;  // x = 5
++x;  // x = 6
--x;  // x = 5
```

### 9. Operadores de Atribuição
```javascript
let x = 10;
x += 5;  // x = 15
x -= 3;  // x = 12
x *= 2;  // x = 24
x /= 4;  // x = 6
```

## Exemplos Práticos

### Exemplo 1: Mover em Espiral
```javascript
function spiral() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j <= i; j++) {
      moveForward();
    }
    turnLeft();
  }
}

spiral();
```

### Exemplo 2: Atacar Inimigos com Condição
```javascript
let remainingMoves = 10;

while (remainingMoves > 0) {
  if (remainingMoves > 5) {
    attack();
  } else {
    moveForward();
  }
  remainingMoves--;
}
```

### Exemplo 3: Coletar Chaves
```javascript
function collectAndMove() {
  let keysCollected = 0;
  
  while (keysCollected < 3) {
    grabKey();
    openDoor();
    moveForward();
    keysCollected++;
  }
}

collectAndMove();
```

### Exemplo 4: Padrão de Movimento Condicional
```javascript
let position = 0;

for (let i = 0; i < 20; i++) {
  if (position % 2 == 0) {
    turnRight();
  } else {
    turnLeft();
  }
  moveForward();
  position++;
}
```

## Autocompletar

O editor agora oferece autocompletar para:
- Comandos: `moveForward`, `turnLeft`, `turnRight`, `attack`, `grabKey`, `openDoor`, `openChest`
- Keywords: `if`, `else`, `while`, `for`, `function`, `var`, `let`, `const`, `return`, `true`, `false`

Ao digitar uma keyword, o editor sugere a estrutura básica:
- `if` → `if (condition) { ... }`
- `while` → `while (condition) { ... }`
- `for` → `for (let i = 0; i < 10; i++) { ... }`
- `function` → `function name() { ... }`

## Notas Importantes

1. **Variáveis**: Sempre inicie com `let`, `const` ou `var`
2. **Blocos**: Sempre use `{ }` para blocos de código em if, while, for e function
3. **Comandos**: Comandos de jogo (moveForward, turnLeft, etc.) ainda precisam de `();`
4. **Persistência**: Seu código é automaticamente salvo em cada alteração, mesmo em caso de erro
5. **Controle de Fluxo**: Loops e condicionais funcionam com os comandos do jogo
6. **Funções**: Defina as funções antes de usá-las no código

## Melhorias Futuras (Roadmap)

- [ ] Arrays/Listas
- [ ] Objetos
- [ ] Métodos string
- [ ] Try/catch para tratamento de erros
- [ ] Switch/case
- [ ] Operador ternário
- [ ] Closures e escopo avançado
