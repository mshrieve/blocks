import { useContext, useState, useEffect } from 'react'

import BigNumber from 'bignumber.js'
import { eDecimals, EthContext } from '../context/eth'

const initPrices = new Array(100).fill(0.01)
const batch = new Array(100).fill(undefined).map((_, i) => i)

const useRoundBalance = (roundContract) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { activeAccount, lastTxTime } = useContext(EthContext)

  // get balances
  useEffect(() => {
    if (roundContract != undefined && activeAccount.length > 0)
      roundContract
        .balanceOfBatch(new Array(100).fill(activeAccount), batch)
        .then((x: BigNumber[]) => {
          return x.reduce(
            (acc, cur) => acc.plus(cur.toString()),
            new BigNumber(0)
          )
        })
        .then((x) => setBalance(x))
  }, [roundContract, lastTxTime, activeAccount])

  return balance
}

export { useRoundBalance }
