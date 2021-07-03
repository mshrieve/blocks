import { useEffect, useState, useContext } from 'react'
import { BlocksContext } from '../context/blocks'
import { useBalances } from '../hooks/useBalances'
import { useUSDC } from '../hooks/useUSDC'
import { useBlocks } from '../hooks/useBlocks'
import { EthContext } from '../context/eth'
import BigNumber from 'bignumber.js'
import { renderBN } from '../util'
export const Balances = ({}) => {
  const { getBalance } = useUSDC()
  const { activeAccount } = useContext(EthContext)
  const [usdcBalance, setUSDCBalance] = useState(new BigNumber(0))

  useEffect(() => {
    getBalance(activeAccount).then((x: BigNumber) => setUSDCBalance(x))
  }, [activeAccount, getBalance])

  return (
    <section>
      <span>usdc balance: {renderBN(usdcBalance)}</span>
    </section>
  )
}
