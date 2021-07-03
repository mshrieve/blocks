import { BigNumber } from 'bignumber.js'
import { useEffect, useState } from 'react'
import { render18, eDecimals } from '../util'
import { useBlocks } from '../hooks/useBlocks'
import { useData } from '../hooks/useData'
import { resourceLimits } from 'worker_threads'

export const Slope = ({}) => {
  const [inputs, setInputs] = useState({
    bucket: 0,
    amount: 0
  })
  const { handlePurchaseLeftSlope } = useBlocks()
  const { priceData } = useData()
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

    const x = priceData
      .slice(0, inputs.bucket)
      .map((p, i) => {
        const result = amountIncrement.times(inputs.bucket - i).times(p)
        console.log(render18(result))
        return result
      })
      .reduce((acc, cur) => acc.plus(cur), new BigNumber(0))
    setPrice(x)
  }, [priceData, inputs])

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
        onClick={() => handlePurchaseLeftSlope(inputs.bucket, inputs.amount)}
      >
        slope
      </button>
    </section>
  )
}
