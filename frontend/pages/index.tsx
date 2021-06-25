import { ethers } from 'ethers'
import { useState } from 'react'
import Token from '../../hardhat/artifacts/contracts/Token.sol/Token.json'

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
const signer = provider.getSigner()
const contract = new ethers.Contract(
  '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  Token.abi,
  signer
)

const Button = () => {
  return <button>Click</button>
}
const HomePage = () => {
  const [address, setAddress] = useState('')
  const [totalSupply, setTotalSupply] = useState('')

  signer.getAddress().then((x) => setAddress(x.toString()))
  contract.totalSupply().then((x) => setTotalSupply(x.toString()))

  return (
    <main>
      <div>Welcome to Next.js! {address}</div>
      <div>total supply: {totalSupply}</div>
    </main>
  )
}

export default HomePage
