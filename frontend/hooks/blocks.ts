import { ethers, utils } from 'ethers'
import { useEffect, useState } from 'react'
import Blocks from '../../hardhat/artifacts/hardhat/contracts/Blocks.sol/Blocks.json'

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
const signer = provider.getSigner()
const contract = new ethers.Contract(
  '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  Blocks.abi,
  signer
)
import BigNumber from 'bignumber.js'
const eDecimals = new BigNumber('10').pow(18)
const initPrices = new Array(100).fill(0.01)
