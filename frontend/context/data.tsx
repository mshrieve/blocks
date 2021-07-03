// this is just for the chart ref :()

import {
  useContext,
  createContext,
  useCallback,
  useState,
  useEffect
} from 'react'
import { ChartContext } from '../context/chart'
import { EthContext, eDecimals } from '../context/eth'
import { usePriceData } from '../hooks/usePriceData'
import { usePositionData } from '../hooks/usePositionData'

const defaultState = {
  view: undefined,
  handleSetView: (e) => console.error(''),
  priceData: undefined,
  positionData: undefined
}

const priceOptions = {
  scales: {
    y: {
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

const positionOptions = (positions) => ({
  scales: {
    y: {
      type: 'linear',
      beginAtZero: true,
      max: positions[0],
      grid: {
        drawBorder: false
      }
    }
  }
})

export const DataContext = createContext(defaultState)
export const DataProvider = ({ children }) => {
  const [view, setView] = useState('priceData')

  const { setData, setOptions } = useContext(ChartContext)

  const priceData = usePriceData()
  const positionData = usePositionData()

  useEffect(() => {
    if (view == 'priceData') {
      setData(priceData, 0)
      setOptions(priceOptions)
    } else if (view == 'positionData') {
      setData(positionData, 0)
      setOptions(positionOptions(positionData))
    }
  }, [view, positionData, priceData])

  const handleSetView = useCallback((e) => setView(e.target.value), [setView])

  return (
    <DataContext.Provider
      value={{
        handleSetView,
        view,
        priceData,
        positionData
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
