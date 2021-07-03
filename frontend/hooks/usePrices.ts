import { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { ChartContext } from '../context/chart'
import BigNumber from 'bignumber.js'
import { eDecimals } from '../util'
const initPrices = new Array(100).fill(0.01)

export const usePrices = ({ contract, lastTxTime }) => {
  const [prices, setPrices] = useState(initPrices)
  const { setData } = useContext(ChartContext)
  // update the chart
  useEffect(() => {
    setData(prices, 0)
  }, [prices])

  // get prices
  useEffect(() => {
    Promise.all(
      initPrices.map((_, i) =>
        contract
          .getBucketPrice(i)
          .then((x: ethers.BigNumber) =>
            new BigNumber(x.toString()).div(eDecimals).toString()
          )
      )
    ).then((p) => setPrices(p))
  }, [lastTxTime])

  return prices
}
