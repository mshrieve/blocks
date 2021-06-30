// this is just for the chart ref :()

import { createContext, useCallback, useState, useRef, useEffect } from 'react'

const defaultState = {
  chartRef: undefined
}

export const ChartContext = createContext(defaultState)
export const ChartProvider = ({ children }) => {
  const chartRef = useRef(null)

  return (
    <ChartContext.Provider value={{ chartRef }}>
      {children}
    </ChartContext.Provider>
  )
}
