import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { I18nProvider, useI18n } from '../i18n'

function SmallScreenBlocker() {
  const { t } = useI18n()

  return (
    <div className="small-screen-blocker" role="dialog" aria-modal="true" aria-labelledby="small-screen-title">
      <div className="small-screen-blocker__panel">
        <div className="pixel-eyebrow">CODE DUNGEON</div>
        <h1 id="small-screen-title" className="pixel-type small-screen-blocker__title">{t('mobile.title')}</h1>
        <p>{t('mobile.message')}</p>
        <p className="small-screen-blocker__requirement">{t('mobile.requirement')}</p>
      </div>
    </div>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isGamePage = router.pathname === '/game'

  if (isGamePage) {
    return (
      <I18nProvider>
        <>
          <Component {...pageProps} />
          <SmallScreenBlocker />
        </>
      </I18nProvider>
    )
  }

  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 site-container">
          <Component {...pageProps} />
        </main>
      </div>
      <SmallScreenBlocker />
    </I18nProvider>
  )
}
