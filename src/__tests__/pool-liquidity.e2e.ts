import {Address, Hex, isAddress, isHex, zeroAddress} from "viem";
import { Pool } from "../contract";
import {validatePrivateKey} from "../lib/utils";
import {seiDevNetClient} from "../lib/public-client";
import {privateKeyToAccount} from "viem/accounts";

describe('mint testing tokens', () => {
    let ownerPrivateKey: Hex;
    let poolAddress: Address = '0x8c137279f6B26195E9E7137A293D939851bD2564';
    let pool: Pool;

    beforeAll(() => {
        const _ownerPrivateKey = process.env.OWNER_PRIVATE_KEY;

        if (!validatePrivateKey(_ownerPrivateKey)) {
            throw new Error('OWNER_PRIVATE_KEY must be set');
        }

        ownerPrivateKey = _ownerPrivateKey;
        poolAddress = '0x8c137279f6B26195E9E7137A293D939851bD2564';
        pool = new Pool(poolAddress);
    });

    test('add liquidity', async () => {
        const txHash = await pool.addLiquidity('10', ownerPrivateKey);
        const receipt = await seiDevNetClient.waitForTransactionReceipt({ hash: txHash });
        expect(isHex(txHash)).toBeTruthy();
        expect(receipt.status === 'success').toBeTruthy();
    });

    test('remove liquidity', async () => {
        const txHash = await pool.removeLiquidity('10', ownerPrivateKey);
        const receipt = await seiDevNetClient.waitForTransactionReceipt({ hash: txHash });

        expect(isHex(txHash)).toBeTruthy();
        expect(receipt.status === 'success').toBeTruthy();
    });

    test('get pool info', async () => {
        const account = privateKeyToAccount(ownerPrivateKey)

        const poolInfo = await pool.getPoolInfo();
        expect(poolInfo.name).toBeDefined();
        expect(poolInfo.symbol).toBeDefined();
        expect(poolInfo.decimals).toBeDefined();
        expect(poolInfo.totalSupply).toBeDefined();

        const lpBalance = await pool.lpBalanceOf(account.address);
        expect(lpBalance.balance).toBeDefined();
        expect(lpBalance.weiBalance).toBeDefined();
    });
});
