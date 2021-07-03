import { useEffect, useState, useContext } from 'react'
import { useBlocksBalance } from '../hooks/useBlocksBalance'
import { useUSDC } from '../hooks/useUSDC'
import { EthContext } from '../context/eth'
import BigNumber from 'bignumber.js'
import { render18, renderUSDC } from '../util'
const eUSDCDecimals = new BigNumber('10').pow(6)
const Wallet = ({}) => {
  const { getBalance, getAllowance, handleApprove } = useUSDC()
  const blocksBalance = useBlocksBalance()
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
    if (activeAccount != undefined && activeAccount.length > 0) {
      getBalance(activeAccount)
        .then((x: BigNumber) => new BigNumber(x.toString()))
        .then((x) => setUSDCBalance(x))

      getAllowance(activeAccount)
        .then((x: BigNumber) => new BigNumber(x.toString()))
        .then((x) => setUSDCAllowance(x))
    }
  }, [activeAccount, getBalance, lastTxTime])

  return (
    <section className="border">
      <span>blocks balance: {render18(blocksBalance)}</span>
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
          handleApprove(eUSDCDecimals.times(inputs.approval).toString())
        }
      >
        approve
      </button>
    </section>
  )
}

export { Wallet }
