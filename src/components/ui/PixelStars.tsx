import PixelIcon from './PixelIcon'
import { UI_SPRITES } from '../../game/ui/uiSprites'

type Props = {
  count: number
  scale?: 1 | 2 | 3 | 4
  className?: string
}

export default function PixelStars({ count, scale = 2, className = '' }: Props) {
  const normalizedCount = Math.max(1, Math.min(3, Math.floor(count)))
  const sprite = normalizedCount >= 3
    ? UI_SPRITES.stars.three
    : normalizedCount === 2
      ? UI_SPRITES.stars.two
      : UI_SPRITES.stars.one

  return <PixelIcon sprite={sprite} scale={scale} className={className} label={`${normalizedCount} estrela${normalizedCount === 1 ? '' : 's'}`} />
}
