/*
 * Module dependencies.
 */

var request = require('./request'),
    Arguments = require('./arguments'),
    fs = require('fs'),
    p = require('path');

/**
 * API Request Constructor.
 *
 * Creating an instance of the API Request will enable the RESTful access
 * to a CocoonJS Cloud API.
 *
 * Options:
 *
 *   - `options` {Object} defines the API server that has been authenticated.
 *   - `api.token` {String} is the token for authentication.
 *   - `api.protocol` {String} is the protocol, e.g. 'http' or 'https'.
 *   - `api.host` {String} is the host address, e.g. 'api.ludei.com'.
 *   - `api.port` {String} is the port, e.g. '80' or '443'.
 *   - `api.path` {String} is the api path, e.g. '/v1'
 *   - [`api.path`] {String} is a proxy to forward requests, e.g. 'http://myproxy.com'
 */

module.exports = function(options) {
    // require options argument
    if (!options) throw new Error('missing options argument');
    if (!options.token) throw new Error('missing options.token argument');
    if (!options.protocol) throw new Error('missing options.protocol argument');
    if (!options.host) throw new Error('missing options.host argument');
    if (!options.port) throw new Error('missing options.port argument');
    if (!options.path) throw new Error('missing options.path argument');

    if (options.username) throw new Error('unnecessary options.name argument');
    if (options.password) throw new Error('unnecessary options.password argument');

    /**
     * API Request.
     *
     * Sends an HTTP request to the CocoonJS Cloud API.
     *
     * By default, the request method is `GET` but can be changed
     * in the `options` parameters (e.g. `{ method: 'POST' }`).
     *
     * Options:
     *
     *   - `path` {String} is a resource path (e.g. `"/project"`).
     *   - `[options]` {Object} is a request options object.
     *   - `[callback]` {Function} is trigger after the request
     *     - `e` {Error} is null unless there is an error
     *     - `data` {Object} is the JSON response.
     */

    var api = function(path, options, callback) {
        var args = new Arguments(path, options, callback);
        args.options.method = args.options.method || 'GET';
        return api.request(args.path, args.options, args.callback);
    };

    /**
     * GET API Request.
     *
     * Options:
     *
     *   - `path` {String} is a resource path (e.g. `"/project"`).
     *   - `[options]` {Object} is a request options object.
     *   - `[callback]` {Function} is trigger after the request
     *     - `e` {Error} is null unless there is an error
     *     - `data` {Object} is the JSON response.
     */

    api.get = function(path, options, callback) {
        var args = new Arguments(path, options, callback);
        args.options.method = 'GET';
        return api.request(args.path, args.options, args.callback);
    };

    /**
     * POST API Request.
     *
     * Options:
     *
     *   - `path` {String} is a resource path (e.g. `"/project"`).
     *   - `[options]` {Object} is a request options object.
     *   - `[callback]` {Function} is trigger after the request
     *     - `e` {Error} is null unless there is an error
     *     - `data` {Object} is the JSON response.
     */

    api.post = function(path, options, callback) {
        var args = new Arguments(path, options, callback);
        args.options.method = 'POST';
        return api.request(args.path, args.options, args.callback);
    };

    /**
     * PUT API Request.
     *
     * Options:
     *
     *   - `path` {String} is a resource path (e.g. `"/project"`).
     *   - `[options]` {Object} is a request options object.
     *   - `[callback]` {Function} is trigger after the request
     *     - `e` {Error} is null unless there is an error
     *     - `data` {Object} is the JSON response.
     */

    api.put = function(path, options, callback) {
        var args = new Arguments(path, options, callback);
        args.options.method = 'PUT';
        return api.request(args.path, args.options, args.callback);
    };

    /**
     * DELETE API Request.
     *
     * Options:
     *
     *   - `path` {String} is a resource path (e.g. `"/project"`).
     *   - `[options]` {Object} is a request options object.
     *   - `[callback]` {Function} is trigger after the request
     *     - `e` {Error} is null unless there is an error
     *     - `data` {Object} is the JSON response.
     */

    api.del = function(path, options, callback) {
        var args = new Arguments(path, options, callback);
        args.options.method = 'DELETE';
        return api.request(args.path, args.options, args.callback);
    };

    /**
     * API Request Defaults.
     *
     * The method simply forwards to [requests](https://github.com/mikeal/request)
     * default method.
     */

    api.defaults = function(options, requester) {
        return request.defaults(options, requester);
    };

    /*
     * API Configuration.
     *
     * Internal configuration values for constructing an API request.
     *
     * Values:
     *
     *   - `api.token` {String} is the user token for authentication.
     *   - `api.protocol` {String} is the protocol, e.g. 'http' or 'https'.
     *   - `api.host` {String} is the host address, e.g. 'api.ludei.com'.
     *   - `api.port` {String} is the port, e.g. '80' or '443'.
     *   - `api.path` {String} is the api path, e.g. '/v1'
     *   - [`api.proxy`] {String} is proxy for requests through, e.g. 'http://myproxy.com'
     */

    api.token = options.token;
    api.protocol = options.protocol;
    api.host = options.host;
    api.port = options.port;
    api.path = options.path;
    api.defaults.version = options.version;
    api.proxy = options.proxy;

    /*
     * API Request Handler.
     *
     * Private method that handles all types of API requests.
     *
     * Options:
     *
     *   - `path` {String} is a resource path (e.g. `"/project"`).
     *   - `[options]` {Object} is a request options object.
     *   - `[callback]` {Function} is trigger after the request
     *     - `e` {Error} is null unless there is an error
     *     - `data` {Object} is the JSON response.
     */

    api.request = function(path, options, callback) {
        // require arguments
        if (!path) throw new Error('missing path argument');
        if (!options) throw new Error('missing options argument');

        // optional arguments
        callback = callback || function() {};

        var args = new Arguments(path, callback);
        var uri = api.protocol + '//' +
                  api.host + ':' +
                  api.port +
                  api.path +
                  args.path;

        options.headers = {
            'X-AUTH-TOKEN': api.token,
            'Content-Type': headers.content_type(data)
        };

        options.followRedirect = function(response) {
            response.request.headers = {};
            return true;
        };

        // hijack the form option.
        // this is a clean interface to define form data, but the
        // CocoonJS Cloud api does not support encoded querystring data.
        var data = options.form;
        options.form = undefined;

        // use proxy when provided
        options.proxy = api.proxy;

        var r = request.send(uri, options, function(e, res, body) {
            if (e) {
                // error in request
                args.callback(e);
            }
            else if (res.statusCode !== 200 && res.statusCode !== 201 && res.statusCode !== 202) {
                // provide a default message when none is provided
                body = body || "server error: " + res.statusCode;

                // eror in response
                args.callback(new Error(body));
            }
            else {
                try {
                    body = JSON.parse(body);
                }
                catch(err) {
                    // continue but data untouched (likely image data)
                }

                if (body && typeof body.error === 'string') {
                    // api response includes an error
                    args.callback(new Error(body.error));
                }
                else {
                    // api response is successful
                    body = body || "{}";
                    args.callback(null, body);
                }
            }
        });

        // form-data support as content-type multipart/form-data
        if (data) {
            if(data.file) {
                var form = r.form(),
                    key,
                    value;

                // handle each key in the form object:
                //   - `data` {Object} is handled as JSON.
                //   - `*` {String} is handled as a file path.
                for(key in data) {
                    if (key === 'file') {
                        value = fs.createReadStream(p.normalize(data[key]));
                    }
                    else if (key === 'data') {
                        value = JSON.stringify(data[key]);
                    }
                    else {
                        value = data[key];
                    }
                    form.append(key, value);
                }
            }
            else {
                if(r) r.body = JSON.stringify(data);
            }
        }

        return r;
    };

    return api;
};

module.exports.prototype = {
};

var headers = {

    basic_auth: function(username, password) {
        var string = username + ':' + password;
        var base64 = new Buffer(string).toString('base64');
        return 'Basic ' + base64;
    },

    content_type: function(data) {
        var string = 'application/json';
        if(data && data.file) {
          string = 'multipart/form-data';
        }
        return string;
    }

};
