import { Range } from './Range'
import { Slope } from './Slope'
import { Purchase } from './Purchase'
import { Wallet } from './Wallet'

const Controls = ({ data, actions, roundContract }) => {
  return (
    <section>
      <Purchase data={data} actions={actions} />
      <Wallet roundContract={roundContract} />
      <Range data={data} actions={actions} />
      <Slope data={data} actions={actions} />
    </section>
  )
}

export { Controls }
