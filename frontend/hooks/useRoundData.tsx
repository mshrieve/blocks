import { useContext } from 'react'
import { RoundContext } from '../context/round'

export const useRoundData = () => useContext(RoundContext)
