import { useContext, useCallback, useState } from 'react'

import { EthContext, eDecimals } from '../context/eth'

export const useUSDC = () => {
  const [lastTxTime, setLastTxTime] = useState(0)
  const { usdcContract: contract } = useContext(EthContext)

  const getBalance = useCallback(
    async (account) => {
      const balance = await contract.balanceOf(account)
      const receipt = await balance.wait()
      console.log(balance)
      console.log(receipt)

      return balance
    },
    [contract]
  )

  const handleTransfer = useCallback(
    async (sender, recipient, amount) => {
      const transfer = await contract.transferFrom(sender, recipient, amount)
      const receipt = await transfer.wait()
      console.log(transfer)
      console.log(receipt)
      setLastTxTime((x) => x + 1)
    },
    [contract]
  )

  //   function approve(address spender, uint256 amount) external returns (bool);
  const handleApprove = useCallback(
    async (amount) => {
      const approve = await contract.approve(contract.address, amount)
      const receipt = await approve.wait()
      console.log(approve)
      console.log(receipt)
    },
    [contract]
  )

  return {
    getBalance,
    handleTransfer,
    handleApprove
  }
}
