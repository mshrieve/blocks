import { useState, useContext, useCallback, useEffect } from 'react'
import { EthContext } from '../context/eth'

export const AccountSelect = ({}) => {
  const { accounts, activeAccount, updateActiveAccount } =
    useContext(EthContext)

  const handleChange = useCallback(
    (e) => updateActiveAccount(e.target.value),
    [updateActiveAccount]
  )
  return (
    <section>
      <select
        onChange={handleChange}
        value={activeAccount}
        name="accounts"
        id="account-select"
      >
        {accounts.map((a) => (
          <option value={a}>{a}</option>
        ))}
      </select>
    </section>
  )
}
