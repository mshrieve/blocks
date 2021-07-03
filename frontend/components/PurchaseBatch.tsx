import { BigNumber } from 'bignumber.js'
import { useEffect, useState, useContext } from 'react'
import { BlocksContext } from '../context/blocks'
const eDecimals = new BigNumber('10').pow(18)
import { renderBN } from '../util'
import { useBlocks } from '../hooks/useBlocks'

export const PurchaseBatch = ({}) => {
  const [inputs, setInputs] = useState({
    bucket: 0,
    amount: 0
  })
  const { prices, handlePurchaseLeftSlope, handlePurchaseLeftBlock } =
    useBlocks()

  const handleChange = (e) =>
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value
    }))
  const [slopePrice, setSlopePrice] = useState(new BigNumber(0))
  const [blockPrice, setBlockPrice] = useState(new BigNumber(0))

  useEffect(() => {
    const x = prices
      .slice(0, inputs.bucket)
      .reduce((acc, cur) => acc.plus(cur), new BigNumber(0))
      .times(inputs.amount)
      .times(eDecimals)
    setBlockPrice(x)
  }, [prices, inputs])

  useEffect(() => {
    const delta = 100
    const amountIncrement = new BigNumber(delta).times(inputs.amount)

    const x = prices
      .slice(0, inputs.bucket)
      .map((price, i) => amountIncrement.times(inputs.bucket - i).times(price))
      .reduce((acc, cur, i) => acc.plus(cur), new BigNumber(0))
      .times(inputs.amount)
      .times(eDecimals)
    setSlopePrice(x)
  }, [prices, inputs])

  return (
    <section>
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
      <span>slope price: {renderBN(slopePrice)}</span>
      <button
        onClick={() => handlePurchaseLeftSlope(inputs.bucket, inputs.amount)}
      >
        slope
      </button>
      <br />
      <span>block price: {renderBN(blockPrice)}</span>
      <button
        onClick={() => handlePurchaseLeftBlock(inputs.bucket, inputs.amount)}
      >
        block
      </button>
    </section>
  )
}
