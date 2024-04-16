import {Chain} from "viem";

export const seiDevNet: Chain = {
    id: 713715,
    name: "Sei Public Devnet",
    nativeCurrency: {
        name: "Sei",
        decimals: 18,
        symbol: "SEI",
    },
    rpcUrls: {
        default: {
            http: [
                "https://evm-rpc-arctic-1.sei-apis.com",
            ]
        },
        public: {
            http: ["https://evm-rpc-arctic-1.sei-apis.com"]
        },
    },
    blockExplorers: {
        default: {
            name: 'SeiTrace',
            url: 'https://seitrace.com/',
        }
    },
}
