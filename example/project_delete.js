var client      = require('../lib/client'),
    credentials = require('./credentials');

client.auth(credentials, function(e, api) {
	if(e) {
		console.log('error:', e);
	}
	else {
    	api.del('/project/ZfLePWwf-1MpQ9JD_iaAjA', function(e, data) {
        	console.log('error:', e);
        	console.log('data:', data);
        });
    }
});
