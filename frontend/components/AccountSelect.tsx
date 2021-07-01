import { useState, useContext, useCallback } from 'react'
import { BlocksContext } from '../context/blocks'

export const AccountSelect = ({}) => {
  const { accounts } = useContext(BlocksContext)
  const [account, setAccount] = useState(accounts[0])
  const handleChange = useCallback((e) => setAccount(e.target.value), [])
  return (
    <select onChange={handleChange} value={account} name="pets" id="pet-select">
      {accounts.map((a) => (
        <option value={a}>{a}</option>
      ))}
    </select>
  )
}
