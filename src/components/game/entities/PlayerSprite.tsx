import React, { useEffect, useMemo, useState } from 'react'
import type { Direction, PlayerAnimationState } from '../../../types/game'
import {
  ALL_PLAYER_ANIMATION_FRAMES,
  resolvePlayerAnimationConfig,
  shouldFlipPlayerSprite,
} from '../../../game/entities/playerAnimations'
import { useSpriteAnimation } from './useSpriteAnimation'

type PlayerSpriteProps = {
  direction: Direction
  animationState: PlayerAnimationState
  size: number
  className?: string
  ariaLabel?: string
  onAnimationComplete?: (animationState: PlayerAnimationState) => void
}

let playerAssetsPreloaded = false

function joinClassNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  return prefersReducedMotion
}

export default function PlayerSprite({
  direction,
  animationState,
  size,
  className,
  ariaLabel = 'Personagem do jogador',
  onAnimationComplete,
}: PlayerSpriteProps) {
  const reducedMotion = usePrefersReducedMotion()
  const animationConfig = resolvePlayerAnimationConfig(animationState, direction)
  const animationKey = `${animationState}:${direction}`
  const renderSize = Math.max(16, Math.round(size))
  const flipX = shouldFlipPlayerSprite(direction)

  useEffect(() => {
    if (playerAssetsPreloaded || typeof window === 'undefined') return

    playerAssetsPreloaded = true
    for (const src of ALL_PLAYER_ANIMATION_FRAMES) {
      const image = new Image()
      image.src = src
    }
  }, [])

  const handleAnimationComplete = useMemo(
    () => () => onAnimationComplete?.(animationState),
    [animationState, onAnimationComplete]
  )

  const currentFrame = useSpriteAnimation({
    frames: animationConfig.frames,
    frameDuration: animationConfig.frameDuration,
    loop: animationConfig.loop,
    animationKey,
    reducedMotion,
    onComplete: handleAnimationComplete,
  })

  return (
    <img
      src={currentFrame || '/assets/personagem/Ghost.png'}
      alt={ariaLabel}
      draggable={false}
      className={joinClassNames('player-sprite dungeon-entity-sprite', className)}
      style={{
        width: `${renderSize}px`,
        height: `${renderSize}px`,
        maxWidth: 'none',
        maxHeight: 'none',
        objectFit: 'contain',
        transform: flipX ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    />
  )
}
