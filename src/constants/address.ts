import {
    isAddress
} from "viem";

const poolFactoryAddress = process.env.POOL_FACTORY_ADDRESS

if (!poolFactoryAddress || !isAddress(poolFactoryAddress)) {
    throw new Error('POOL_FACTORY_ADDRESS is not set')
}

export const addressMap = {
    poolFactory: poolFactoryAddress
}
