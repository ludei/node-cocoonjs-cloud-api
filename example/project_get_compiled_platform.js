var client      = require('../lib/client'),
    credentials = require('./credentials'),
    fs          = require('fs');

client.auth(credentials, function(e, api) {
	if(e) {
		console.log('error:', e);
	}
	else {
        api.get('/project/V1Qc17o48pGWQFkkM3aFwA/ios/').pipe(fs.createWriteStream('./app.zip'));
    }
});
