var client      = require('../lib/client'),
    credentials = require('./credentials');

client.auth(credentials, function(e, api) {
	if(e) {
		console.log('error:', e);
	}
	else {
        var options = {
            form: {
				"title": "My App created using the API",
				"package": "com.ludei.apps.myapp",
				"version": "0.1"
			}
	    };
    	api.post('/project/', options, function(e, data) {
        	console.log('error:', e);
        	console.log('data:', data);
        });
    }
});
