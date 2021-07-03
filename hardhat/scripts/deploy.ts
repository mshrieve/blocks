import { ethers } from 'hardhat'
import { BigNumber } from 'bignumber.js'

async function main() {
  // We get the contract to deploy
  const eDecimals = new BigNumber('10').pow(18)
  const usdcDecimals = new BigNumber('10').pow(6)
  const USDC = await ethers.getContractFactory('USDC')
  const usdcContract = await USDC.deploy()
  const signerAddress = await usdcContract.signer.getAddress()
  usdcContract.mint(signerAddress, usdcDecimals.times(10000).toFixed())
  const Blocks = await ethers.getContractFactory('Blocks')
  const blocksContract = await Blocks.deploy(
    100, // n = number of buckets
    eDecimals.times(5000).toFixed(), // b = constant,
    eDecimals.times(100).toFixed(), // delta = size of each bucket
    usdcContract.address
  )

  await blocksContract.deployed()

  console.log('Signer: ', await blocksContract.signer.getAddress())
  console.log('USDC: ', usdcContract.address)
  console.log('Blocks: ', blocksContract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
