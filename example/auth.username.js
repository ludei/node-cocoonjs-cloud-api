/*!
 * Module dependencies.
 */
var client      = require('../lib/client'),
	credentials = require('./credentials');

client.auth(credentials, function(e, api) {
    console.log('error:', e);
    console.log('api:', api);
});
