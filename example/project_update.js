var client      = require('../lib/client'),
    credentials = require('./credentials');

client.auth(credentials, function(e, api) {
	if(e) {
		console.log('error:', e);
	}
	else {
        var options = {
            form: {
				"title": "My App created using the API Updated",
				"package": "com.ludei.apps.myapp",
				"version": "0.2"
			}
	    };
    	api.put('/project/W6m62sfubmtOxBa7IpTnPQ/', options, function(e, data) {
        	console.log('error:', e);
        	console.log('data:', data);
        });
    }
});
