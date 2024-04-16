import { abi } from "../abi";
import {Hex, parseUnits} from 'viem';
import {assetsBySymbol, AssetSymbol} from "../constants";
import {privateKeyToAccount} from "viem/accounts";
import {seiDevNetClient} from "./public-client";
import {walletClient} from "./wallet-client";


export async function mintTestTokens(
    symbol: AssetSymbol,
    amount: string,
    privateKey: Hex,
) {
    const account = privateKeyToAccount(privateKey)
    const asset = assetsBySymbol[symbol];
    const {request} = await seiDevNetClient.simulateContract({
        address: asset.address,
        abi: abi.MintableERC20,
        functionName: '_mint_for_testing',
        args: [
            account.address,
            parseUnits(amount, asset.decimals),
        ],
        account,
    })

    const txHash = await walletClient.writeContract(request);
    console.log(`Minted ${amount} ${symbol} to ${account.address} with txHash: ${txHash}`);
    return txHash;
}
