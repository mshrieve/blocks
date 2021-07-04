import { WrappedChart } from '../components/chart'

import { DataProvider } from '../context/data'

import { ChartProvider } from '../context/chart'
import { AccountSelect } from '../components/AccountSelect'

import { Controls } from '../components/Controls'
import { ChartControl } from '../components/ChartControl'

const App = () => {
  return (
    <ChartProvider>
      <DataProvider>
        <main>
          <AccountSelect />
          <ChartControl />
          <WrappedChart />
          <Controls />
        </main>
      </DataProvider>
    </ChartProvider>
  )
}

export default App
