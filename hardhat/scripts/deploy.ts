import { ethers } from 'hardhat'

import { BigNumber } from 'bignumber.js'

async function main() {
  // We get the contract to deploy
  const eDecimals = new BigNumber('10').pow(18)
  const usdcDecimals = new BigNumber('10').pow(6)

  const USDCFactory = await ethers.getContractFactory('USDC')
  const USDC = await USDCFactory.deploy()

  const signerAddress = await USDC.signer.getAddress()
  USDC.mint(signerAddress, usdcDecimals.times(10000).toFixed())

  const AggregatorFactory = await ethers.getContractFactory('Aggregator')
  const Aggregator = await AggregatorFactory.deploy(
    new BigNumber(10).pow(6).times(2000).toFixed()
  )

  const MathFactory = await ethers.getContractFactory('Math')
  const Math = await MathFactory.deploy()

  const VaultFactory = await ethers.getContractFactory('Vault')
  const Vault = await VaultFactory.deploy()

  // const ControllerFactory = await ethers.getContractFactory('Controller', {
  //   libraries: {
  //     Math: Math.address
  //   }
  // })
  // const Controller = await ControllerFactory.deploy(Vault.address)

  const abi = ['event RoundCreated(address round)']
  const iface = new ethers.utils.Interface(abi)

  // await Controller.deployed()
  // console.log('Signer: ', await Controller.signer.getAddress())
  // const vaultAddress = await Controller.getVaultAddress()
  // console.log('controller Contract: ', Controller.address)
  console.log('vault address: ', Vault.address)
  console.log('usdc Contract: ', USDC.address)
  console.log('aggregator address: ', Aggregator.address)

  const RoundFactory = await ethers.getContractFactory('Round', {
    libraries: {
      Math: Math.address
    }
  })
  const Round = await RoundFactory.deploy(
    100, // N = number of buckets
    eDecimals.times(5000).toFixed(), // b = constant,
    eDecimals.times(100).toFixed(), // delta = size of each bucket
    USDC.address,
    Vault.address,
    1625453974, //expiry timestamp,
    Aggregator.address // chainlink oracle
  )

  const receipt = await Vault.approveRoundAccess(Round.address)
  console.log(receipt)

  // const receipt = await createRound.wait()
  // console.log(receipt.logs.map((log: any) => iface.parseLog(log)))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
