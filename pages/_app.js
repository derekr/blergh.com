import '../styles/globals.css'
import { NextDataHooksProvider } from 'next-data-hooks'

function MyApp({ Component, pageProps }) {
  const { children, ...rest } = pageProps
  return (
    <NextDataHooksProvider {...rest}>
      <Component {...rest}>{children}</Component>
    </NextDataHooksProvider>
  )
}

export default MyApp
