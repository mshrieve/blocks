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

export const useDatasets = ({ positions, prices }) => {
  const { chartRef } = useContext(ChartContext)

  useEffect(() => {
    if (chartRef && chartRef.current) {
      if (prices) chartRef.current.data.datasets[0].data = prices
      // if (options) chartRef.current.options = options
      chartRef.current.update()
    }
  }, [prices])

  const getPriceDatasets = useCallback(
    (data) => [
      {
        backgroundColor: 'rgba(100,99,132,0.2)',
        borderColor: 'rgba(100,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data
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
    ],
    []
  )

  const getPositionDatasets = useCallback(
    (data) => [
      {
        backgroundColor: 'rgba(100,99,132,0.2)',
        borderColor: 'rgba(100,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: data
      }
    ],
    []
  )

  const positionOptions = useCallback(
    (max) => ({
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
    }),
    []
  )
}
