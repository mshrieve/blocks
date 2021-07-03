import { createContext, useCallback, useState, useEffect } from 'react'
import { Contract, ethers } from 'ethers'
import Blocks from '../../hardhat/artifacts/hardhat/contracts/Blocks.sol/Blocks.json'
import USDC from '../../hardhat/artifacts/hardhat/contracts/Mocks/USDC.sol/USDC.json'

import { eDecimals } from '../util'

import BigNumber from 'bignumber.js'
const initPrices = new Array(100).fill(0.01)

const defaultState = {
  updateActiveAccount: (address) => console.error('setAccount is not defined.'),
  handleTransaction: (contract, method, args) =>
    console.error('handleTransaction is not defined.'),
  blocksContract: undefined,
  usdcContract: undefined,
  accounts: undefined,
  activeAccount: undefined,
  lastTxTime: undefined
}

const EthContext = createContext(defaultState)
const EthProvider = ({ children }) => {
  const [provider, setProvider] = useState(
    new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
  )

  const [accounts, setAccounts] = useState([])
  const [signer, setSigner] = useState(provider.getSigner())
  const [activeAccount, setActiveAccount] = useState('')
  const [lastTxTime, setLastTxTime] = useState(0)

  const [blocksContract, setBlocksContract] = useState(
    new ethers.Contract(
      process.env.NEXT_PUBLIC_BLOCKS_ADDRESS,
      Blocks.abi,
      signer
    )
  )
  const [usdcContract, setUsdcContract] = useState(
    new ethers.Contract(process.env.NEXT_PUBLIC_USDC_ADDRESS, USDC.abi, signer)
  )

  const updateActiveAccount = useCallback(
    (account) => {
      const updatedSigner = provider.getSigner(account)
      setBlocksContract(blocksContract.connect(updatedSigner))
      setUsdcContract(usdcContract.connect(updatedSigner))
      setSigner(updatedSigner)
      updatedSigner.getAddress().then((x) => setActiveAccount(x))
    },
    [blocksContract, usdcContract, provider]
  )

  const handleTransaction = useCallback(
    async (contract, method, args) => {
      const transaction = await contract[method](...args)
      const receipt = await transaction.wait()
      console.log(transaction)
      console.log(receipt)
      setLastTxTime((x) => x + 1)
    },
    [setLastTxTime]
  )

  useEffect(
    () => console.log('active: ', activeAccount.length, activeAccount),
    [activeAccount]
  )

  useEffect(() => {
    provider.listAccounts().then((x) => {
      setAccounts(x)
      signer
        .getAddress()
        .then((x) => setActiveAccount(x))
        .then(() => setLastTxTime((x) => x + 1))
    })
  }, [])

  // const getBalance = useCallback(address)
  useEffect(
    () => console.log('eth context, lastTxTime: ', lastTxTime),
    [lastTxTime]
  )
  useEffect(() => {
    console.log('value updated')
    setValue((value) => ({
      ...value,
      accounts,
      updateActiveAccount,
      activeAccount,
      blocksContract,
      usdcContract,
      lastTxTime,
      handleTransaction
    }))
  }, [
    accounts,
    updateActiveAccount,
    activeAccount,
    blocksContract,
    usdcContract,
    lastTxTime,
    handleTransaction
  ])

  const [value, setValue] = useState({
    accounts,
    updateActiveAccount,
    activeAccount,
    blocksContract,
    usdcContract,
    lastTxTime,
    handleTransaction
  })

  return <EthContext.Provider value={value}>{children}</EthContext.Provider>
}

export { EthContext, EthProvider, eDecimals }
