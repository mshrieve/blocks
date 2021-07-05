/**
 * @type import('hardhat/config').HardhatUserConfig
 */

import { task } from 'hardhat/config'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import 'hardhat-gas-reporter'
import { BigNumber } from 'bignumber.js'
const eDecimals = new BigNumber('10').pow(18)

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.address)
  }
})

task('deploy_vault', 'deploys the vault and returns its address').setAction(
  async (args, hre) => {
    const VaultFactory = await hre.ethers.getContractFactory('Vault')
    const Vault = await VaultFactory.deploy()
    console.log(Vault.address)
  }
)

task('deploy_math', 'deploys the controller and returns its address').setAction(
  async (args, { ethers }) => {
    const MathFactory = await ethers.getContractFactory('Math')
    const Math = await MathFactory.deploy()
    console.log(Math.address)
  }
)

task('deploy_round_factory', 'deploys the controller and returns its address')
  .addParam('math', "The math's address")
  .setAction(async (args, { ethers }) => {
    const RoundFactoryFactory = await ethers.getContractFactory(
      'RoundFactory',
      {
        libraries: {
          Math: args.math
        }
      }
    )
    const RoundFactory = await RoundFactoryFactory.deploy()
    console.log(RoundFactory.address)
  })
task('deploy_controller', 'deploys the controller and returns its address')
  .addParam('roundfactory', "The round factory's address")
  .addParam('math', "The math's address")
  .setAction(async (args, { ethers }) => {
    const RoundFactoryFactory = await ethers.getContractFactory(
      'RoundFactory',
      {
        libraries: {
          Math: args.math
        }
      }
    )
    const RoundFactory = RoundFactoryFactory.attach(args.roundfactory)
    const ControllerFactory = await ethers.getContractFactory('Controller')
    const Controller = await ControllerFactory.deploy(args.roundfactory)
    const tx = await RoundFactory.whitelistController(Controller.address)
    console.log(Controller.address)
  })

task('deploy_usdc', 'deploys the controller and returns its address').setAction(
  async (args, { ethers }) => {
    const USDCFactory = await ethers.getContractFactory('USDC')
    const USDC = await USDCFactory.deploy()
    console.log(USDC.address)
  }
)

task(
  'deploy_aggregator',
  'deploys the controller and returns its address'
).setAction(async (args, { ethers }) => {
  const AggregatorFactory = await ethers.getContractFactory('Aggregator')
  const USDCAggregator = await AggregatorFactory.deploy(
    new BigNumber(10).pow(6).times(2000).toFixed()
  )
  console.log(USDCAggregator.address)
})

task(
  'deploy_round',
  'deploys a round (with helper contracts) and returns its address'
)
  .addParam('controller', "The controller's address")
  .addParam('usdc', "The usdc's address")
  .addParam('aggregator', "The aggregator's address")
  .setAction(async (args, { ethers }) => {
    const ControllerFactory = await ethers.getContractFactory('Controller')
    const Controller = ControllerFactory.attach(args.controller)
    const round = await Controller.deployRound(
      100, // N = number of buckets
      eDecimals.times(5000).toFixed(), // b = constant,
      eDecimals.times(100).toFixed(), // delta = size of each bucket
      args.usdc,
      1625453974, //expiry timestamp,
      args.aggregator // chainlink oracle
    )
    const abi = [
      'event RoundCreated(address round, address asset, uint256 expiry)',
      'event AnswerUpdated(int256 indexed current,uint256 indexed roundId,uint256 timestamp)',
      'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)'
    ]
    const iface = new ethers.utils.Interface(abi)

    const receipt = await round.wait()
    console.log(iface.parseLog(receipt.logs[1]).args[0])
  })

task(
  'deploy_round_controller',
  'deploys a round (with helper contracts) and returns its address'
)
  .addParam('controller', "The controllers's address")
  .addParam('math', "The math's address")
  .addParam('vault', "The vault's address")
  .setAction(async (args, { ethers }) => {
    const AggregatorFactory = await ethers.getContractFactory('Aggregator')
    const USDCAggregator = await AggregatorFactory.deploy(
      new BigNumber(10).pow(6).times(2000).toFixed()
    )
    const USDCFactory = await ethers.getContractFactory('USDC')
    const USDC = await USDCFactory.deploy()

    const ControllerFactory = await ethers.getContractFactory('Controller', {
      libraries: {
        Math: args.math
      }
    })
    const Controller = await ControllerFactory.deploy(args.vault)

    const Round = await Controller.createRound(
      100, // N = number of buckets
      eDecimals.times(5000).toFixed(), // b = constant,
      eDecimals.times(100).toFixed(), // delta = size of each bucket
      USDC.address,
      args.vault,
      1625453974, //expiry timestamp,
      USDCAggregator.address // chainlink oracle
    )
  })

task('approve_round', 'Prints the list of accounts')
  .addParam('vault', "The vault's address")
  .addParam('round', "The round's address")
  .setAction(async (args, { ethers }) => {
    const VaultFactory = await ethers.getContractFactory('Vault')
    const Vault = VaultFactory.attach(args.vault)
    Vault.approveRound()
  })

module.exports = {
  solidity: '0.8.0',
  settings: {
    optimizer: {
      enabled: true,
      runs: 5
    }
  },
  paths: {
    sources: './hardhat/contracts',
    tests: './hardhat/test',
    cache: './hardhat/cache',
    artifacts: './hardhat/artifacts'
  }
}
