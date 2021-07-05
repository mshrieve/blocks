import { useContext, useState, useEffect } from 'react'

import BigNumber from 'bignumber.js'
import { eDecimals, EthContext } from '../context/eth'

const initPrices = new Array(100).fill(0.01)
const batch = new Array(100).fill(undefined).map((_, i) => i)

const useRoundBalance = (roundContract, price) => {
  const [totalBalance, setTotalBalance] = useState(new BigNumber(0))
  const { activeAccount, lastTxTime } = useContext(EthContext)
  const [redeemableBalance, setRedeemableBalance] = useState(new BigNumber(0))
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
        .then((x) => setTotalBalance(x))
  }, [roundContract, lastTxTime, activeAccount])

  useEffect(() => {
    console.log('reddeamble?', price)
    if (roundContract != undefined && activeAccount.length > 0)
      roundContract.balanceOf(activeAccount, price).then((x) => {
        console.log('reedemable', x.toString())
        setRedeemableBalance(new BigNumber(x.toString()).div(eDecimals))
      })
  }, [roundContract, price, lastTxTime, activeAccount])

  return { redeemableBalance, totalBalance }
}

export { useRoundBalance }
