import '../styles/globals.css'
import { NextDataHooksProvider } from 'next-data-hooks'

function MyApp({ Component, pageProps }) {
  return (
    <NextDataHooksProvider {...pageProps}>
      <Component {...pageProps} />
    </NextDataHooksProvider>
  )
}

export default MyApp
