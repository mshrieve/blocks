import { useContext, useState, useEffect, useCallback } from 'react'
import { ChartContext } from '../context/chart'

const labels = new Array(100).fill('').map((_, i) => i * 50)

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

const positionOptions = {
  scales: {
    y: {
      type: 'linear',
      beginAtZero: true,
      max: 100000,
      grid: {
        drawBorder: false
      }
    }
  }
}

const setPrices = (current, data) => {
  current.data.datasets[0].data = data
  // current.options = priceOptions
  current.update()
}

const setPositions = (current, data) => {
  current.data.datasets[0].data = data
  // current.options = positionOptions
  current.update()
}

export const useDatasets = ({ view, positions, prices }) => {
  const { chartRef } = useContext(ChartContext)

  useEffect(() => {
    if (chartRef && chartRef.current) {
      console.log('view', view, prices, positions)
      if (view == 'prices') setPrices(chartRef.current, prices)
      else if (view == 'positions') setPositions(chartRef.current, positions)
    }
  }, [chartRef, view, positions, prices])
}
