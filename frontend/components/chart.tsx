import { Bar } from 'react-chartjs-2'

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react'
import { ChartContext } from '../context/chart'

const options = {
  scales: {
    y: {
      type: 'logarithmic',
      beginAtZero: true,
      max: 1
    }
  }
}

const data = {
  labels: new Array(100).fill('').map((_, i) => i),
  datasets: [
    {
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: new Array(100).fill(0.01)
    }
  ]
}

export const WrappedChart = () => {
  const { chartRef } = useContext(ChartContext)

  const Chart = useMemo(
    () =>
      ({ chartRef }) =>
        <Bar ref={chartRef} type="bar" data={data} options={options} />,
    []
  )

  return <Chart chartRef={chartRef} />
}
