import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import BigNumber from 'bignumber.js'
import Decimal from 'decimal.js'
import { expect } from 'chai'

describe('Blocks', () => {
  let accounts: Signer[]
  let Blocks: Contract
  let owner: Signer
  before(async () => {
    accounts = await ethers.getSigners()
    owner = accounts[0]
    const BlocksFactory = await ethers.getContractFactory('Blocks')
    Blocks = await BlocksFactory.deploy(1000, 50000)
    await Blocks.deployed()
  })

  it('Should purchase tokens', async () => {
    for (let i = 0; i < 10; i++) {
      const actualBefore = await Blocks.balanceOf(accounts[0].getAddress(), i)
      expect(actualBefore.toString()).to.equal('0')
      await Blocks.purchase(i, 10)
      const actualAfter = await Blocks.balanceOf(accounts[0].getAddress(), i)
      expect(actualAfter.toString()).to.equal('10')
    }
  })

  it('Should fake_purchase tokens', async () => {
    for (let i = 0; i < 10; i++) {
      const actualBefore = await Blocks.balanceOf(accounts[1].getAddress(), i)
      expect(actualBefore.toString()).to.equal('0')
      await Blocks.connect(accounts[1]).fake_purchase(i, 10)
      const actualAfter = await Blocks.balanceOf(accounts[1].getAddress(), i)
      expect(actualAfter.toString()).to.equal('10')
    }
  })
})
