import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Blocks from '../../hardhat/artifacts/hardhat/contracts/Blocks.sol/Blocks.json'
import { Bar } from 'react-chartjs-2'

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
const signer = provider.getSigner()
const contract = new ethers.Contract(
  '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  Blocks.abi,
  signer
)

const Button = () => {
  return <button>Click</button>
}
const arr = new Array(100).fill(10)
const options = {
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
const HomePage = () => {
  const [address, setAddress] = useState('')
  const [totalSupply, setTotalSupply] = useState('')
  const [prices, setPrices] = useState(arr)
  signer.getAddress().then((x) => setAddress(x.toString()))
  contract.get_bucket_price(1).then((x) => setTotalSupply(x.toString()))

  useEffect(() => {
    Promise.all(
      arr.map((_, i) => contract.get_bucket_price(i).then((x) => x.toString()))
    ).then((p) => setPrices(p))
  }, [])

  useEffect(() => {
    console.log(prices)
  }, [prices])

  return (
    <main>
      <div>Welcome to Next.js! {address}</div>
      <div>total supply: {totalSupply}</div>
      <Bar type="bar" data={prices} options={options} />
    </main>
  )
}

export default HomePage
