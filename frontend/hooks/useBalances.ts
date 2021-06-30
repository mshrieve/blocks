import {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect
} from 'react'
import { ethers, utils } from 'ethers'
import config from '../config.json'

import BigNumber from 'bignumber.js'
const eDecimals = new BigNumber('10').pow(18)
const initPrices = new Array(100).fill(0.01)
const batch = new Array(100).fill(undefined).map((_, i) => i)

export const useBalances = ({ contract, lastTxTime }) => {
  const [balances, setBalances] = useState({
    [config[0][1]]: 0,
    [config[1][1]]: 0,
    [config[2][1]]: 0,
    [config[3][1]]: 0
  })

  // get balances
  useEffect(() => {
    if (contract != undefined)
      Promise.all(
        initPrices.map((_, i) =>
          contract
            .balanceOfBatch(new Array(100).fill(config[0][1]), batch)
            .then((x: BigNumber[]) => x.reduce((acc, cur) => acc.plus(cur), new BigNumber(0), )
        )
      ).then((p) =>
        setBalances((balances) => ({ ...balances, [config[0][1]]: 1 }))
      )
  }, [lastTxTime, contract])

  return balances
}
