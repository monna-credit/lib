import {Hex, isAddress, zeroAddress} from "viem";
import {validatePrivateKey} from "../lib/utils";
import { PoolFactory } from "../contract";
import {assetsBySymbol} from "../constants";
import {seiDevNetClient} from "../lib/public-client";

describe('mint testing tokens', () => {
    let ownerPrivateKey: Hex;
    let poolFactory: PoolFactory;

    beforeAll(() => {
        const _ownerPrivateKey = process.env.OWNER_PRIVATE_KEY;

        if (!validatePrivateKey(_ownerPrivateKey)) {
            throw new Error('OWNER_PRIVATE_KEY must be set');
        }

        ownerPrivateKey = _ownerPrivateKey;
        poolFactory = new PoolFactory(ownerPrivateKey);
    });



/*
    test('add pool', async () => {
        // Add pool
        await poolFactory.deployPool('USDC')
    });
*/

    test('get pool', async () => {
        const pool = await poolFactory.getPool(assetsBySymbol['USDC'].address)

        expect(pool).toBeDefined();
        expect(pool !== zeroAddress).toBeTruthy();
        expect(isAddress(pool)).toBeTruthy();
    })
})
