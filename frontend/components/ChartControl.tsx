import { useState, useEffect, useCallback, useContext } from 'react'
import { DataContext } from '../context/data'
const options = ['priceData', 'positionData']
const ChartControl = () => {
  const { view, handleSetView } = useContext(DataContext)

  return (
    <section>
      <select
        onChange={handleSetView}
        value={view}
        name="accounts"
        id="account-select"
      >
        {options.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </section>
  )
}

export { ChartControl }
