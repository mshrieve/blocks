import BigNumber from 'bignumber.js'
export const eDecimals = new BigNumber('10').pow(18)
export const usdcDecimals = new BigNumber('10').pow(6)
export const render18 = (x: BigNumber) => x.div(eDecimals).toFixed()
export const renderUSDC = (x: BigNumber) => x.div(usdcDecimals).toFixed()
