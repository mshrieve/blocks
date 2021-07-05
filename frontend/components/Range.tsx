import { BigNumber } from 'bignumber.js'
import { useEffect, useState } from 'react'
import { render18, eDecimals } from '../util'

export const Range = ({ data, actions }) => {
  const [inputs, setInputs] = useState({
    start: 0,
    end: 0,
    amount: 0
  })

  const handleChange = (e) =>
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value
    }))
  const [price, setPrice] = useState(new BigNumber(0))

  useEffect(() => {
    const x = data.prices
      .slice(inputs.start, inputs.end)
      .reduce((acc, cur) => acc.plus(cur), new BigNumber(0))
      .times(inputs.amount)
      .times(eDecimals)
    setPrice(x)
  }, [data.prices, inputs])

  return (
    <section className={'border'}>
      <h2>range</h2>
      <input
        value={inputs.start}
        onChange={handleChange}
        type="number"
        id="start"
        name="start"
      />
      <input
        value={inputs.end}
        onChange={handleChange}
        type="number"
        id="end"
        name="end"
      />
      <input
        value={inputs.amount}
        onChange={handleChange}
        type="number"
        id="amount"
        name="amount"
      />
      <br />
      <span>block price: {render18(price)}</span>
      <button
        onClick={() =>
          actions.handlePurchaseRange(inputs.start, inputs.end, inputs.amount)
        }
      >
        block
      </button>
    </section>
  )
}
