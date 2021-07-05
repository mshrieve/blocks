import { useEffect, useState, useContext } from 'react'
import { useRoundData } from '../hooks/useRoundData'
import { render18, eDecimals } from '../util'
import { BigNumber } from 'bignumber.js'

export const Purchase = ({ data, actions }) => {
  const [inputs, setInputs] = useState({
    bucket: 0,
    amount: 0
  })

  useEffect(() => console.log('data', data), [data])
  const handleChange = (e) =>
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value
    }))
  const [price, setPrice] = useState(new BigNumber(0))

  useEffect(() => {
    const x = new BigNumber(data.prices[inputs.bucket])
      .times(inputs.amount)
      .times(eDecimals)
    setPrice(x)
  }, [data.prices, inputs])

  return (
    <section className="border">
      <h2>single block</h2>
      bucket:{' '}
      <input
        value={inputs.bucket}
        onChange={handleChange}
        type="number"
        id="bucket"
        name="bucket"
      />
      <br />
      amount:{' '}
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
        onClick={() => actions.handlePurchase(inputs.bucket, inputs.amount)}
      >
        purchase
      </button>
    </section>
  )
}
