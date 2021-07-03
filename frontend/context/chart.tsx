// this is just for the chart ref :()

import { createContext, useCallback, useState, useRef, useEffect } from 'react'

const defaultState = {
  chartRef: undefined,
  setData: (data, index) => console.error('setData is not defined'),
  setOptions: (options) => console.error('setOptions is not defined'),
  data: undefined
}

const data = {
  labels: new Array(100).fill('').map((_, i) => i * 50),
  datasets: [
    {
      backgroundColor: 'rgba(100,99,132,0.2)',
      borderColor: 'rgba(100,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: new Array(100).fill(0.01)
    }
  ]
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

  const setOptions = useCallback(
    (options) => {
      if (chartRef && chartRef.current) {
        chartRef.current.options = options
        chartRef.current.update()
      }
    },
    [chartRef]
  )

  return (
    <ChartContext.Provider
      value={{
        setData,
        setOptions,
        chartRef,
        data
      }}
    >
      {children}
    </ChartContext.Provider>
  )
}
