import { useEffect, useState, useContext } from 'react'
import { BlocksContext } from '../context/blocks'
import config from '../config.json'
import { useBalances } from '../hooks/useBalances'

export const Balances = ({}) => {
  const { contract, lastTxTime } = useContext(BlocksContext)
  const balances = useBalances({ contract, lastTxTime })

  return (
    <section>
      {[1, 2, 3, 4].map((i) => (
        <span key={i}>{balances[i]}</span>
      ))}
    </section>
  )
}
