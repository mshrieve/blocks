import { WrappedChart } from '../components/chart'
import { Purchase } from '../components/purchase'
import { BlocksProvider, BlocksContext } from '../context/blocks'
import { ChartProvider, ChartContext } from '../context/chart'
import { Balances } from '../components/balances'
import { AccountSelect } from '../components/AccountSelect'
const HomePage = () => {
  return (
    <ChartProvider>
      <BlocksProvider>
        <AccountSelect />
        <main>
          <WrappedChart />
          <Purchase />
          <Balances />
        </main>
      </BlocksProvider>
    </ChartProvider>
  )
}

export default HomePage
