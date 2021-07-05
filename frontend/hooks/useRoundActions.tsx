import { useContext, useCallback } from 'react'
import { EthContext, eDecimals } from '../context/eth'

export const useRoundActions = (roundContract) => {
  const { handleTransaction } = useContext(EthContext)

  const handlePurchase = useCallback(
    async (bucket, amount) =>
      handleTransaction(roundContract, 'purchase', [
        bucket,
        eDecimals.times(amount).toFixed()
      ]),
    [roundContract]
  )

  const handlePurchaseLeftSlope = useCallback(
    async (bucket, amount) =>
      handleTransaction(roundContract, 'purchaseLeftSlope', [
        bucket,
        eDecimals.times(amount).toFixed()
      ]),
    [roundContract]
  )

  const handlePurchaseRange = useCallback(
    async (start, end, amount) =>
      handleTransaction(roundContract, 'purchaseRange', [
        start,
        end,
        eDecimals.times(amount).toFixed()
      ]),
    [roundContract]
  )

  return {
    handlePurchase,
    handlePurchaseLeftSlope,
    handlePurchaseRange
  }
}
