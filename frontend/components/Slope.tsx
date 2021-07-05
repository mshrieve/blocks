import { BigNumber } from 'bignumber.js'
import { useEffect, useState } from 'react'
import { render18, eDecimals } from '../util'

export const Slope = ({ data, actions }) => {
  const [inputs, setInputs] = useState({
    bucket: 0,
    amount: 0
  })

  const handleChange = (e) =>
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value
    }))
  const [price, setPrice] = useState(new BigNumber(0))

  useEffect(() => {
    const amountIncrement = new BigNumber(inputs.amount)
      .times(eDecimals)
      .div(inputs.bucket)

    const x = data.prices
      .slice(0, inputs.bucket)
      .map((p, i) => {
        const result = amountIncrement.times(inputs.bucket - i).times(p)
        console.log(render18(result))
        return result
      })
      .reduce((acc, cur) => acc.plus(cur), new BigNumber(0))
    setPrice(x)
  }, [data.prices, inputs])

  return (
    <section className={'border'}>
      <h2>slope</h2>
      <input
        value={inputs.bucket}
        onChange={handleChange}
        type="number"
        id="bucket"
        name="bucket"
      />
      <input
        value={inputs.amount}
        onChange={handleChange}
        type="number"
        id="amount"
        name="amount"
      />
      <br />
      <span>price: {render18(price)}</span>
      <button
        onClick={() =>
          actions.handlePurchaseLeftSlope(inputs.bucket, inputs.amount)
        }
      >
        slope
      </button>
    </section>
  )
}
