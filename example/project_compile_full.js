var client      = require('../lib/client'),
    credentials = require('./credentials'),
    fs          = require('fs');

var waitingTime = 10000;

client.auth(credentials, function(e, api) {
    console.log('Auth user ' + credentials.username);
    if(e) {
        error(e);
    }
    else {
        api.get('/project/', function(e, data) {
            if(e) {
                error(e);
            }
            else {
                var project = data.filter(function (project) {
                    return project.package === "com.mydomain.testproject.one";
                })[0];
                if(project) {
                    post_compilation(project, api);
                } else {
                    error('package not found!');
                }
            }
        });
    }
});

function post_compilation(project, api) {
    console.log('Compile project ' + project.title);
    var data = {
        form: {
            "data": {
                "view": "webview+",
                "version": "3.5",
                "platforms": ["ios", "android"]
            },
            "file": "/Users/username/projects/apps/test/project.zip"
        }
    };
    api.post('/project/' + project.id + '/compile', data, function(e, data) {
        if(e) {
            try {
                var error_data = JSON.parse(e.message);
                if(error_data && error_data.code === 400) {       // This project has a compilation in progress
                    get_compilation(project, api);
                }
                else {
                    error(e);
                }
            }
            catch(err) {
                error(e);
            }
        }
        else {
            get_compilation(project, api);
        }
    });
}

function get_compilation(project, api) {
    var retries = 'Get ios compilation result of ' + project.title + ' ';

    var timeoutFuncion = function() {
        api.get('/project/' + project.id, function(e, data) {
            if(e) {
                error(e);
            }
            else {
                if(data.status.ios === 'completed') {
                    api.get('/project/' + project.id + '/ios').pipe(fs.createWriteStream('ios.zip'));
                    retries += " Done!\n";
                    process.stdout.write(retries);
                }
                else {
                    retries += ".";
                    process.stdout.write(retries + '\r');
                    setTimeout(timeoutFuncion, waitingTime);
                }

            }
        });
    };

    setTimeout(timeoutFuncion, waitingTime);
}

function error(err) {
    console.log('error:', err);
    process.exit(1);
}
