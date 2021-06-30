import { useEffect, useState, useContext } from 'react'
import { BlocksContext } from '../context/blocks'

export const Purchase = ({}) => {
  const [inputs, setInputs] = useState({
    bucket: 0,
    amount: 0
  })
  const { handlePurchase } = useContext(BlocksContext)
  const handleChange = (e) =>
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value
    }))
  return (
    <section>
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
      <button onClick={() => handlePurchase(inputs.bucket, inputs.amount)}>
        purchase
      </button>
    </section>
  )
}
