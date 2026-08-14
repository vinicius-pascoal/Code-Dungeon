export const UI_ATLAS = {
  src: '/assets/tilesets/ui.png',
  width: 469,
  height: 259,
} as const

export const UI_COLORS = {
  background: '#090A14',
  foreground: '#EBEDE9',
  wine: '#752438',
  purple: '#7A367B',
  black: '#000000',
} as const

export interface UiSpriteRect {
  x: number
  y: number
  width: number
  height: number
}
