import { useContext, useState, useEffect, useCallback } from 'react'
import { ChartContext } from '../context/chart'

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

export const useDatasets = () => {
  return { handleToggle }
}
