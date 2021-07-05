import { useState, useEffect, useCallback, useContext } from 'react'
import { useRoundData } from '../hooks/useRoundData'
const options = ['priceData', 'positionData']
const ChartControl = () => {
  const { view, handleSetView } = useRoundData()

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
