import PixelIcon from './PixelIcon'
import { UI_SPRITES } from '../../game/ui/uiSprites'

type Props = {
  count: number
  scale?: 1 | 2 | 3 | 4
  className?: string
}

export default function PixelStars({ count, scale = 2, className = '' }: Props) {
  const sprite = count >= 3
    ? UI_SPRITES.stars.three
    : count === 2
      ? UI_SPRITES.stars.two
      : UI_SPRITES.stars.one

  return <PixelIcon sprite={sprite} scale={scale} className={className} label={`${count} estrela${count === 1 ? '' : 's'}`} />
}
