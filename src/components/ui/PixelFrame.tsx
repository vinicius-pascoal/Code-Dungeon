import type React from 'react'
import PixelIcon from './PixelIcon'
import { UI_SPRITES } from '../../game/ui/uiSprites'

type Props = {
  children: React.ReactNode
  className?: string
}

export default function PixelFrame({ children, className = '' }: Props) {
  return (
    <div className={`pixel-game-frame ${className}`}>
      <PixelIcon sprite={UI_SPRITES.frames.gameCornerTopLeft} scale={1} className="pixel-game-frame__corner pixel-game-frame__corner--tl" />
      <PixelIcon sprite={UI_SPRITES.frames.gameCornerTopRight} scale={1} className="pixel-game-frame__corner pixel-game-frame__corner--tr" />
      <PixelIcon sprite={UI_SPRITES.frames.gameCornerBottomLeft} scale={1} className="pixel-game-frame__corner pixel-game-frame__corner--bl" />
      <PixelIcon sprite={UI_SPRITES.frames.gameCornerBottomRight} scale={1} className="pixel-game-frame__corner pixel-game-frame__corner--br" />
      <div className="pixel-game-frame__inner">
        {children}
      </div>
    </div>
  )
}
