import { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { EthContext, eDecimals } from '../context/eth'

const initPositions = new Array(100).fill('0')
const initPrices = new Array(100).fill('0.01')

export const useRoundData = (roundContract) => {
  const { activeAccount, lastTxTime } = useContext(EthContext)

  const [positions, setPositions] = useState(initPositions)
  const [prices, setPrices] = useState(initPrices)

  // get prices
  useEffect(() => {
    console.log('fetching positions', lastTxTime, activeAccount)
    if (roundContract != undefined && activeAccount.length > 0)
      Promise.all(
        initPrices.map((_, i) =>
          roundContract
            .balanceOf(activeAccount, i)
            .then((x: ethers.BigNumber) =>
              new BigNumber(x.toString()).div(eDecimals).toString()
            )
        )
      ).then((p) => setPositions(p))
  }, [roundContract, lastTxTime])

  useEffect(() => {
    console.log('fetching prices', lastTxTime)
    if (roundContract != undefined)
      Promise.all(
        initPrices.map((_, i) =>
          roundContract
            .getBucketPrice(i)
            .then((x: ethers.BigNumber) =>
              new BigNumber(x.toString()).div(eDecimals).toString()
            )
        )
      ).then((p) => setPrices(p))
  }, [roundContract, lastTxTime])

  return { prices, positions }
}
