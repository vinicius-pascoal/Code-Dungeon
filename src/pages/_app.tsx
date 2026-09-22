import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { I18nProvider } from '../i18n'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isGamePage = router.pathname === '/game'

  if (isGamePage) {
    return (
      <I18nProvider>
        <Component {...pageProps} />
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
    </I18nProvider>
  )
}
