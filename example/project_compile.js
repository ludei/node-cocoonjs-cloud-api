var client      = require('../lib/client'),
    credentials = require('./credentials');

client.auth(credentials, function(e, api) {
    if(e) {
        console.log('error:', e);
    }
    else {
        var options = {
            form: {
                "data": {
                    "view": "webview+",
                    "version": "2.0.2",
                    "platforms": ["ios", "android"]
                },
                "file": "/Users/username/projects/apps/test/project.zip"
            }
        };
        api.post('/project/_F28DonqkUrkX-huEazwIQ/compile', options, function(e, data) {
            console.log('error:', e);
            console.log('data:', data);
        });
    }
});

