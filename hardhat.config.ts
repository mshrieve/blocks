/**
 * @type import('hardhat/config').HardhatUserConfig
 */

import {
  experimentalAddHardhatNetworkMessageTraceHook,
  task
} from 'hardhat/config'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import { ethers } from 'ethers'

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.address)
  }
})

module.exports = {
  solidity: '0.8.0',
  paths: {
    sources: './hardhat/contracts',
    tests: './hardhat/test',
    cache: './hardhat/cache',
    artifacts: './hardhat/artifacts'
  }
}
