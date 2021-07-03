import { Range } from './Range'
import { Slope } from './Slope'
import { Purchase } from './Purchase'
import { Wallet } from './Wallet'

const Controls = () => {
  return (
    <section>
      <Purchase />
      <Wallet />
      <Range />
      <Slope />
    </section>
  )
}

export { Controls }
