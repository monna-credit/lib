export const assets = [
    {
        "name": "USD Coin",
        "symbol": "USDC",
        "decimals": 18,
        "address": "0x647a310a1116b80fFaA83cBBeB2AE4B73D2308c0"
    },
    {
        "name": "iSEI",
        "symbol": "iSEI",
        "decimals": 18,
        "address": "0x3e573f1D81ed534FB9fD9DE5604E91c133D395B8",
    },
    {
        "name": "Wrapped Bitcoin",
        "symbol": "WBTC",
        "decimals": 8,
        "address": "0x00B575Ee5cfaE5af0EF1a313A733cdF5135CDDfd",
    }
] as const

export type Asset = typeof assets[number];
export type AssetSymbol = Asset['symbol'];

export const assetsByAddress = assets.reduce((acc, asset) => {
    acc[asset.address] = asset;
    return acc;
}, {} as Record<string, Asset>);

export const assetsBySymbol = assets.reduce((acc, asset) => {
    acc[asset.symbol] = asset;
    return acc;
}, {} as Record<string, Asset>);
