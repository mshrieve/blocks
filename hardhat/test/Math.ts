import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import BigNumber from 'bignumber.js'
import { expect } from 'chai'

describe('Math', function () {
  let accounts: Signer[]
  let Math: Contract

  before(async () => {
    const [owner] = await ethers.getSigners()
    const MathFactory = await ethers.getContractFactory('MathHarness')
    Math = await MathFactory.deploy()
    await Math.deployed()
  })

  it('Should get powers of two', async function () {
    const tableLength = 62
    for (let i = 0; i < tableLength; i++) {
      const result = await Math.power_of_two_lookup(i)
      const expected = new BigNumber(2).exponentiatedBy(i)
      expect(result.toString()).to.equal(expected.toString())
    }
  })

  it('Should get the correct exponent from the exponent table', async function () {
    // math.pow(2, 2**-(i+1))*10**18)
    const tableLength = 62
    const eDecimals = new BigNumber(10).exponentiatedBy(18)

    for (let i = 0; i < tableLength; i++) {
      const result = await Math.exponent_table_lookup(i)
      const expected = new BigNumber(2)
        .exponentiatedBy(-(i + 1))
        .multipliedBy(eDecimals)
        .integerValue()
      expect(result.toString()).to.equal(expected.toString())
    }
  })
})
