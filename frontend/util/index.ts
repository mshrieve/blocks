import BigNumber from 'bignumber.js'
export const eDecimals = new BigNumber('10').pow(18)
export const renderBN = (x: BigNumber) => x.div(eDecimals).toString()
