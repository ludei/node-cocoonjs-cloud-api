/*
 * Module dependencies.
 */

var request = require('request'),
    defaults = require('./defaults'),
    API = require('./api');

/**
 * Authentication for CocoonJS Cloud.
 *
 * Authenticates with CocoonJS Cloud to obtain an auth token. With the auth
 * token, an API instance in created and returned via the callback.
 *
 * Options:
 *
 *   - `options` {Object} is the authentication settings.
 *   - `options.username` {String} is the CocoonJS Cloud username.
 *   - `options.password` {String} is the CocoonJS Cloud password.
 *   - `options.token` {String} can be used instead of username and password.
 *   - `callback` {Function} is trigger after the authentication.
 *     - `e` {Error} is null unless there is an error.
 *     - `api` {Object} is the `API` instance to interact with CocoonJS Cloud.
 */

module.exports = function(options, callback) {
    options = extend(defaults, options);

    // require options parameter
    if (!options) throw new Error('missing options argument');

    // require options parameter credentials
    if (!options.username) throw new Error('missing options.name argument');
    if (!options.password) throw new Error('missing options.password argument');

    // require callback parameter
    if (!callback) throw new Error('missing callback argument');

    // url for authentication
    var uri =
        options.protocol + '//' +
        options.host + ':' + options.port +
        options.path + '/user/auth';

    // post headers for authentication
    var opts = {
        headers: {
            'Content-Type': 'application/json'
        },
        json: {
          "email": options.username,
          "password": options.password
        },
        proxy: options.proxy
    };

    // try to authenticate
    request.post(uri, opts, function(e, response, body) {
        // failed request
        if (e) {
            callback(e);
            return;
        }

        // failed response
        if (response.statusCode !== 200) {
            // provide a default message when none is provided
            body = body || { status_code: response.statusCode };
            if(typeof body === 'string') {
                callback(new Error(body));
            } else {
                callback(new Error(JSON.stringify(body)));
            }
            return;
        }

        try {
            var data = JSON.parse(body);

            // failed api validation
            if (data.error) {
                callback(new Error(data.error));
                return;
            }

        }
        catch(err) {
        }

        options.token = body.token;
        options.username = undefined;
        options.password = undefined;

        // create API object
        callback(null, new API(options));
    });
};

var extend = function(defaults, overrides) {
    var result = {},
        key;

    for (key in defaults) {
        result[key] = defaults[key];
    }

    for (key in overrides) {
        result[key] = overrides[key];
    }
    return result;
};
