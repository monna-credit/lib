import { abi } from '../abi';
import {
    Address,
    Hex,
    getContract, isAddress, zeroAddress, formatUnits, parseUnits,
} from 'viem';
import {
    addressMap,
    Asset,
    assetsBySymbol,
    AssetSymbol,
} from '../constants'
import {
    seiDevNetClient,
} from '../lib/public-client'
import {walletClient} from "../lib/wallet-client";

import {privateKeyToAccount} from "viem/accounts";

export class PoolFactory {
    constructor(private readonly privateKey?: Hex) {}

    _assetToPoolMetadata(
        asset: Asset,
    ) {
        return {
            name: `Monna ${asset.symbol}`,
            symbol: `mo${asset.symbol}`,
        }
    }

    async deployPool(
        assetSymbol: AssetSymbol,
    ) {
        if (!this.privateKey) throw new Error('privateKey is required in write mode');
        const account = privateKeyToAccount(this.privateKey)
        const asset = assetsBySymbol[assetSymbol];
        const poolMetadata = this._assetToPoolMetadata(asset);


        console.info(`Deploying pool for ${assetSymbol} with metadata:`, poolMetadata)

        const {
            request,
            result,
        } = await seiDevNetClient.simulateContract({
            address: addressMap.poolFactory,
            abi: abi.PoolFactory,
            functionName: 'deploy_pool',
            args: [
                poolMetadata.name,
                poolMetadata.symbol,
                asset.address,
            ],
            account,
        })

        console.info('Simulated deploy pool:', result)

        const txHash = await walletClient.writeContract(request);
        console.log(`Deployed pool for ${assetSymbol} with txHash: ${txHash}`);

        return txHash;
    }

    async getPool(
        address: Address,
    ) {
        const pool = await seiDevNetClient.readContract({
            address: addressMap.poolFactory,
            abi: abi.PoolFactory,
            functionName: 'pool_data',
            args: [
                address
            ],
        })
        return pool;
    }
}


export class Pool {
    constructor(public readonly poolAddress: Address) {}

    async getUnderlyingAssetAddress(): Promise<Address> {
        const assetAddress = await seiDevNetClient.readContract({
            address: this.poolAddress,
            abi: abi.Pool,
            functionName: 'underlying_asset',
        }) as Address;

        if (!isAddress(assetAddress) || assetAddress === zeroAddress) {
            throw new Error('Invalid underlying asset address')
        }

        return assetAddress
    }

    async getPoolInfo() {
        const poolContract = getContract({
            address: this.poolAddress,
            abi: abi.Pool,
            client: walletClient,
        });

        return {
            name: await poolContract.read.name(),
            underlying_asset: await poolContract.read.underlying_asset(),
            symbol: await poolContract.read.symbol(),
            decimals: await poolContract.read.decimals(),
            totalSupply: await poolContract.read.totalSupply(),
        }
    }


    async lpBalanceOf(
        address: Address,
    ) {
        const poolContract = getContract({
            address: this.poolAddress,
            abi: abi.Pool,
            client: walletClient,
        });

        const decimals = await poolContract.read.decimals();

        const weiBalance = await poolContract.read.balanceOf([ address ]);

        return {
            weiBalance,
            balance: formatUnits(weiBalance, Number(decimals)),
        }
    }

    async addLiquidity(
        addAmount: string,
        privateKey: Hex,
    ) {
        const account = privateKeyToAccount(privateKey);

        const underlyingAssetAddress = await this.getUnderlyingAssetAddress();

        const erc20 = getContract({
            address: underlyingAssetAddress,
            abi: abi.MintableERC20,
            client: walletClient,
        });

        const decimals = await erc20.read.decimals();
        console.info(`ERC20 Decimals: ${decimals}`)
        const weiAmount = parseUnits(addAmount, Number(decimals));
        const allowance = await erc20.read.allowance([ account.address, this.poolAddress ]);

        console.info(`Allowance: ${allowance.toString()}`);

        if (weiAmount > allowance) {
            const {request} = await seiDevNetClient.simulateContract({
                functionName: 'approve',
                address: underlyingAssetAddress,
                abi: abi.MintableERC20,
                args: [ this.poolAddress, weiAmount ],
                account,
            });
            await walletClient.writeContract(request);
        }


        const {request} = await seiDevNetClient.simulateContract({
            address: this.poolAddress,
            abi: abi.Pool,
            functionName: 'add_liquidity',
            args: [ weiAmount ],
            account,
        });

        const txHash = await walletClient.writeContract(request);
        console.log(`Added ${addAmount} to pool with txHash: ${txHash}`);
        return txHash;
    }


    async removeLiquidity(
        removeAmount: string,
        privateKey: Hex,
    ) {
        const account = privateKeyToAccount(privateKey);

        const {request} = await seiDevNetClient.simulateContract({
            address: this.poolAddress,
            abi: abi.Pool,
            functionName: 'remove_liquidity',
            args: [ parseUnits(removeAmount, 18) ],
            account,
        });

        const txHash = await walletClient.writeContract(request);
        console.log(`Removed ${removeAmount} from pool with txHash: ${txHash}`);
        return txHash;
    }
}
