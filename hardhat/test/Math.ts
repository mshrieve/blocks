import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import BigNumber from 'bignumber.js'
import Decimal from 'decimal.js'
import { expect } from 'chai'
Decimal.set({ precision: 27, rounding: 3 })

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
      const actual = await Math.power_of_two_lookup(i)
      const expected = new BigNumber(2).exponentiatedBy(i)
      expect(actual.toString()).to.equal(expected.toString())
    }
  })

  it('Should get the correct exponent from the exponent table', async function () {
    // math.pow(2, 2**-(i+1))*10**18)
    const tableLength = 62
    const eDecimals = new Decimal('1e18')
    const fDecimals = new Decimal('1e-18')
    const two = new Decimal(2)
    for (let i = 0; i < tableLength; i++) {
      const actual = await Math.exponent_table_lookup(i)
      const expected = two
        .pow(two.pow(i).mul(fDecimals))
        .mul(eDecimals)
        .floor()
        .toString()
      expect(i + actual.toString()).to.equal(i + expected.toString())
    }
  })
})
