import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import BigNumber from 'bignumber.js'
import Decimal from 'decimal.js'
import { expect } from 'chai'
Decimal.set({ precision: 27, rounding: 3 })
BigNumber.config({ EXPONENTIAL_AT: 256 })
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
      expect(actual.toString()).to.equal(expected.toString())
    }
  })

  it('Should exponentiate integers properly', async function () {
    const eDecimals = new BigNumber('1e18')
    const two = new BigNumber(2)

    // 10^18 < 2^60
    // so, 10^18 * 2^196 < 2^256
    for (let i = 0; i < 196; i++) {
      const actual = await Math.exponentiate(eDecimals.times(i).toString())
      const expected = two.pow(i).times(eDecimals)
      expect(actual.toString()).to.equal(expected.toString())
    }
  })

  it('Should exponentiate decimals properly', async function () {
    const eDecimals = new Decimal('1e18')
    const fDecimals = new Decimal('1e-18')
    const two = new Decimal(2)
    // we actually cannot expect the last few digits to be correct :(
    const errorMargin = new Decimal('20')
    for (let i = 0; i < 10; i++) {
      const result = await Math.exponentiate(i)
      const actual = new Decimal(result.toString()).div(errorMargin).floor()
      const expected = two
        .pow(fDecimals.times(i))
        .times(eDecimals)
        .div(errorMargin)
        .floor()

      expect(actual.toString()).to.equal(expected.toString())
    }
  })

  it('Should find the logarithm of powers of two', async function () {
    const eDecimals = new BigNumber('1e18')
    const two = new BigNumber(2)

    const errorMargin = new Decimal('20')
    for (let i = 0; i < 196; i++) {
      const actual = await Math.logarithm(
        two.pow(i).times(eDecimals).toString()
      )
      const expected = eDecimals.times(i)

      expect(actual.toString()).to.equal(expected.toString())
    }
  })
})
