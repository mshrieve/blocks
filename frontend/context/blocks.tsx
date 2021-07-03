import {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect
} from 'react'
import { ethers, utils } from 'ethers'
import Blocks from '../../hardhat/artifacts/hardhat/contracts/Blocks.sol/Blocks.json'
import { ChartContext } from '../context/chart'
import { usePrices } from '../hooks/usePrices'
import BigNumber from 'bignumber.js'
const eDecimals = new BigNumber('10').pow(18)
const initPrices = new Array(100).fill(0.01)

const defaultState = {
  prices: initPrices,
  lastTxTime: 0,
  handlePurchase: async (bucket, amount) =>
    console.error('handlePurchase is undefined.'),
  handlePurchaseLeftSlope: async (bucket, amount) =>
    console.error('handlePurchaseBatch is undefined.'),
  handlePurchaseLeftBlock: async (bucket, amount) =>
    console.error('handlePurchaseBatch is undefined.'),
  updateActiveAccount: (address) => console.error('setAccount is not defined'),
  contract: undefined,
  accounts: undefined,
  activeAccount: undefined,
  contractAddress: ''
}

export const BlocksContext = createContext(defaultState)
export const BlocksProvider = ({ children }) => {
  const [lastTxTime, setLastTxTime] = useState(0)
  const { chartRef } = useContext(ChartContext)

  const [provider, setProvider] = useState(
    new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
  )

  const [accounts, setAccounts] = useState([])
  const [activeAccount, setActiveAccount] = useState('')
  const [signer, setSigner] = useState(provider.getSigner())
  console.log(process.env.NEXT_PUBLIC_BLOCKS_ADDRESS)
  const [contract, setContract] = useState(
    new ethers.Contract(
      process.env.NEXT_PUBLIC_BLOCKS_ADDRESS,
      Blocks.abi,
      signer
    )
  )
  const [contractAddress, setContractAddress] = useState(contract.address)

  useEffect(() => {
    provider.listAccounts().then((x) => {
      setActiveAccount(x[0])
      setAccounts(x)
    })
  }, [])

  const prices = usePrices({ contract, lastTxTime })

  const handlePurchase = useCallback(
    async (bucket, amount) => {
      const purchase = await contract.purchase(
        bucket,
        eDecimals.times(amount).toFixed()
      )
      const receipt = await purchase.wait()
      console.log(receipt.gasUsed.toString())
      setLastTxTime((x) => x + 1)
    },
    [contract]
  )

  const handlePurchaseLeftSlope = useCallback(
    async (bucket, amount) => {
      // const batch = new Array(10).fill(undefined).map((_, i) => i)
      // const amounts = new Array(10).fill(undefined).map((_, i) => 1000 * (10 - i))
      const purchase = await contract.purchaseLeftSlope(
        bucket,
        eDecimals.times(amount).toFixed()
      )
      const receipt = await purchase.wait()
      console.log(receipt.gasUsed.toString())
      setLastTxTime((x) => x + 1)
    },
    [contract]
  )

  const handlePurchaseLeftBlock = useCallback(
    async (bucket, amount) => {
      // const batch = new Array(10).fill(undefined).map((_, i) => i)
      // const amounts = new Array(10).fill(undefined).map((_, i) => 1000 * (10 - i))
      const purchase = await contract.purchaseLeftBlock(
        bucket,
        eDecimals.times(amount).toFixed()
      )
      const receipt = await purchase.wait()
      console.log(receipt.gasUsed.toString())
      setLastTxTime((x) => x + 1)
    },
    [contract]
  )

  const updateActiveAccount = useCallback(
    (account) => {
      setContract(contract.connect(provider.getSigner(account)))
      setActiveAccount(account)
    },
    [contract, provider]
  )
  // const getBalance = useCallback(address)

  useEffect(() => {
    console.log('value updated')
    setValue((value) => ({
      ...value,
      handlePurchase,
      prices,
      lastTxTime,
      contract,
      accounts,
      updateActiveAccount,
      activeAccount,
      handlePurchaseLeftSlope,
      handlePurchaseLeftBlock,
      contractAddress
    }))
  }, [
    prices,
    handlePurchase,
    lastTxTime,
    contract,
    accounts,
    updateActiveAccount,
    activeAccount,
    handlePurchaseLeftSlope,
    handlePurchaseLeftBlock,
    contractAddress
  ])

  const [value, setValue] = useState({
    handlePurchase,
    prices,
    lastTxTime,
    contract,
    accounts,
    updateActiveAccount,
    activeAccount,
    handlePurchaseLeftSlope,
    handlePurchaseLeftBlock,
    contractAddress
  })

  return (
    <BlocksContext.Provider value={value}>{children}</BlocksContext.Provider>
  )
}
