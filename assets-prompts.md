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

## 11. Prompts para assets dos mundos

Use estes prompts para gerar novas artes dos cards de mundo. A prioridade e combinar com o estilo real do projeto: dungeon top-down 1-bit, tiles de 20x20, contornos duros, poucos tons, leitura alta e objetos parecidos com os atlases `tileset.png` e `details.png`.

### Regras de estilo para todos os mundos

- Formato: PNG 4:3, preferencialmente 1536x1152 ou 1024x768.
- Composicao: uma mini-regiao de dungeon vista de cima, como um pequeno mapa/room cluster, nao uma ilha isometrica renderizada.
- Linguagem visual: 1-bit / Playdate-like, preto profundo, branco osso e cinzas pontuais, com no maximo um acento tematico discreto.
- Base do mapa: paredes de pedra, pisos quadrados rachados, portas, corredores e salas usando a mesma sensacao do atlas de mapa.
- Detalhes: chaves, baus, saidas, placas, tochas, pedras soltas e pequenas marcas usando a mesma densidade do atlas `details.png`.
- Evitar: 3D, isometrico, pintura digital suave, gradientes grandes, brilho neon, excesso de cor, texto, UI, logos, personagens grandes ou cenarios cinematograficos.

### Prompt base dos mundos

Use este trecho no inicio de cada prompt:

```text
Create a 4:3 world card image for Code Dungeon, an educational coding dungeon game. The image must look like a top-down 1-bit dungeon mini-map built from 20x20 pixel tiles, matching the existing black-and-bone dungeon tileset and details atlas: hard square edges, stone wall blocks, cracked floor tiles, tiny props, high readability, low color count, no text, no UI, no logo, no characters as the main subject. Use mostly #090A14, #000000, #171826, #EBEDE9, #B9BDB6, with only one subtle accent color when needed.
```

### Negativo especifico para mundos

```text
isometric floating island, 3D render, painterly fantasy concept art, smooth gradients, cinematic lighting, realistic rocks, soft airbrush, oversized hero character, large UI icons, text, labels, logo, watermark, colorful neon palette, too many props, cluttered composition, low readability, non-tile-based shapes
```

### Mundo 1 - Sequencia Basica

```text
Create a beginner world card using the base world style. Show a simple readable dungeon route made of a few straight floor tiles, one small entrance gate, one exit marker, and two or three arrow-like floor markings made from tile shapes. Keep the layout sparse and instructional, with strong black negative space around the room cluster. Use almost no accent color; if needed, use a tiny #EBEDE9 glow on the exit only.
```

### Mundo 2 - Interacoes da Dungeon

```text
Create an interaction world card using the base world style. Show a compact top-down dungeon room cluster with a locked door, a key on a pedestal, a closed chest, an opened chest, and one small enemy silhouette as a tiny map detail. Use the same 1-bit prop density as the details atlas: small, readable, not decorative overload. Add one muted danger accent using #752438 only on the enemy or warning tile.
```

### Mundo 3 - Condicionais

```text
Create a conditional-logic world card using the base world style. Show a forked dungeon layout with two or three branching corridors, hidden-wall feeling, warning tiles, a wall directly in one branch, and a safe path in another branch. Include tiny "look ahead" visual cues made only from tile details: eye-like floor mark, small signpost shape, or highlighted tile edge, but no text. The image should communicate if/else decision making through branching paths and obstacles.
```

### Mundo 4 - Loops

```text
Create a loops world card using the base world style. Show repeated corridor segments and a square or spiral-like route built from the same floor tile repeated many times. Include repeating pillars, repeated cracked floor variants, and a route that visually cycles back before reaching the exit. Keep it top-down and grid-aligned, like a puzzle map that rewards repeated commands, with one subtle #B9BDB6 rhythm highlight across every third tile.
```

### Mundo 5 - Funcoes

```text
Create a functions world card using the base world style. Show modular dungeon rooms connected by short corridors, with repeated room motifs reused in different positions: same door shape, same floor patch, same chest alcove, same small exit structure. The composition should feel organized and reusable, like repeated code blocks represented as repeated rooms. Keep details crisp, grid-based, and 1-bit.
```

### Mundo final secreto - Labirinto Procedural

```text
Create a secret procedural maze world card using the base world style. Show a dense top-down maze made from many tiny 20x20 wall and floor tiles, with a small entrance, a distant exit detail, a few hidden treasure props, and darker corners. It should feel compact, challenging, and mysterious, but still readable at card size. Use mostly black and bone tones, with a very small #752438 danger accent in one dead end.
```

### Versao consistente para todos os mundos

```text
Create a consistent set of six 4:3 world card images for Code Dungeon. Every image must look like it belongs to the same top-down 1-bit dungeon tileset: black background, bone-white stone tiles, hard pixel edges, 20x20 tile logic, tiny details from a matching details atlas, no text, no UI, no isometric view, no painterly rendering. Make each world recognizable by layout language rather than color overload: simple route for sequence, key-door-chest room for interactions, branching hidden corridors for conditionals, repeated corridors for loops, modular repeated rooms for functions, dense maze for the procedural challenge.
```
