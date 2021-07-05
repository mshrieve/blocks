import { useDatasets } from '../hooks/useDatasets'

export const DatasetHandler = ({ prices, positions }) => {
  useDatasets({ prices, positions })

  return <span />
}
