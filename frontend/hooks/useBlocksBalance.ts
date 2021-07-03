import { useContext, useState, useEffect } from 'react'

import BigNumber from 'bignumber.js'
import { eDecimals, EthContext } from '../context/eth'

import { useBlocks } from './useBlocks'
const initPrices = new Array(100).fill(0.01)
const batch = new Array(100).fill(undefined).map((_, i) => i)

const useBlocksBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { activeAccount, lastTxTime } = useContext(EthContext)
  const { contract } = useBlocks()

  // get balances
  useEffect(() => {
    if (contract != undefined && activeAccount.length > 0)
      contract
        .balanceOfBatch(new Array(100).fill(activeAccount), batch)
        .then((x: BigNumber[]) => {
          return x.reduce(
            (acc, cur) => acc.plus(cur.toString()),
            new BigNumber(0)
          )
        })
        .then((x) => setBalance(x))
  }, [contract, lastTxTime, activeAccount])

  return balance
}

export { useBlocksBalance }
