import { useEffect, useState } from 'react'
import { useEth } from '../context/eth'
import { useController } from '../hooks/useController'

export const Controller = () => {
  const { rounds, vaultAddress, handleCreateRound } = useController()
  const { usdcContract } = useEth()
  const [inputs, setInputs] = useState({
    N: 100,
    b: 5000,
    delta: 100,
    usdcAddress: usdcContract.address,
    vaultAddress
  })

  const handleChange = (e) =>
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value
    }))
  return (
    <section className={'border'}>
      <h2>controller</h2>
      <span>vault address: {vaultAddress}</span>
      <br />
      <span>rounds: {rounds}</span>
      <br />
      N:{' '}
      <input
        value={inputs.N}
        onChange={handleChange}
        type="number"
        id="N"
        name="N"
      />
      <br />
      b:{' '}
      <input
        value={inputs.b}
        onChange={handleChange}
        type="number"
        id="b"
        name="b"
      />
      delta:{' '}
      <input
        value={inputs.delta}
        onChange={handleChange}
        type="number"
        id="delta"
        name="delta"
      />
      <button
        onClick={() =>
          handleCreateRound(
            inputs.N,
            inputs.b,
            inputs.delta,
            inputs.usdcAddress,
            inputs.vaultAddress
          )
        }
      >
        create round
      </button>
    </section>
  )
}
