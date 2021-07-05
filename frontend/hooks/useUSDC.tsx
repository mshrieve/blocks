import { useContext, useCallback, useState } from 'react'
import { ethers } from 'ethers'
import { EthContext } from '../context/eth'
import USDC from '../../hardhat/artifacts/hardhat/contracts/Mocks/USDC.sol/USDC.json'
export const useUSDC = () => {
  const { signer, lastTxTime, handleTransaction } = useContext(EthContext)

  const [usdcContract, setUsdcContract] = useState(
    new ethers.Contract(process.env.NEXT_PUBLIC_USDC_ADDRESS, USDC.abi, signer)
  )

  const getBalance = useCallback(
    async (account) => {
      console.log(account, lastTxTime)
      if (account != undefined && account.length > 0) {
        console.log(ethers.utils.isAddress(account))
        const address = ethers.utils.getAddress(account)
        const balance = await usdcContract.balanceOf(address)
        console.log(balance.toString())

        return balance
      }
      return undefined
    },
    [usdcContract, lastTxTime]
  )

  const getAllowance = useCallback(
    async (account, round) => {
      console.log(account, lastTxTime)
      if (account.length > 0) {
        console.log(ethers.utils.isAddress(account))
        const allowance = await usdcContract.allowance(account, round)
        console.log(allowance.toString())
        return allowance
      }
      return undefined
    },
    [usdcContract, lastTxTime]
  )

  const handleTransfer = useCallback(
    async (sender, recipient, amount) =>
      handleTransaction(usdcContract, 'transferFrom', [
        sender,
        recipient,
        amount
      ]),
    [usdcContract, handleTransaction]
  )

  //   function approve(address spender, uint256 amount) external returns (bool);
  const handleApprove = useCallback(
    async (amount, address) =>
      handleTransaction(usdcContract, 'approve', [address, amount]),
    [usdcContract]
  )

  return {
    getBalance,
    getAllowance,
    handleTransfer,
    handleApprove
  }
}
