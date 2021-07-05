import { useState, useEffect, useCallback, useContext } from 'react'

const options = ['priceData', 'positionData']
const ChartControl = ({ view, handleSetView }) => {
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
