import { Range } from './Range'
import { Slope } from './Slope'
import { Purchase } from './Purchase'
import { Wallet } from './Wallet'

const Controls = ({
  data,
  actions,
  roundContract,
  redeemableBalance,
  totalBalance,
  handleSetActualPrice,
  actualPrice
}) => {
  return (
    <section>
      <Wallet
        handleSetActualPrice={handleSetActualPrice}
        roundContract={roundContract}
        redeemableBalance={redeemableBalance}
        totalBalance={totalBalance}
        actualPrice={actualPrice}
      />
      <Purchase data={data} actions={actions} />
      <Range data={data} actions={actions} />
      <Slope data={data} actions={actions} />
    </section>
  )
}

export { Controls }
