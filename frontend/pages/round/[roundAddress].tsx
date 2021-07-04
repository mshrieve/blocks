import { useRouter } from 'next/router'

const Round = () => {
  const router = useRouter()
  const { roundAddress } = router.query

  return <p>Post: {roundAddress}</p>
}

export default Round
