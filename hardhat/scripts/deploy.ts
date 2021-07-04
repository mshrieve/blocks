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
  const Controller = await ethers.getContractFactory('Controller')
  const controllerContract = await Controller.deploy()
  console.log(controllerContract.abi)

  const abi = ['event RoundCreated(address round)']
  const iface = new ethers.utils.Interface(abi)

  await controllerContract.deployed()
  console.log('Signer: ', await controllerContract.signer.getAddress())
  const vaultAddress = await controllerContract.getVaultAddress()
  console.log('vault address: ', vaultAddress)
  console.log('controller Contract: ', controllerContract.address)
  console.log('usdc Contract: ', usdcContract.address)
  // const createRound = await controllerContract.createRound(
  //   100, // n = number of buckets
  //   eDecimals.times(5000).toFixed(), // b = constant,
  //   usdcContract.address,
  //   vaultAddress
  // )
  // const receipt = await createRound.wait()
  // console.log(receipt.logs.map((log: any) => iface.parseLog(log)))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
