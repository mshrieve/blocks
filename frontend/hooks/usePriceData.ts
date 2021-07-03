import { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { ChartContext } from '../context/chart'
import BigNumber from 'bignumber.js'
import { EthContext, eDecimals } from '../context/eth'
const initPrices = new Array(100).fill('0.01')

export const usePriceData = () => {
  const { blocksContract: contract, lastTxTime } = useContext(EthContext)
  const [prices, setPrices] = useState(initPrices)

  // get prices
  useEffect(() => {
    console.log('fetching prices', lastTxTime)
    Promise.all(
      initPrices.map((_, i) =>
        contract
          .getBucketPrice(i)
          .then((x: ethers.BigNumber) =>
            new BigNumber(x.toString()).div(eDecimals).toString()
          )
      )
    ).then((p) => setPrices(p))
  }, [contract, lastTxTime])

  return prices
}
