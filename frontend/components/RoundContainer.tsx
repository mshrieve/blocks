import {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext
} from 'react'
import { ethers } from 'ethers'
import { useAssetPrice } from '../hooks/useAssetPrice'
import { useEth } from '../context/eth'
import { useRoundData } from '../hooks/useRoundData'
import { ChartControl } from '../components/ChartControl'
import { useRoundBalance } from '../hooks/useRoundBalance'
import { useRoundActions } from '../hooks/useRoundActions'
import Round from '../../hardhat/artifacts/hardhat/contracts/Round.sol/Round.json'
import { Controls } from './Controls'
import { ChartContext } from '../context/chart'

const defaultState = {
  view: undefined,
  handleSetView: (e) => console.error(''),
  data: undefined,
  roundContract: undefined,
  actions: undefined
}

const priceOptions = {
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true,
      type: 'logarithmic',
      beginAtZero: true,
      max: 1,
      grid: {
        drawBorder: false,
        color: (context) => {
          if ([0.001, 0.01, 0.1, 1].includes(context.tick.value)) return 'black'
        }
      }
    }
  }
}

const positionOptions = (max) => ({
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      type: 'linear',
      beginAtZero: true,
      max,
      grid: {
        drawBorder: false
      }
    }
  }
})

const setPrices = (current, data) => {
  current.data.datasets[0].data = data
  current.options = priceOptions
  current.update()
}

const setPositions = (current, data) => {
  if (data.length == 100) {
    current.data.datasets[0].data = data
    const max = Math.max(1000, ...data)
    current.options = positionOptions(max)
    current.update()
  }
}

export const RoundContainer = () => {
  const assetPrice = useAssetPrice()
  const { chartRef } = useContext(ChartContext)
  const { signer } = useEth()
  const [roundContract, setRoundContract] = useState(undefined)
  const [actualPrice, setActualPrice] = useState(0)
  useEffect(() => {
    const roundAddress = process.env.NEXT_PUBLIC_ROUND_ADDRESS
    if (roundAddress != undefined)
      setRoundContract(new ethers.Contract(roundAddress, Round.abi, signer))
  }, [])
  const [view, setView] = useState('prices')

  const handleSetView = useCallback((e) => setView(e.target.value), [setView])

  const handleSetActualPrice = useCallback(
    (e) => setActualPrice(e.target.value),
    [setActualPrice]
  )
  const { prices, positions } = useRoundData(roundContract)

  const actions = useRoundActions(roundContract)
  const { redeemableBalance, totalBalance } = useRoundBalance(
    roundContract,
    actualPrice
  )
  useEffect(() => {
    console.log('view', view, prices, positions)
    if (chartRef && chartRef.current) {
      if (view == 'prices') setPrices(chartRef.current, prices)
      else if (view == 'positions' && positions != undefined)
        setPositions(chartRef.current, positions)
    }
  }, [view, positions, prices])

  useEffect(() => console.log('view', view), [view])
  return (
    <span>
      <select onChange={handleSetView} value={view} name="view" id="view">
        {['prices', 'positions'].map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      <Controls
        handleSetActualPrice={handleSetActualPrice}
        actualPrice={actualPrice}
        data={{ prices, positions }}
        actions={actions}
        roundContract={roundContract}
        totalBalance={totalBalance}
        redeemableBalance={redeemableBalance}
      />
    </span>
  )
}
