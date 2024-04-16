import { createPublicClient, createWalletClient, http } from 'viem';
import { seiDevNet } from "../constants";


export const seiDevNetClient = createPublicClient({
    chain: seiDevNet,
    transport: http(),
})
