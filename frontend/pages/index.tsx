import { ChartProvider } from '../context/chart'
import { Chart } from '../components/Chart'
import { EthProvider } from '../context/eth'
import { RoundContainer } from '../components/RoundContainer'
import { DatasetHandler } from '../components/DatasetHandler'

const Round = () => {
  return (
    <ChartProvider>
      <EthProvider>
        <Chart />
        <RoundContainer />
      </EthProvider>
    </ChartProvider>
  )
}

export default Round
