import { useContext, useCallback, useState } from 'react'
import { ethers } from 'ethers'
import { EthContext, eDecimals } from '../context/eth'

export const useBlocks = (blocksAddress) => {
  const { handleTransaction, signer } = useContext(EthContext)
  const [contract, setContract] = useState(
    new ethers.Contract(blocksAddress, Blocks.abi, signer)
  )
  const handlePurchase = useCallback(
    async (bucket, amount) =>
      handleTransaction(contract, 'purchase', [
        bucket,
        eDecimals.times(amount).toFixed()
      ]),
    [contract]
  )

  const handlePurchaseLeftSlope = useCallback(
    async (bucket, amount) =>
      handleTransaction(contract, 'purchaseLeftSlope', [
        bucket,
        eDecimals.times(amount).toFixed()
      ]),
    [contract]
  )

  const handlePurchaseRange = useCallback(
    async (start, end, amount) =>
      handleTransaction(contract, 'purchaseRange', [
        start,
        end,
        eDecimals.times(amount).toFixed()
      ]),
    [contract]
  )

  return {
    handlePurchase,
    handlePurchaseLeftSlope,
    handlePurchaseRange,
    contract
  }
}
