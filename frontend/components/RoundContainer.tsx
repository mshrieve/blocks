import { createContext, useCallback, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useAssetPrice } from '../hooks/useAssetPrice'
import { useEth } from '../context/eth'
import { useRoundData } from '../hooks/useRoundData'
import { useDatasets } from '../hooks/useDatasets'
import { useRoundActions } from '../hooks/useRoundActions'
import { DatasetHandler } from './DatasetHandler'
import Round from '../../hardhat/artifacts/hardhat/contracts/Round.sol/Round.json'
import { Controls } from './Controls'
const defaultState = {
  view: undefined,
  handleSetView: (e) => console.error(''),
  data: undefined,
  roundContract: undefined,
  actions: undefined
}

export const RoundContainer = () => {
  const [view, setView] = useState('priceData')
  const assetPrice = useAssetPrice()

  const { signer } = useEth()
  const [roundContract, setRoundContract] = useState(undefined)
  useEffect(() => {
    const roundAddress = process.env.NEXT_PUBLIC_ROUND_ADDRESS
    if (roundAddress != undefined)
      setRoundContract(new ethers.Contract(roundAddress, Round.abi, signer))
  }, [])

  const data = useRoundData(roundContract)
  useEffect(() => console.log('datasets round: ', data), [data])

  const handleSetView = useCallback((e) => setView(e.target.value), [setView])
  const actions = useRoundActions(roundContract)

  return (
    <span>
      <Controls data={data} actions={actions} roundContract={roundContract} />{' '}
      <DatasetHandler {...data} />
    </span>
  )
}
