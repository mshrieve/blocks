import React from 'react'
import d3 from 'd3'

const Bar = ({ x, y, width, height }) => {
  let style = {
    fill: 'steelblue'
  }

  return (
    <g>
      <rect
        className="bar"
        style={style}
        x={x}
        y={y + 5}
        width={width}
        height={height}
      />
    </g>
  )
}

const YAxis = ({ end, labels, y, start }) => {
  const style = {
    stroke: 'steelblue',
    strokeWidth: '1px'
  }

  const textStyle = {
    fontSize: '0.8em',
    fill: 'steelblue'
    // textAnchor: 'end'
  }

  //D3 mathy bits
  const ticks = d3.range(0, end, end / labels.length)
  const percentage = d3.format('.0%')

  const lines = ticks.map((tick) => (
    <line style={style} y1={tick} x1={y} y2={tick} x2={y - 4} />
  ))

  const columnLables = ticks.map((tick, index) => (
    <text style={textStyle} y={tick + 6} x={y - 6} font-family="Verdana">
      {percentage(labels[index])}
    </text>
  ))

  return (
    <g>
      <g className="y_labels" transform={`translate(${-5},${17})`}>
        <line x1={y} y1={start} y2={end} x2={y} style={style} />
      </g>
      <g className="y_labels" transform={`translate(${-5},${51})`}>
        {columnLables}
        {lines}
      </g>
    </g>
  )
}

const XAxis = ({ start, end, labels, x }) => {
  const style = {
    stroke: 'steelblue',
    strokeWidth: '1px'
  }

  const step = start + end / labels.length

  //D3 mathy bits
  let ticks = d3.range(start, end, step)

  const lines = ticks.map((tick) => (
    <line style={style} x1={tick + 10} y1={x} x2={tick + 10} y2={x + 4} />
  ))

  const columnLables = ticks.map((tick, index) => (
    <text
      style={{ fill: 'steelblue' }}
      x={tick + 5}
      y={x + 20}
      font-family="Verdana"
      font-size="55"
    >
      {labels[index]}
    </text>
  ))

  return (
    <g>
      <line x1={start} y1={x} x2={end} y2={x} style={style} />
      {columnLables}
      {lines}
    </g>
  )
}

const ReactChart = ({
  data,
  width: rawWidth,
  height: rawHeight
}: {
  data: {
    frequency: number
    letter
  }[]
  width
  height
}) => {
  const margin = { top: 20, right: 20, bottom: 30, left: 45 }
  const width = rawWidth - margin.left - margin.right
  const height = rawHeight - margin.top - margin.bottom

  const letters = data.map((d) => d.letter)

  //D3 mathy bits
  let ticks = d3.range(0, width, width / data.length)
  let x = d3.scaleOrdinal().domain(letters).range(ticks)
  let y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.frequency)])
    .range([height, 0])

  let bottom = 450

  const bars = data.map((datum, index) => (
    <Bar
      key={index}
      x={x(datum.letter)}
      y={bottom - 6 - (height - y(datum.frequency))}
      width={20}
      height={height - y(datum.frequency)}
    />
  ))

  return (
    <svg width={width} height={height}>
      <YAxis y={40} labels={y.ticks().reverse()} start={15} end={height} />

      <g
        className="chart"
        transform={`translate(${margin.left},${margin.top})`}
      >
        {bars}
        <XAxis x={bottom} labels={letters} start={0} end={width} />
      </g>
    </svg>
  )
}

export default ReactChart
