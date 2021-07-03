import { useContext, useCallback } from 'react'

import { EthContext, eDecimals } from '../context/eth'

export const useBlocks = () => {
  const { blocksContract: contract, handleTransaction } = useContext(EthContext)

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
