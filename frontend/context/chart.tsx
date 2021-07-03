// this is just for the chart ref :()

import { createContext, useCallback, useState, useRef, useEffect } from 'react'

const defaultState = {
  chartRef: undefined,
  setData: (data, options) => console.error('setData is not defined'),
  data: undefined
}

const data = {
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
    (datasets, options) => {
      if (chartRef && chartRef.current) {
        if (data) chartRef.current.data.datasets = datasets
        if (options) chartRef.current.options = options
        chartRef.current.update()
      }
    },
    [chartRef]
  )

  return (
    <ChartContext.Provider
      value={{
        setData,
        chartRef,
        data
      }}
    >
      {children}
    </ChartContext.Provider>
  )
}
