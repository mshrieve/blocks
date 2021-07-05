import { useEffect, useState, useContext } from 'react'
import { useRoundBalance } from '../hooks/useRoundBalance'

import { useUSDC } from '../hooks/useUSDC'
import { EthContext } from '../context/eth'
import BigNumber from 'bignumber.js'
import { render18, renderUSDC } from '../util'
const eUSDCDecimals = new BigNumber('10').pow(6)

const Wallet = ({
  roundContract,
  totalBalance,
  redeemableBalance,
  handleSetActualPrice,
  actualPrice
}) => {
  const { getBalance, getAllowance, handleApprove } = useUSDC()

  const { activeAccount, lastTxTime } = useContext(EthContext)
  const [usdcBalance, setUSDCBalance] = useState(new BigNumber(0))
  const [usdcAllowance, setUSDCAllowance] = useState(new BigNumber(0))

  const [inputs, setInputs] = useState({
    approval: 0
  })

  const handleChange = (e) =>
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value
    }))
  useEffect(() => {
    console.log('Wallet', activeAccount, lastTxTime)
    if (
      activeAccount != undefined &&
      roundContract != undefined &&
      activeAccount.length > 0
    ) {
      getBalance(activeAccount)
        .then((x: BigNumber) => new BigNumber(x.toString()))
        .then((x) => setUSDCBalance(x))

      getAllowance(activeAccount, roundContract.address)
        .then((x: BigNumber) => new BigNumber(x.toString()))
        .then((x) => setUSDCAllowance(x))
    }
  }, [activeAccount, getBalance, lastTxTime])

  return (
    <section className="border">
      <h2>wallet</h2>
      {/* <span>
        redeemable balance at price {actualPrice}:{' '}
        {redeemableBalance.toString()}
      </span>
      <br />
      set actual price:
      <input
        value={actualPrice}
        onChange={handleSetActualPrice}
        type="number"
        id="price"
        name="price"
      /> */}
      <span>total token balance: {render18(totalBalance)}</span>
      <br />
      <span>usdc balance: {renderUSDC(usdcBalance)}</span>
      <br />
      <span>usdc allowance: {renderUSDC(usdcAllowance)}</span>
      <input
        value={inputs.approval}
        onChange={handleChange}
        type="number"
        id="approval"
        name="approval"
      />
      <button
        onClick={() =>
          handleApprove(
            eUSDCDecimals.times(inputs.approval).toString(),
            roundContract.address
          )
        }
      >
        approve
      </button>
    </section>
  )
}

export { Wallet }
