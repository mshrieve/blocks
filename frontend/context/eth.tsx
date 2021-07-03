import { createContext, useCallback, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Blocks from '../../hardhat/artifacts/hardhat/contracts/Blocks.sol/Blocks.json'
import USDC from '../../hardhat/artifacts/hardhat/contracts/Mocks/USDC.sol/USDC.json'

import { eDecimals } from '../util'

import BigNumber from 'bignumber.js'
const initPrices = new Array(100).fill(0.01)

const defaultState = {
  updateActiveAccount: (address) => console.error('setAccount is not defined'),
  blocksContract: undefined,
  usdcContract: undefined,
  accounts: undefined,
  activeAccount: undefined
}

const EthContext = createContext(defaultState)
const EthProvider = ({ children }) => {
  const [provider, setProvider] = useState(
    new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
  )

  const [accounts, setAccounts] = useState([])
  const [activeAccount, setActiveAccount] = useState('')
  const [signer, setSigner] = useState(provider.getSigner())
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

  useEffect(() => {
    provider.listAccounts().then((x) => {
      setActiveAccount(x[0])
      setAccounts(x)
    })
  }, [])

  const updateActiveAccount = useCallback(
    (account) => {
      setBlocksContract(blocksContract.connect(provider.getSigner(account)))
      setUsdcContract(usdcContract.connect(provider.getSigner(account)))
      setActiveAccount(account)
    },
    [blocksContract, usdcContract, provider]
  )
  // const getBalance = useCallback(address)

  useEffect(() => {
    console.log('value updated')
    setValue((value) => ({
      ...value,
      accounts,
      updateActiveAccount,
      activeAccount,
      blocksContract,
      usdcContract
    }))
  }, [accounts, updateActiveAccount, activeAccount])

  const [value, setValue] = useState({
    accounts,
    updateActiveAccount,
    activeAccount,
    blocksContract,
    usdcContract
  })

  return <EthContext.Provider value={value}>{children}</EthContext.Provider>
}

export { EthContext, EthProvider, eDecimals }
