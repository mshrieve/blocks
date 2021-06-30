import { ethers, utils } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import { WrappedChart } from '../components/chart'
import { BarChart } from '../components/chart2'
import { Purchase } from '../components/purchase'
import { BlocksProvider, BlocksContext } from '../context/blocks'
import { ChartProvider, ChartContext } from '../context/chart'

const HomePage = () => {
  const [address, setAddress] = useState('')
  const [totalSupply, setTotalSupply] = useState('')

  return (
    <ChartProvider>
      <BlocksProvider>
        <main>
          <section>
            <div>Welcome to Next.js! {address}</div>
            <div>total supply: {totalSupply}</div>
          </section>
          <WrappedChart />
          <Purchase />
        </main>
      </BlocksProvider>
    </ChartProvider>
  )
}

export default HomePage
