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
  contract: undefined,
  accounts: undefined
}

export const BlocksContext = createContext(defaultState)
export const BlocksProvider = ({ children }) => {
  const [lastTxTime, setLastTxTime] = useState(0)
  const { chartRef } = useContext(ChartContext)

  const provider = new ethers.providers.JsonRpcProvider(
    'http://127.0.0.1:8545/'
  )
  const [accounts, setAccounts] = useState([])
  const [signer, setSigner] = useState(provider.getSigner())
  const [contract, setContract] = useState(
    new ethers.Contract(
      '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      Blocks.abi,
      signer
    )
  )

  useEffect(() => {
    provider.listAccounts().then((x) => setAccounts(x))
  }, [])

  const prices = usePrices({ chartRef, contract, lastTxTime })

  const handlePurchase = useCallback(async (bucket, amount) => {
    const purchase = await contract.purchase(bucket, amount)
    const receipt = await purchase.wait()
    console.log(receipt)
    setLastTxTime((x) => x + 1)
  }, [])

  // const getBalance = useCallback(address)

  useEffect(() => {
    console.log('value updated')
    setValue((value) => ({
      ...value,
      handlePurchase,
      prices,
      lastTxTime,
      contract,
      accounts
    }))
  }, [prices, handlePurchase, lastTxTime, contract, accounts])

  const [value, setValue] = useState({
    handlePurchase,
    prices,
    lastTxTime,
    contract,
    accounts
  })

  return (
    <BlocksContext.Provider value={value}>{children}</BlocksContext.Provider>
  )
}
