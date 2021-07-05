import { RoundProvider } from '../../context/round'

import { ChartProvider } from './frontend/context/chart'
import { AccountSelect } from './frontend/components/AccountSelect'

import { Controls } from './frontend/components/Controls'
import { ChartControl } from './frontend/components/ChartControl'
import { EthProvider } from './frontend/context/eth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
const Round = () => {
  const router = useRouter()
  return (
    <EthProvider>
      <RoundProvider roundAddress={router.query.roundAddress}>
        <main>
          <AccountSelect />
          <ChartControl />
          <Controls />
        </main>
      </RoundProvider>
    </EthProvider>
  )
}

export default Round
