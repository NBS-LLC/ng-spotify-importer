import assert = require("assert");
import { Credentials } from "./credentials";

describe('Credentials', () => {
    describe('#constructor', () => {
        it('should allow username and password to be set', () => {
            const creds = new Credentials('unit', 'test');
            assert.strictEqual(creds.username, 'unit');
            assert.strictEqual(creds.password, 'test');
        });
    });
});