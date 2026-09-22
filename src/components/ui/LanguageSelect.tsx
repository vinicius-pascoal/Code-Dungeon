import { LOCALES, type Locale, useI18n } from '../../i18n'

type Props = {
  className?: string
}

export default function LanguageSelect({ className = '' }: Props) {
  const { locale, setLocale, t } = useI18n()
  const shortLabels: Record<Locale, string> = {
    pt: 'PT',
    en: 'EN',
    es: 'ES',
  }

  return (
    <div
      className={`pixel-type inline-flex min-h-10 items-stretch overflow-hidden border-2 border-primaryText bg-black text-[10px] shadow-[inset_0_0_0_2px_#090a14] ${className}`}
      role="group"
      aria-label={t('language.label')}
    >
      <span className="flex items-center border-r-2 border-border px-2 text-[9px] leading-none text-secondaryText">
        {t('language.label')}
      </span>
      <div className="flex">
        {LOCALES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLocale(item)}
            aria-pressed={locale === item}
            title={t(`language.${item}`)}
            className={`min-w-9 border-r border-border px-2 font-mono text-[10px] font-black uppercase outline-none transition-colors last:border-r-0 focus-visible:bg-primaryText focus-visible:text-bg ${
              locale === item
                ? 'bg-primaryText text-bg'
                : 'bg-black text-primaryText hover:bg-wall hover:text-primaryText'
            }`}
          >
            {shortLabels[item]}
          </button>
        ))}
      </div>
    </div>
  )
}
