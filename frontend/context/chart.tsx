import { createContext, useCallback, useState, useRef } from 'react'

const defaultState = {
  chartRef: undefined,
  setData: undefined
}

export const ChartContext = createContext(defaultState)
export const ChartProvider = ({ children }) => {
  const chartRef = useRef(null)

  const setData = useCallback(
    (datasets, options) => {
      if (chartRef && chartRef.current) {
        if (datasets) chartRef.current.data.datasets = datasets
        // if (options) chartRef.current.options = options
        chartRef.current.update()
      }
    },
    [chartRef]
  )

  return (
    <ChartContext.Provider
      value={{
        chartRef,
        setData
      }}
    >
      {children}
    </ChartContext.Provider>
  )
}
