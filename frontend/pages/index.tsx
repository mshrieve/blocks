import { WrappedChart } from '../components/chart'
import { Purchase } from '../components/Purchase'
import { PurchaseBatch } from '../components/PurchaseBatch'
import { BlocksProvider } from '../context/blocks'
import { EthProvider } from '../context/eth'
import { ChartProvider } from '../context/chart'
import { Balances } from '../components/balances'
import { AccountSelect } from '../components/AccountSelect'
import { Wallet } from '../components/wallet'
const App = () => {
  return (
    <EthProvider>
      <ChartProvider>
        <AccountSelect />
        <main>
          <WrappedChart />
          <Purchase />
          <PurchaseBatch />
          <Balances />
          <Wallet />
        </main>
      </ChartProvider>
    </EthProvider>
  )
}

export default App
