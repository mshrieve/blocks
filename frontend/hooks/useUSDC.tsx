import { useContext, useCallback, useState } from 'react'
import { ethers } from 'ethers'
import { EthContext } from '../context/eth'
import { BigNumber } from 'bignumber.js'

export const useUSDC = () => {
  const {
    usdcContract: contract,
    blocksContract,
    lastTxTime,
    handleTransaction
  } = useContext(EthContext)

  const getBalance = useCallback(
    async (account) => {
      console.log(account, lastTxTime)
      if (account != undefined && account.length > 0) {
        console.log(ethers.utils.isAddress(account))
        const address = ethers.utils.getAddress(account)
        const balance = await contract.balanceOf(address)
        console.log(balance.toString())

        return balance
      }
      return undefined
    },
    [contract, lastTxTime]
  )

  const getAllowance = useCallback(
    async (account) => {
      console.log(account, lastTxTime)
      if (account.length > 0) {
        console.log(ethers.utils.isAddress(account))
        const allowance = await contract.allowance(
          account,
          process.env.NEXT_PUBLIC_BLOCKS_ADDRESS
        )
        console.log(allowance.toString())
        return allowance
      }
      return undefined
    },
    [contract, lastTxTime]
  )

  const handleTransfer = useCallback(
    async (sender, recipient, amount) =>
      handleTransaction(contract, 'transferFrom', [sender, recipient, amount]),
    [contract, handleTransaction]
  )

  //   function approve(address spender, uint256 amount) external returns (bool);
  const handleApprove = useCallback(
    async (amount) =>
      handleTransaction(contract, 'approve', [blocksContract.address, amount]),
    [contract]
  )

  return {
    getBalance,
    getAllowance,
    handleTransfer,
    handleApprove
  }
}
