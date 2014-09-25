var client      = require('../lib/client'),
    credentials = require('./credentials');

client.auth(credentials, function(e, api) {
	if(e) {
		console.log('error:', e);
	}
	else {
    	api.get('/project/W6m62sfubmtOxBa7IpTnPQ/', function(e, data) {
        	console.log('error:', e);
        	console.log('data:', data);
        });
    }
});
