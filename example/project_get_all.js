var client      = require('../lib/client'),
    credentials = require('./credentials');

client.auth(credentials, function(e, api) {
	if(e) {
		console.log('error:', e);
	}
	else {
    	api.get('/project/', function(e, data) {
        	console.log('error:', e);
        	console.log('data:', data);
        });
    }
});
