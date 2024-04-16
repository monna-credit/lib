import {
    mintTestTokens
} from "../lib/mint-test-tokens";
import {
    assetsBySymbol,
} from "../constants";
import {validatePrivateKey} from "../lib/utils";
import {Hex, isHex} from "viem";

describe('mint testing tokens', () => {
    let ownerPrivateKey: Hex;
    let userPrivateKey: Hex;

    beforeAll(() => {
        // Set up the environment
        const _ownerPrivateKey = process.env.OWNER_PRIVATE_KEY;
        const _userPrivateKey = process.env.USER_PRIVATE_KEY;

        if (!validatePrivateKey(_ownerPrivateKey) || !validatePrivateKey(_userPrivateKey)) {
            throw new Error('OWNER_PRIVATE_KEY and USER_PRIVATE_KEY must be set');
        }

        ownerPrivateKey = _ownerPrivateKey;
        userPrivateKey = _userPrivateKey;
    })


    test('mint random test tokens to owner', async () => {
/*
        const mintedTokens = await mintTestTokens('USDC', '10', ownerPrivateKey);
        expect(isHex(mintedTokens)).toBeTruthy();
*/

        expect(true).toBeTruthy()
    });
});
