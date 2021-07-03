import {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect
} from 'react'

import { BlocksContext } from '../context/blocks'
import { ChartContext } from '../context/chart'
import BigNumber from 'bignumber.js'
import { eDecimals } from '../context/eth'
const initPrices = new Array(100).fill(0.01)
const batch = new Array(100).fill(undefined).map((_, i) => i)

export const useBalances = ({ accounts, contract, lastTxTime }) => {
  const [balances, setBalances] = useState(['0', '0', '0', '0'])
  const { setData } = useContext(ChartContext)
  // get balances
  useEffect(() => {
    if (contract != undefined && accounts.length > 0)
      for (const i of [0, 1, 2, 3]) {
        contract
          .balanceOfBatch(new Array(100).fill(accounts[i]), batch)
          .then((x: BigNumber[]) => {
            return x.reduce(
              (acc, cur) => acc.plus(cur.toString()),
              new BigNumber(0)
            )
          })
          .then((x) =>
            setBalances((balances) => [
              ...balances.slice(0, i),
              x.toString(),
              ...balances.slice(i + 1, 100)
            ])
          )
      }
  }, [contract, lastTxTime])

  return balances
}
