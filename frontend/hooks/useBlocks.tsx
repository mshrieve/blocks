import {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect
} from 'react'
import { ethers, utils } from 'ethers'

import { usePrices } from '../hooks/usePrices'
import { EthContext, eDecimals } from '../context/eth'

export const useBlocks = () => {
  const [lastTxTime, setLastTxTime] = useState(0)
  const { blocksContract: contract } = useContext(EthContext)

  const prices = usePrices({ contract, lastTxTime })

  const handlePurchase = useCallback(
    async (bucket, amount) => {
      const purchase = await contract.purchase(
        bucket,
        eDecimals.times(amount).toFixed()
      )
      const receipt = await purchase.wait()
      console.log(receipt.gasUsed.toString())
      setLastTxTime((x) => x + 1)
    },
    [contract]
  )

  const handlePurchaseLeftSlope = useCallback(
    async (bucket, amount) => {
      // const batch = new Array(10).fill(undefined).map((_, i) => i)
      // const amounts = new Array(10).fill(undefined).map((_, i) => 1000 * (10 - i))
      const purchase = await contract.purchaseLeftSlope(
        bucket,
        eDecimals.times(amount).toFixed()
      )
      const receipt = await purchase.wait()
      console.log(receipt.gasUsed.toString())
      setLastTxTime((x) => x + 1)
    },
    [contract]
  )

  const handlePurchaseLeftBlock = useCallback(
    async (bucket, amount) => {
      // const batch = new Array(10).fill(undefined).map((_, i) => i)
      // const amounts = new Array(10).fill(undefined).map((_, i) => 1000 * (10 - i))
      const purchase = await contract.purchaseLeftBlock(
        bucket,
        eDecimals.times(amount).toFixed()
      )
      const receipt = await purchase.wait()
      console.log(receipt.gasUsed.toString())
      setLastTxTime((x) => x + 1)
    },
    [contract]
  )
  // const getBalance = useCallback(address)

  return {
    handlePurchase,
    handlePurchaseLeftSlope,
    handlePurchaseLeftBlock,
    prices,
    lastTxTime,
    contract
  }
}
