import { useEffect, useState, useContext } from 'react'
import { useBlocks } from '../hooks/useBlocks'
import { useData } from '../hooks/useData'
import { render18, eDecimals } from '../util'
import { BigNumber } from 'bignumber.js'

export const Purchase = ({}) => {
  const [inputs, setInputs] = useState({
    bucket: 0,
    amount: 0
  })
  const { handlePurchase } = useBlocks()
  const { priceData } = useData()
  const handleChange = (e) =>
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value
    }))
  const [price, setPrice] = useState(new BigNumber(0))

  useEffect(() => {
    const x = new BigNumber(priceData[inputs.bucket])
      .times(inputs.amount)
      .times(eDecimals)
    setPrice(x)
  }, [priceData, inputs])

  return (
    <section className="border">
      <h2>purchase</h2>
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
      <button onClick={() => handlePurchase(inputs.bucket, inputs.amount)}>
        purchase
      </button>
    </section>
  )
}
