import { useContext } from 'react'
import { DataContext } from '../context/data'

export const useData = () => {
  const data = useContext(DataContext)
  return data
}
