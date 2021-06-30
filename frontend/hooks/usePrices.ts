import {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect
} from 'react'
import { ethers, utils } from 'ethers'

import BigNumber from 'bignumber.js'
const eDecimals = new BigNumber('10').pow(18)
const initPrices = new Array(100).fill(0.01)

export const usePrices = ({ chartRef, contract, lastTxTime }) => {
  const [prices, setPrices] = useState(initPrices)

  // update the chart
  useEffect(() => {
    if (chartRef && chartRef.current) {
      chartRef.current.data.datasets[0].data = prices
      chartRef.current.update()
    }
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
