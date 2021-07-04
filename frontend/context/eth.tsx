import {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext
} from 'react'
import { Contract, ethers } from 'ethers'
import Blocks from '../../hardhat/artifacts/hardhat/contracts/Blocks.sol/Blocks.json'
import USDC from '../../hardhat/artifacts/hardhat/contracts/Mocks/USDC.sol/USDC.json'
import Controller from '../../hardhat/artifacts/hardhat/contracts/Controller.sol/Controller.json'

import { eDecimals } from '../util'

const initPrices = new Array(100).fill(0.01)

const defaultState = {
  updateActiveAccount: (address) => console.error('setAccount is not defined.'),
  handleTransaction: async (contract, method, args) => ({
    logs: []
  }),
  usdcContract: undefined,
  controllerContract: undefined,
  accounts: undefined,
  activeAccount: undefined,
  lastTxTime: undefined,
  signer: undefined
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
  const [controllerContract, setControllerContract] = useState(
    new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS,
      Controller.abi,
      signer
    )
  )
  const [rounds, setRounds] = useState([])
  const [vaultAddress, setVaultAddress] = useState('')
  useEffect(() => {
    if (controllerContract != undefined)
      controllerContract.getRounds().then((x) => setRounds(x))
  }, [controllerContract, lastTxTime])
  useEffect(() => {
    if (controllerContract != undefined)
      controllerContract.getVaultAddress().then((x) => setVaultAddress(x))
  }, [controllerContract])

  const [usdcContract, setUsdcContract] = useState(
    new ethers.Contract(process.env.NEXT_PUBLIC_USDC_ADDRESS, USDC.abi, signer)
  )

  const updateActiveAccount = useCallback(
    (account) => {
      const updatedSigner = provider.getSigner(account)
      setSigner(updatedSigner)
      updatedSigner.getAddress().then((x) => setActiveAccount(x))
    },
    [usdcContract, provider]
  )

  const handleTransaction = useCallback(
    async (contract, method, args) => {
      const transaction = await contract.connect(signer)[method](...args)
      const receipt = await transaction.wait()
      setLastTxTime((x) => x + 1)
      return receipt
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
      signer,
      usdcContract,
      lastTxTime,
      handleTransaction
    }))
  }, [
    accounts,
    updateActiveAccount,
    activeAccount,
    signer,
    usdcContract,
    lastTxTime,
    handleTransaction
  ])

  const [value, setValue] = useState({
    accounts,
    updateActiveAccount,
    activeAccount,
    signer,
    usdcContract,
    controllerContract,
    lastTxTime,
    handleTransaction
  })

  return <EthContext.Provider value={value}>{children}</EthContext.Provider>
}

const useEth = () => useContext(EthContext)
export { EthContext, EthProvider, eDecimals, useEth }
