# Code Dungeon - Prompts de Assets

Guia de prompts para gerar os assets visuais do jogo. A direção sugerida abaixo mantém consistência com a UI atual: dungeon escura, leitura clara, contraste alto e estética moderna de jogo educativo.

## Direção visual

- Estilo: 2D top-down, dungeon fantasy, legível, limpo, com leve toque pixel art moderno.
- Paleta: azul escuro, cinza pedra, dourado, vermelho de perigo, verde de vitória, roxo/azul mágico.
- Fundo: preferir fundo transparente para sprites, ícones e tiles isolados.
- Proporção: sprites quadrados para tiles e ícones; personagens com versão frontal/top-down consistente.
- Regras: evitar excesso de detalhes, sombras pesadas demais ou elementos que prejudiquem a leitura no grid.

## Paleta oficial (HEX)

Use estes valores para manter o mesmo padrão visual do projeto:

- Fundo geral: #0F172A
- Painel escuro: #111827
- Chão: #1E293B
- Parede: #334155
- Borda: #475569
- Texto principal: #E2E8F0
- Texto secundário: #94A3B8
- Mágico/ação: #3B82F6
- Perigo/inimigo: #EF4444
- Vitória/saída: #22C55E
- Tesouro/chave/baú: #F59E0B
- Madeira/porta: #92400E

## Snippet de cor padrão

Adicione este trecho em qualquer prompt para forçar consistência:

```text
Use this exact color palette only: #0F172A, #111827, #1E293B, #334155, #475569, #E2E8F0, #94A3B8, #3B82F6, #EF4444, #22C55E, #F59E0B, #92400E.
```

## Prompt base comum

Use este trecho no início dos prompts quando quiser manter tudo no mesmo estilo:

```text
Create a clean 2D top-down dungeon game asset for an educational coding game, with high readability, modern pixel-art style, dark fantasy mood, crisp edges, strong silhouette, transparent background, game-ready, no text, no watermark, no UI frame. Use this exact color palette only: #0F172A, #111827, #1E293B, #334155, #475569, #E2E8F0, #94A3B8, #3B82F6, #EF4444, #22C55E, #F59E0B, #92400E.
```

## 1. Player sprite

### Prompt principal

```text
Create a top-down player character sprite for a dungeon coding game, a small brave adventurer wearing a simple hooded cloak and light armor, friendly but determined expression, readable silhouette, clean pixel art, transparent background, centered composition, game-ready. Main colors: cloak #1E293B, armor #475569, skin highlights #E2E8F0, magic accent #3B82F6, deep shadows #111827.
```

### Variações por direção

```text
Create four directional frames for the same top-down player character: up, right, down and left. Keep the outfit consistent in every direction, with subtle animation-ready poses, transparent background, clean pixel art, game-ready. Keep identical palette across all directions: #1E293B, #475569, #E2E8F0, #3B82F6, #111827.
```

### Animação opcional

```text
Create a simple walk animation sheet for a top-down dungeon adventurer, 4 to 6 frames, readable foot movement, minimal motion blur, consistent proportions, transparent background, pixel art, game-ready. Use fixed colors per frame: #1E293B, #475569, #E2E8F0, #3B82F6, #111827.
```

## 2. Enemy sprite

### Prompt principal

```text
Create a top-down enemy sprite for a dungeon game, a hostile monster with an intimidating but readable silhouette, one horned goblin-like creature with glowing eyes and rugged armor scraps, transparent background, clean pixel art, game-ready. Main colors: body #334155 and #111827, danger accents #EF4444, eye glow #EF4444, edge highlights #E2E8F0.
```

### Variações de inimigo

```text
Create three distinct enemy sprites for a dungeon coding game: a goblin brute, a bat-like cave creature, and a small armored dungeon guard. All should be top-down, clearly readable on a small grid, transparent background, consistent pixel art style. Restrict enemy palette to #111827, #334155, #475569, #EF4444, #E2E8F0.
```

## 3. Tiles do mapa

### Chão

```text
Create a seamless top-down dungeon floor tile, cracked stone with subtle variation, clean edges, tileable, seamless, game-ready, no border, no text. Base color #1E293B, variation shades #111827 and #334155, tiny highlight details #475569.
```

### Parede

```text
Create a seamless top-down dungeon wall tile made of stacked stone blocks, darker than the floor, slightly beveled edges, readable from a small grid, tileable, seamless, game-ready. Base color #334155, shadow #111827, bevel highlights #475569.
```

### Saída

```text
Create a top-down exit tile for a dungeon puzzle game, glowing portal or staircase with a soft green victory glow, readable at small size, transparent background, game-ready, no text. Use victory green #22C55E as primary glow, secondary glow #86EFAC, stone base #1E293B and #334155.
```

### Espinhos

```text
Create a top-down spike trap tile for a dungeon puzzle game, sharp metal or bone spikes emerging from the floor, high readability, transparent background, game-ready. Spike colors #E2E8F0 and #475569, danger accents and glow #EF4444, floor fragments #1E293B.
```

### Porta fechada

```text
Create a top-down closed dungeon door tile made of wood and iron, sturdy, blocked state, readable on a small grid, transparent background, game-ready. Wood tones #92400E and #B45309, iron bands #475569 and #334155, shadow #111827.
```

### Porta aberta

```text
Create a top-down open dungeon door tile, same style as the closed door but visibly opened and passable, slightly dimmed, transparent background, game-ready. Keep wood #92400E and #B45309, iron #475569, reduce opacity feel with darker shade #111827.
```

## 4. Itens e objetos

### Chave

```text
Create a top-down golden key icon for a dungeon game, bright and readable, slight magical shine, transparent background, game-ready. Primary gold #F59E0B, highlight #FCD34D, shadow #92400E, sparkle accent #E2E8F0.
```

### Baú fechado

```text
Create a top-down treasure chest tile for a dungeon game, wooden chest with metal bands, closed and loot-ready, readable on a grid, transparent background, game-ready. Wood #92400E and #B45309, metal #475569, treasure accent #F59E0B, shadow #111827.
```

### Baú aberto

```text
Create a top-down opened treasure chest tile for a dungeon game, lid open with faint glow inside, same perspective as the closed chest, transparent background, game-ready. Wood #92400E and #B45309, metal #475569, inner glow #F59E0B and #FCD34D, shadow #111827.
```

### Coletável genérico opcional

```text
Create a top-down collectible gem icon for a dungeon coding game, magical crystal with a bright treasure glow, transparent background, clean pixel art, game-ready. Gem core #3B82F6, glow #93C5FD, treasure edge accent #F59E0B, dark outline #111827.
```

## 5. Ícones da legenda e HUD

```text
Create a set of minimal UI icons for a dungeon coding game: floor, wall, spike, key, door, open door, chest, open chest, exit, player, enemy. Use a consistent line style, simple shapes, strong readability at 16x16 and 24x24, transparent background, modern game UI style. Use only these semantic colors: neutral #334155 and #475569, action #3B82F6, danger #EF4444, success #22C55E, treasure #F59E0B, light detail #E2E8F0.
```

### Ícones de comandos

```text
Create a compact set of coding command icons for a game UI: move forward, turn left, turn right, attack, grab key, open door, open chest. Use a clean minimal style, readable at small size, matching a dungeon-themed educational interface, transparent background. Color mapping: movement #3B82F6, attack #EF4444, interaction #F59E0B, neutral outlines #475569, highlights #E2E8F0.
```

## 6. Logo e identidade

```text
Create a logo for a game called Code Dungeon, combining coding and dungeon exploration themes, with a small dungeon gate, a code bracket or cursor shape, and a bold readable title mark. Make it modern, playful, and suitable for a dark themed educational game, transparent background. Suggested colors: primary #3B82F6, secondary #1E293B, highlight #F59E0B, text #E2E8F0, shadow #111827.
```

## 7. Background e ilustrações de apoio

```text
Create a subtle dungeon background illustration for a coding puzzle game, dark stone walls, faint torches, magical ambient glow, low detail so it does not compete with the grid, seamless or large format, game-ready. Dominant tones #0F172A, #111827, #1E293B, stone accents #334155, minimal torch light #F59E0B, faint magic glow #3B82F6.
```

```text
Create a loading screen illustration for a dungeon coding game, a brave adventurer standing in front of a glowing dungeon entrance with code symbols floating around, dramatic but readable, modern pixel art, game-ready. Palette focus: background #0F172A and #111827, hero accents #3B82F6, danger details #EF4444, portal glow #22C55E, treasure light #F59E0B, text-safe contrast #E2E8F0.
```

## 8. Negativo recomendado

Use este trecho quando a ferramenta aceitar negative prompt:

```text
blurry, low resolution, noisy, overly complex, photorealistic, text, watermark, logo, UI frame, extra limbs, distorted perspective, cropped, cluttered background, unreadable, oversaturated, neon random colors, palette drift, off-palette tones
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
