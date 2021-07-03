import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import BigNumber from 'bignumber.js'
import Decimal from 'decimal.js'
import { expect } from 'chai'

const eDecimals = new BigNumber(10).exponentiatedBy(18)

describe('Blocks', () => {
  let accounts: Signer[]
  let Blocks: Contract
  let owner: Signer
  before(async () => {
    accounts = await ethers.getSigners()
    owner = accounts[0]
    const BlocksFactory = await ethers.getContractFactory('Blocks')
    Blocks = await BlocksFactory.deploy(
      1000,
      eDecimals.times(5000).toFixed(),
      eDecimals.toFixed()
    )
    await Blocks.deployed()
  })

  it('Should purchase left slope', async () => {
    const tx = await Blocks.purchaseLeftSlope(1, eDecimals.toFixed())
    console.log(tx)
  })
})
