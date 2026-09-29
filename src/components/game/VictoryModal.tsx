import PixelButton from '../ui/PixelButton'
import PixelPanel from '../ui/PixelPanel'
import PixelStars from '../ui/PixelStars'
import { useI18n } from '../../i18n'

type Props = {
  isOpen: boolean
  levelName: string
  stars: number
  commandCount: number
  onRetry: () => void
  nextLevelHref?: string
}

export default function VictoryModal({
  isOpen,
  levelName,
  stars,
  commandCount,
  onRetry,
  nextLevelHref,
}: Props) {
  const { t } = useI18n()

  if (!isOpen) {
    return null
  }

  return (
    <div className="pixel-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <PixelPanel variant="modal" className="w-full max-w-lg" title={t('modal.victoryTitle')}>
        <div className="text-center">
          <p className="text-sm leading-6 text-secondaryText">{t('modal.victoryText', { levelName })}</p>
          <div className="mt-5 flex justify-center">
            <PixelStars count={stars} scale={2} />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <PixelButton type="button" icon="reset" variant="danger" onClick={onRetry}>
            {t('common.repeat')}
          </PixelButton>
          {nextLevelHref ? (
            <PixelButton href={nextLevelHref} icon="right" variant="primary">
              {t('common.next')}
            </PixelButton>
          ) : (
            <PixelButton href="/levels" icon="list" variant="primary">
              {t('common.levels')}
            </PixelButton>
          )}
        </div>
      </PixelPanel>
    </div>
  )
}
