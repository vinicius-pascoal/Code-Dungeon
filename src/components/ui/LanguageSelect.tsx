import { LOCALES, LOCALE_NAMES, type Locale, useI18n } from '../../i18n'

type Props = {
  className?: string
}

export default function LanguageSelect({ className = '' }: Props) {
  const { locale, setLocale, t } = useI18n()

  return (
    <label className={`pixel-type flex items-center gap-2 text-[10px] text-secondaryText ${className}`}>
      <span>{t('language.label')}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="border-2 border-primaryText bg-black px-2 py-2 font-mono text-[10px] uppercase text-primaryText outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood"
        aria-label={t('language.label')}
      >
        {LOCALES.map((item) => (
          <option key={item} value={item}>
            {LOCALE_NAMES[item]}
          </option>
        ))}
      </select>
    </label>
  )
}
