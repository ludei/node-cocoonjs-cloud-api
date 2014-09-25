# CocoonJS Cloud API Node Module

> Node.js REST Client for the CocoonJS Cloud API

## Overview

This library simplifies requests to the [CocoonJS Cloud REST API][rest-api-docs] for node.js clients.

If something is inaccurate or missing, please send a pull request!

## Usage

### Authenticate with Username and Password

    var client = require('cocoonjs-cloud-api');

    client.auth({ username: 'user@email.com', password: 'lalala' }, function(e, api) {
        // time to make requests
    });

### GET /v1/project

    api.get('/project', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### GET /v1/project/:id

    api.get('/project/W6m62sfubmtOxBa7IpTnPQ', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### GET /v1/project/:id/:platform

    api.get('/project/W6m62sfubmtOxBa7IpTnPQ/android').pipe(fs.createWriteStream('app.apk'));

### POST /v1/project

    var options = {
        form: {
            "title": "My App created using the API",
            "package": "com.domain.bundleid",
            "version": "0.1"
        }
    };

    api.post('/project', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### PUT /v1/project/:id

    var options = {
        form: {
            "title": "My App created using the API Updated",
            "package": "com.domain.bundleid",
            "version": "0.2"
        }
    };

    api.put('/project/W6m62sfubmtOxBa7IpTnPQ', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### POST /v1/project/:id/compile

    var options = {
        form: {
            "view": "webview+",
            "version": "3.5",
            "ios": "true",
            "android": "true",
            "file": "/my/folder/file.zip"
        }
    };

    api.post('/project/W6m62sfubmtOxBa7IpTnPQ/compile', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### POST /v1/project/:id/compile/:platform

Compile specific platforms:

    var options = {
        form: {
            "view": "webview+",
            "version": "3.5",
            "file": "/my/folder/file.zip"
        }
    };

    api.post('/project/W6m62sfubmtOxBa7IpTnPQ/compile/android', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### DELETE /v1/project/:id

    api.del('/project/W6m62sfubmtOxBa7IpTnPQ', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

## API

### client.auth(options, callback)

CocoonJS Cloud Authentication.

Authentications with CocoonJS Cloud and returns an instance of `API`.
The authentication credentials must be a username and password.

#### Options:

  - `options` `{Object}` is the authentication settings.
  - `options.username` `{String}` is the cocoonjs cloud username.
  - `options.password` `{String}` is the cocoonjs cloud password.
  - [`options.proxy`] `{String}` specifies an optional proxy server. e.g. 'http://myproxy.com:8181'.
  - `callback` `{Function}` is trigger after the authentication.
    - `e` `{Error}` is null unless there is an error.
    - `api` `{Object}` is the `API` instance to interact with cocoonjs cloud.

#### Example:

    var client = require('cocoonjs-cloud-api');

    client.auth({ username: 'user@email.com', password: 'lalala' }, function(e, api) {
        if (e) {
            console.log('error:', e);
            return;
        }

        // make some api requests
    });

### api(path, [options], [callback])

API Request.

Create a RESTful request to the CocoonJS Cloud API. The `api` function is a
wrapper to [request][github-request]'s interface.

The `path` parameter is a relative path to a CocoonJS Cloud API response.
For example, to the resource `https://api.ludei.com/v1/project` is specified
as the path `/project`.

The `options` parameter maps directly to [request][github-request]'s options.

The default request method is `GET`. You can specify a specific but you can be changed
in the `options` parameters (e.g. `{ method: 'POST' }`).

To send form data, you can use the `options.form` parameter. If the key 'file' is found the submission Content-Type is 'multipart/form-data' else 'application/json' are assumed.

#### Options:

  - `path` `{String}` is a relative resource path (e.g. `"/project"`).
  - `[options]` `{Object}` is a request options object.
  - `[callback]` `{Function}` is trigger after the request
    - `e` `{Error}` is null unless there is an error
    - `data` `{Object}` is the JSON response.

#### Example: GET Request

    api('/project', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

#### Example: POST Request

    var options = {
        form: {
            title: 'My App',
            create_method: 'file'
            file: '/path/to/app.zip'
        },
        method: 'POST'
    };

    api('/project', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### api.get(path, [options], [callback])

GET API Request.

A convenience function for `api(path, [options], [callback])`, where `options`
uses `{ method: 'GET' }`.

#### Options:

  - `path` `{String}` is a relative resource path (e.g. `"/project"`).
  - `[options]` `{Object}` is a request options object.
  - `[callback]` `{Function}` is trigger after the request
    - `e` `{Error}` is null unless there is an error
    - `data` `{Object}` is the JSON response.

#### Example:

    api.get('/me', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### api.post(path, [options], [callback])

POST API Request.

A convenience function for `api(path, [options], [callback])`, where `options`
uses `{ method: 'POST' }`.

#### Options:

  - `path` `{String}` is a relative resource path (e.g. `"/project"`).
  - `[options]` `{Object}` is a request options object.
  - `[callback]` `{Function}` is trigger after the request
    - `e` `{Error}` is null unless there is an error
    - `data` `{Object}` is the JSON response.

#### Example:

    var options = {
        form: {
            "title": "My App created using the API",
            "package": "com.domain.bundleid",
            "version": "0.1"
        }
    };

    api.post('/project', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### api.put(path, [options], [callback])

PUT API Request.

A convenience function for `api(path, [options], [callback])`, where `options`
uses `{ method: 'PUT' }`.

#### Options:

  - `path` `{String}` is a relative resource path (e.g. `"/project"`).
  - `[options]` `{Object}` is a request options object.
  - `[callback]` `{Function}` is trigger after the request
    - `e` `{Error}` is null unless there is an error
    - `data` `{Object}` is the JSON response.

#### Example:

    var options = {
        form: {
            "title": "My App created using the API Updated",
            "package": "com.domain.bundleid",
            "version": "0.2"
        }
    };

    api.put('/project/W6m62sfubmtOxBa7IpTnPQ', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### api.del(path, [options], [callback])

DELETE API Request.

A convenience function for `api(path, [options], [callback])`, where `options`
uses `{ method: 'DELETE' }`.

#### Options:

  - `path` `{String}` is a relative resource path (e.g. `"/project"`).
  - `[options]` `{Object}` is a request options object.
  - `[callback]` `{Function}` is trigger after the request
    - `e` `{Error}` is null unless there is an error
    - `data` `{Object}` is the JSON response.

#### Example:

    api.del('/project/W6m62sfubmtOxBa7IpTnPQ', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### api.defaults(options)

This maps directly to [request][github-request]'s `default` method.

> This method returns a wrapper around the normal request API that defaults to whatever options you pass in to it.

[rest-api-docs]: https://api.ludei.com/
[github-request]: https://github.com/mikeal/request


