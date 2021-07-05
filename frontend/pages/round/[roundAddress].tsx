import { useRouter } from 'next/router'
import { RoundProvider } from '../../context/round'

import { ChartProvider } from '../../context/chart'
import { AccountSelect } from '../../components/AccountSelect'
import { Chart } from '../../components/Chart'
import { Controls } from '../../components/Controls'
import { ChartControl } from '../../components/ChartControl'

const Round = () => {
  const router = useRouter()
  const { roundAddress } = router.query

  return (
    <ChartProvider>
      <RoundProvider>
        <main>
          <AccountSelect />
          <ChartControl />
          <Chart />
          <Controls />
        </main>
      </RoundProvider>
    </ChartProvider>
  )
}

export default Round
