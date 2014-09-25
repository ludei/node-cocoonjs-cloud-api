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
                    "version": "3.5",
                },
                "file": "/Users/username/projects/apps/test/project.zip"
            }
        };
        api.post('/project/W6m62sfubmtOxBa7IpTnPQ/compile/ios/', options, function(e, data) {
            console.log('error:', e);
            console.log('data:', data);
        });
    }
});

