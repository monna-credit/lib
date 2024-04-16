import {createWalletClient, http} from 'viem';
import { seiDevNet } from "../constants";


export const walletClient = createWalletClient({
    chain: seiDevNet,
    transport: http(),
})

