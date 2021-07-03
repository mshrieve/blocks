import { WrappedChart } from '../components/chart'

import { DataProvider } from '../context/data'
import { EthProvider } from '../context/eth'
import { ChartProvider } from '../context/chart'
import { AccountSelect } from '../components/AccountSelect'

import { Controls } from '../components/Controls'
import { ChartControl } from '../components/ChartControl'

const App = () => {
  return (
    <EthProvider>
      <ChartProvider>
        <DataProvider>
          <AccountSelect />
          <main>
            <ChartControl />
            <WrappedChart />
            <Controls />
          </main>
        </DataProvider>
      </ChartProvider>
    </EthProvider>
  )
}

export default App
