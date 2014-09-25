var defaults = require('../lib/defaults');

describe('defaults', function() {
        it('should set username to undefined', function() {
            expect(defaults.username).toBeUndefined();
        });

        it('should set password to undefined', function() {
            expect(defaults.password).toBeUndefined();
        });

        it('should set protocol to "https:"', function() {
            expect(defaults.protocol).toEqual('https:');
        });

        it('should set host     to "api.ludei.com"', function() {
            expect(defaults.host).toEqual('api.ludei.com');
        });

        it('should set port     to "443"', function() {
            expect(defaults.port).toEqual('443');
        });

        it('should set path     to "/v1"', function() {
            expect(defaults.path).toEqual('/v1');
        });
});
