import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import BigNumber from 'bignumber.js'
import Decimal from 'decimal.js'
import { expect } from 'chai'
Decimal.set({ precision: 27, rounding: 3 })
BigNumber.config({ EXPONENTIAL_AT: 256 })

describe('Math', () => {
  let accounts: Signer[]
  let Math: Contract

  before(async () => {
    const [owner] = await ethers.getSigners()
    const MathFactory = await ethers.getContractFactory('MathHarness')
    Math = await MathFactory.deploy()
    await Math.deployed()
  })

  it('Should look up pade coefficients', async () => {
    for (let i = 0; i < 5; i++) {
      const actual = await Math.pade_coefficient_lookup(i)
      console.log(actual.toString())
    }
  })
  it('Should get powers', async () => {
    const eDecimals = new BigNumber('1e18')
    const two = new BigNumber(2)

    // 10^18 < 2^60
    // so, 10^18 * 2^196 < 2^256
    for (let i = 0; i < 10; i++) {
      const actual = await Math.power(eDecimals.times(i).toString(), 3)
      const expected = new BigNumber(i).pow(3).times(eDecimals)
      expect(actual.toString()).to.equal(expected.toString())
    }
  })

  it('Should exponentiate integers properly', async () => {
    const eDecimals = new BigNumber('1e18')
    const two = new BigNumber(2)

    // 10^18 < 2^60
    // so, 10^18 * 2^196 < 2^256
    for (let i = 0; i < 10; i++) {
      const actual = await Math.padeExponentiate(eDecimals.times(i).toString())
      //   const expected = two.pow(i).times(eDecimals)
      console.log(actual.toString())
      //   expect(actual.toString()).to.equal(expected.toString())
    }
  })

  //   it('Should power 1000 properly', async () => {
  //     const eDecimals = new BigNumber('1e18')
  //     const two = new BigNumber(2)

  //     // 10^18 < 2^60
  //     // so, 10^18 * 2^196 < 2^256
  //     for (let i = 0; i < 10; i++) {
  //       const actual = await Math.power(eDecimals.times(1000).toString(), i)
  //       //   const expected = two.pow(i).times(eDecimals)
  //       console.log(actual.toString())
  //       //   expect(actual.toString()).to.equal(expected.toString())
  //     }
  //   })

  //   it('Should pade exponentiate decimals properly', async () => {
  //     const eDecimals = new Decimal('1e18')
  //     const fDecimals = new Decimal('1e-18')
  //     const two = new Decimal(2)
  //     // we actually cannot expect the last few digits to be correct :(
  //     const errorMargin = new Decimal('20')
  //     for (let i = 0; i < 10; i++) {
  //       const result = await Math.padeExponentiate(i)
  //       const actual = new Decimal(result.toString()).div(errorMargin).floor()
  //       const expected = two
  //         .pow(fDecimals.times(i))
  //         .times(eDecimals)
  //         .div(errorMargin)
  //         .floor()

  //       expect(actual.toString()).to.equal(expected.toString())
  //     }
  //   })
})
