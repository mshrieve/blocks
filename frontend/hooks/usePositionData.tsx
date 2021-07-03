import { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { ChartContext } from '../context/chart'
import BigNumber from 'bignumber.js'
import { EthContext, eDecimals } from '../context/eth'
const initPrices: number[] = new Array(100).fill(0)

export const usePositionData = () => {
  const {
    activeAccount,
    blocksContract: contract,
    lastTxTime
  } = useContext(EthContext)
  const [positions, setPositions] = useState(initPrices)

  // get prices
  useEffect(() => {
    console.log('fetching positions', lastTxTime)
    if (activeAccount != undefined && activeAccount.length > 0)
      Promise.all(
        initPrices.map((_, i) =>
          contract
            .balanceOf(activeAccount, i)
            .then((x: ethers.BigNumber) =>
              new BigNumber(x.toString()).div(eDecimals).toString()
            )
        )
      ).then((p) => setPositions(p))
  }, [contract, lastTxTime])

  return positions
}
