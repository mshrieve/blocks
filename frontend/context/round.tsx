// this is just for the chart ref :()

import {
  useContext,
  createContext,
  useCallback,
  useState,
  useEffect
} from 'react'
import { ChartContext } from './chart'
import { usePriceData } from '../hooks/usePriceData'
import { usePositionData } from '../hooks/usePositionData'
import { useAssetPrice } from '../hooks/useAssetPrice'

const defaultState = {
  view: undefined,
  handleSetView: (e) => console.error(''),
  priceData: undefined,
  positionData: undefined
}

const priceOptions = {
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true,
      type: 'logarithmic',
      beginAtZero: true,
      max: 1,
      grid: {
        drawBorder: false,
        color: (context) => {
          if ([0.001, 0.01, 0.1, 1].includes(context.tick.value)) return 'black'
        }
      }
    }
  }
}

const assetPriceDataset = {
  backgroundColor: 'rgba(0,99,132,0.2)',
  borderColor: 'rgba(100,99,132,1)',
  borderWidth: 0.5,
  hoverBackgroundColor: 'rgba(255,99,132,0.4)',
  hoverBorderColor: 'rgba(255,99,132,1)',
  data: new Array(100).fill(0)
}

const positionOptions = (max) => ({
  scales: {
    y: {
      type: 'linear',
      beginAtZero: true,
      max: max ? max : 100000,
      grid: {
        drawBorder: false
      }
    }
  }
})

const labels = new Array(100).fill('').map((_, i) => i * 50)
export const RoundContext = createContext(defaultState)
export const RoundProvider = ({ children }) => {
  const [view, setView] = useState('priceData')
  const assetPrice = useAssetPrice()
  const { setData } = useContext(ChartContext)

  const priceData = usePriceData()
  const positionData = usePositionData()
  const [priceDatasets, setPriceDatasets] = useState([])
  const [positionDatasets, setPositionDatasets] = useState([])

  useEffect(
    () =>
      setPriceDatasets([
        {
          backgroundColor: 'rgba(100,99,132,0.2)',
          borderColor: 'rgba(100,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: priceData
        },
        // current asset price
        {
          backgroundColor: 'rgba(0,99,132,0.2)',
          borderColor: 'rgba(100,99,132,1)',
          borderWidth: 0,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: [...new Array(20).fill(0), 1, ...new Array(79).fill(0)]
        }
      ]),
    [priceData]
  )

  useEffect(
    () =>
      setPositionDatasets([
        {
          backgroundColor: 'rgba(100,99,132,0.2)',
          borderColor: 'rgba(100,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: positionData
        }
      ]),
    [positionData]
  )

  useEffect(() => {
    console.log(priceDatasets, positionDatasets)
    if (view == 'priceData') {
      setData(priceDatasets, priceOptions)
    } else if (view == 'positionData') {
      // compute the maximum price, and increase by 20%
      const max =
        1.2 *
        positionData
          .map((x) => parseInt(x))
          .reduce((acc, cur) => (acc > cur ? acc : cur), 0)
      setData(positionDatasets, positionOptions(max))
    }
  }, [view, positionData, priceData])

  const handleSetView = useCallback((e) => setView(e.target.value), [setView])

  return (
    <RoundContext.Provider
      value={{
        handleSetView,
        view,
        priceData,
        positionData
      }}
    >
      {children}
    </RoundContext.Provider>
  )
}
