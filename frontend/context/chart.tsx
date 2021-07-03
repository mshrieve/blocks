// this is just for the chart ref :()

import { createContext, useCallback, useState, useRef, useEffect } from 'react'

const defaultState = {
  chartRef: undefined,
  setData: (data, index) => console.error('setData is not defined')
}

export const ChartContext = createContext(defaultState)
export const ChartProvider = ({ children }) => {
  const chartRef = useRef(null)

  const setData = useCallback(
    (data, index) => {
      if (chartRef && chartRef.current) {
        chartRef.current.data.datasets[index].data = data
        chartRef.current.update()
      }
    },
    [chartRef]
  )

  return (
    <ChartContext.Provider value={{ setData, chartRef }}>
      {children}
    </ChartContext.Provider>
  )
}
