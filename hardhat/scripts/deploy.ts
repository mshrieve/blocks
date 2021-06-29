import { ethers } from 'hardhat'

async function main() {
  // We get the contract to deploy
  const Blocks = await ethers.getContractFactory('Blocks')
  const blocksContract = await Blocks.deploy(100, 5000)

  await blocksContract.deployed()
  console.log('Blocks deployed by: ', await blocksContract.signer.getAddress())
  console.log('Blocks deployed to: ', blocksContract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
