# Code Dungeon - Prompts de Assets

Guia de prompts para gerar os assets visuais do jogo. A direção sugerida abaixo mantém consistência com a UI atual: dungeon escura, leitura clara, contraste alto e estética moderna de jogo educativo.

## Direção visual

- Estilo: 2D top-down, dungeon fantasy, legível, limpo, com leve toque pixel art moderno.
- Paleta: azul escuro, cinza pedra, dourado, vermelho de perigo, verde de vitória, roxo/azul mágico.
- Fundo: preferir fundo transparente para sprites, ícones e tiles isolados.
- Proporção: sprites quadrados para tiles e ícones; personagens com versão frontal/top-down consistente.
- Regras: evitar excesso de detalhes, sombras pesadas demais ou elementos que prejudiquem a leitura no grid.

## Prompt base comum

Use este trecho no início dos prompts quando quiser manter tudo no mesmo estilo:

```text
Create a clean 2D top-down dungeon game asset for an educational coding game, with high readability, modern pixel-art style, dark fantasy mood, crisp edges, strong silhouette, transparent background, game-ready, no text, no watermark, no UI frame.
```

## 1. Player sprite

### Prompt principal

```text
Create a top-down player character sprite for a dungeon coding game, a small brave adventurer wearing a simple hooded cloak and light armor, friendly but determined expression, readable silhouette, clean pixel art, dark blue and teal palette with a magic accent, transparent background, centered composition, game-ready.
```

### Variações por direção

```text
Create four directional frames for the same top-down player character: up, right, down and left. Keep the outfit consistent in every direction, with subtle animation-ready poses, transparent background, clean pixel art, game-ready.
```

### Animação opcional

```text
Create a simple walk animation sheet for a top-down dungeon adventurer, 4 to 6 frames, readable foot movement, minimal motion blur, consistent proportions, transparent background, pixel art, game-ready.
```

## 2. Enemy sprite

### Prompt principal

```text
Create a top-down enemy sprite for a dungeon game, a hostile monster with an intimidating but readable silhouette, one horned goblin-like creature with glowing eyes and rugged armor scraps, dark red and charcoal palette, transparent background, clean pixel art, game-ready.
```

### Variações de inimigo

```text
Create three distinct enemy sprites for a dungeon coding game: a goblin brute, a bat-like cave creature, and a small armored dungeon guard. All should be top-down, clearly readable on a small grid, transparent background, consistent pixel art style.
```

## 3. Tiles do mapa

### Chão

```text
Create a seamless top-down dungeon floor tile, cracked stone with subtle variation, dark slate tones, clean edges, tileable, seamless, game-ready, no border, no text.
```

### Parede

```text
Create a seamless top-down dungeon wall tile made of stacked stone blocks, darker than the floor, slightly beveled edges, readable from a small grid, tileable, seamless, game-ready.
```

### Saída

```text
Create a top-down exit tile for a dungeon puzzle game, glowing portal or staircase with a soft green victory glow, readable at small size, transparent background, game-ready, no text.
```

### Espinhos

```text
Create a top-down spike trap tile for a dungeon puzzle game, sharp metal or bone spikes emerging from the floor, red danger accent, high readability, transparent background, game-ready.
```

### Porta fechada

```text
Create a top-down closed dungeon door tile made of wood and iron, sturdy, blocked state, readable on a small grid, transparent background, game-ready.
```

### Porta aberta

```text
Create a top-down open dungeon door tile, same style as the closed door but visibly opened and passable, slightly dimmed, transparent background, game-ready.
```

## 4. Itens e objetos

### Chave

```text
Create a top-down golden key icon for a dungeon game, bright and readable, slight magical shine, transparent background, game-ready.
```

### Baú fechado

```text
Create a top-down treasure chest tile for a dungeon game, wooden chest with metal bands, closed and loot-ready, readable on a grid, transparent background, game-ready.
```

### Baú aberto

```text
Create a top-down opened treasure chest tile for a dungeon game, lid open with faint glow inside, same perspective as the closed chest, transparent background, game-ready.
```

### Coletável genérico opcional

```text
Create a top-down collectible gem icon for a dungeon coding game, magical crystal with a bright treasure glow, transparent background, clean pixel art, game-ready.
```

## 5. Ícones da legenda e HUD

```text
Create a set of minimal UI icons for a dungeon coding game: floor, wall, spike, key, door, open door, chest, open chest, exit, player, enemy. Use a consistent line style, simple shapes, strong readability at 16x16 and 24x24, transparent background, modern game UI style.
```

### Ícones de comandos

```text
Create a compact set of coding command icons for a game UI: move forward, turn left, turn right, attack, grab key, open door, open chest. Use a clean minimal style, readable at small size, matching a dungeon-themed educational interface, transparent background.
```

## 6. Logo e identidade

```text
Create a logo for a game called Code Dungeon, combining coding and dungeon exploration themes, with a small dungeon gate, a code bracket or cursor shape, and a bold readable title mark. Make it modern, playful, and suitable for a dark themed educational game, transparent background.
```

## 7. Background e ilustrações de apoio

```text
Create a subtle dungeon background illustration for a coding puzzle game, dark stone walls, faint torches, magical ambient glow, low detail so it does not compete with the grid, seamless or large format, game-ready.
```

```text
Create a loading screen illustration for a dungeon coding game, a brave adventurer standing in front of a glowing dungeon entrance with code symbols floating around, dramatic but readable, modern pixel art, game-ready.
```

## 8. Negativo recomendado

Use este trecho quando a ferramenta aceitar negative prompt:

```text
blurry, low resolution, noisy, overly complex, photorealistic, text, watermark, logo, UI frame, extra limbs, distorted perspective, cropped, cluttered background, unreadable, oversaturated
```

## 9. Sugestão de entrega dos arquivos

- Sprites de personagens: PNG com fundo transparente.
- Tiles: PNG individual ou atlas de tiles.
- Ícones: SVG ou PNG quadrado em tamanho pequeno.
- Logo: SVG, PNG ou ambos.
- Ilustrações: PNG em alta resolução.

## 10. Ordem de produção sugerida

1. Tiles principais do mapa.
2. Player e enemy sprites.
3. Itens interativos.
4. Ícones da legenda e comandos.
5. Logo e telas de apoio.
