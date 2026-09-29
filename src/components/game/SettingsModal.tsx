import PixelButton from '../ui/PixelButton'
import PixelPanel from '../ui/PixelPanel'
import LanguageSelect from '../ui/LanguageSelect'
import { useI18n } from '../../i18n'

type EditorPosition = 'left' | 'right'
export type AnimationSpeed = 'normal' | 'fast'

type Props = {
  isOpen: boolean
  onClose: () => void
  editorPosition: EditorPosition
  onEditorPositionChange: (position: EditorPosition) => void
  animationSpeed: AnimationSpeed
  onAnimationSpeedChange: (speed: AnimationSpeed) => void
}

export default function SettingsModal({
  isOpen,
  onClose,
  editorPosition,
  onEditorPositionChange,
  animationSpeed,
  onAnimationSpeedChange,
}: Props) {
  const { t } = useI18n()

  if (!isOpen) return null

  return (
    <div className="pixel-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <PixelPanel
        variant="modal"
        className="w-full max-w-lg"
        title={t('game.settings.title')}
        icon="settings"
        headerAction={
          <PixelButton type="button" icon="reset" size="sm" variant="ghost" onClick={onClose} aria-label={t('game.settings.close')}>
            {t('common.close')}
          </PixelButton>
        }
      >
        <div className="grid gap-5">
          <section>
            <p className="pixel-eyebrow">{t('game.settings.language')}</p>
            <LanguageSelect className="mt-2" />
          </section>

          <section>
            <p className="pixel-eyebrow">{t('game.settings.layout')}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(['left', 'right'] as const).map((position) => (
                <label
                  key={position}
                  className={`flex cursor-pointer items-center gap-3 border-2 p-3 text-xs text-primaryText ${editorPosition === position ? 'border-primaryText bg-primaryText/10' : 'border-border bg-black'
                    }`}
                >
                  <input
                    type="radio"
                    name="editor-position"
                    value={position}
                    checked={editorPosition === position}
                    onChange={() => onEditorPositionChange(position)}
                    className="accent-primaryText"
                  />
                  <span>{t(position === 'left' ? 'game.settings.editorLeft' : 'game.settings.editorRight')}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <p className="pixel-eyebrow">{t('game.settings.animation')}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(['normal', 'fast'] as const).map((speed) => (
                <label
                  key={speed}
                  className={`flex cursor-pointer items-center gap-3 border-2 p-3 text-xs text-primaryText ${animationSpeed === speed ? 'border-primaryText bg-primaryText/10' : 'border-border bg-black'
                    }`}
                >
                  <input
                    type="radio"
                    name="animation-speed"
                    value={speed}
                    checked={animationSpeed === speed}
                    onChange={() => onAnimationSpeedChange(speed)}
                    className="accent-primaryText"
                  />
                  <span>{t(speed === 'fast' ? 'game.settings.animationFast' : 'game.settings.animationNormal')}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </PixelPanel>
    </div>
  )
}
