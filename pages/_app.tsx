import CssBaseline from '@material-ui/core/CssBaseline'
import {
  StylesProvider,
  ThemeProvider as MaterialUIThemeProvider,
} from '@material-ui/styles'
import type { AppProps } from 'next/app'
import { Header } from '../components/Header'
import '../styles/globals.css'
import theme from '../styles/theme'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StylesProvider injectFirst>
      <MaterialUIThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Component {...pageProps} />
      </MaterialUIThemeProvider>
    </StylesProvider>
  )
}
export default MyApp
