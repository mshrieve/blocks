import { ethers } from 'hardhat'

import { BigNumber } from 'bignumber.js'

async function main() {
  console.log(process.argv)
  //   const VaultFactory = await ethers.getContractFactory('Vault')
  //   const Vault = await VaultFactory.deploy()

  //   console.log('vault address: ', Vault.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
