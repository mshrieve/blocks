import { useEffect, useState, useContext } from 'react'
import { BlocksContext } from '../context/blocks'
import { useBalances } from '../hooks/useBalances'

export const Balances = ({}) => {
  const { accounts, contract, lastTxTime, contractAddress } =
    useContext(BlocksContext)
  const balances = useBalances({ accounts, contract, lastTxTime })

  return (
    <section>
      <span>{contractAddress}</span>
      {[0, 1, 2, 3].map((i) => (
        <>
          <span key={i}>
            balance {i}: {balances[i]}
          </span>
          <br />
        </>
      ))}
    </section>
  )
}
