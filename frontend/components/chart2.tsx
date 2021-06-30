import { Component, createRef } from 'react'
import {
  BarController,
  CategoryScale,
  BarElement,
  LinearScale,
  LogarithmicScale,
  Chart
} from 'chart.js'
Chart.register(
  BarController,
  LogarithmicScale,
  BarElement,
  CategoryScale,
  LinearScale
)
// BarChart

type State = {
  canvasRef: any
  myChart: any
}

type Props = {
  prices: number[]
  labels: number[]
}

export class BarChart extends Component<Props, State> {
  canvasRef
  myChart

  constructor(props) {
    super(props)
    this.canvasRef = createRef()
  }

  componentDidUpdate() {
    console.log('updating')
    this.myChart.data.datasets[0].data = this.props.prices
    this.myChart.update()
  }

  componentDidMount() {
    this.myChart = new Chart(this.canvasRef.current, {
      type: 'bar',
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            max: 1
          }
        }
      },
      data: {
        labels: this.props.labels,
        datasets: [
          {
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: this.props.prices
          }
        ]
      }
    })
  }

  render() {
    return <canvas ref={this.canvasRef} />
  }
}
