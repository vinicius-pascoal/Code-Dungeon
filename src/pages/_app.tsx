import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/ui/Header'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isGamePage = router.pathname === '/game'

  if (isGamePage) {
    return <Component {...pageProps} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 site-container">
        <Component {...pageProps} />
      </main>
    </div>
  )
}
