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

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
const signer = provider.getSigner()
const contract = new ethers.Contract(
  '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  Blocks.abi,
  signer
)
import BigNumber from 'bignumber.js'
const eDecimals = new BigNumber('10').pow(18)
const initPrices = new Array(100).fill(0.01)

const defaultState = {
  prices: initPrices,
  lastTxTime: 0,
  handlePurchase: async (bucket, amount) =>
    console.error('handlePurchase is undefined.'),
  getData: (canvas) => console.error('getData is undefined.')
}

export const BlocksContext = createContext(defaultState)
export const BlocksProvider = ({ children }) => {
  const [value, setValue] = useState(defaultState)
  const [prices, setPrices] = useState(initPrices)
  const [lastTxTime, setLastTxTime] = useState(0)
  const { chartRef } = useContext(ChartContext)
  // get prices
  useEffect(() => {
    Promise.all(
      initPrices.map((_, i) =>
        contract
          .get_bucket_price(i)
          .then((x: ethers.BigNumber) =>
            new BigNumber(x.toString()).div(eDecimals).toString()
          )
      )
    ).then((p) => setPrices(p))
  }, [lastTxTime])

  const handlePurchase = useCallback(async (bucket, amount) => {
    const purchase = await contract.purchase(bucket, amount)
    const receipt = await purchase.wait()
    console.log(receipt)
    setLastTxTime((x) => x + 1)
  }, [])

  useEffect(() => {
    if (chartRef && chartRef.current) {
      console.log(chartRef.current)
      console.log(chartRef.current.data)
      chartRef.current.data.datasets[0].data = prices
      chartRef.current.update()
    }
  }, [prices])

  const getData = useCallback(
    (canvas: any) => ({
      labels: new Array(100).fill('').map((_, i) => i),
      datasets: [
        {
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: prices
        }
      ]
    }),
    [prices]
  )

  useEffect(() => {
    console.log('value updated')
    setValue((value) => ({
      ...value,
      handlePurchase,
      prices,
      getData,
      lastTxTime
    }))
  }, [prices, getData, handlePurchase, lastTxTime])

  return (
    <BlocksContext.Provider value={value}>{children}</BlocksContext.Provider>
  )
}
