import {Hex, isHex} from "viem";


export const validatePrivateKey = (privateKey?: string): privateKey is Hex => {
    return !!privateKey && isHex(privateKey)
}
