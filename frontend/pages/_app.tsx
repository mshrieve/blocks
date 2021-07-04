import '../styles.css'
import { EthProvider } from '../context/eth'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <EthProvider>
      <Component {...pageProps} />
    </EthProvider>
  )
}
