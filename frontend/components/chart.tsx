import { Bar } from 'react-chartjs-2'

import { useContext } from 'react'
import { ChartContext } from '../context/chart'

const options = {
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

const data = {
  labels: new Array(100).fill('').map((_, i) => i * 50),
  datasets: [
    {
      backgroundColor: 'rgba(100,99,132,0.2)',
      borderColor: 'rgba(100,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: new Array(100).fill(0)
    }
  ]
}

export const Chart = () => {
  const { chartRef } = useContext(ChartContext)
  return <Bar ref={chartRef} type="bar" data={data} options={options} />
}
