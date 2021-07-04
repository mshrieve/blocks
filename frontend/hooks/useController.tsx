import { useContext, useCallback, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { EthContext, eDecimals } from '../context/eth'
import BigNumber from 'bignumber.js'
const abi = ['event RoundCreated(address round)']
const iface = new ethers.utils.Interface(abi)

export const useController = () => {
  const {
    controllerContract: contract,
    lastTxTime,
    handleTransaction
  } = useContext(EthContext)

  const [rounds, setRounds] = useState([])
  const [vaultAddress, setVaultAddress] = useState('')

  useEffect(() => {
    if (contract != undefined) contract.getRounds().then((x) => setRounds(x))
  }, [contract, lastTxTime])
  useEffect(() => {
    if (contract != undefined)
      contract.getVaultAddress().then((x) => setVaultAddress(x))
  }, [contract])

  const handleCreateRound = useCallback(async (N, b, delta, asset, vault) => {
    const receipt = await handleTransaction(contract, 'createRound', [
      N,
      eDecimals.times(b).toFixed(),
      delta,
      asset,
      vault
    ])
    console.log(
      'logs: ',
      receipt.logs.map((log: any) => iface.parseLog(log))
    )
  }, [])

  useEffect(() => {
    console.log('vault address: ', vaultAddress)
    console.log('rounds: ', rounds)
  }, [rounds, vaultAddress])

  return {
    rounds,
    vaultAddress,
    contract,
    handleCreateRound
  }
}
