#!/usr/bin/node
/*global console,setTimeout, require */
var
    config = require('../config'),
    async = require('../node_modules/async/lib/async'),
    http = require('http'),
    hofmannResult = null,
    hofmannLogin = require('../lib/hofmann-login'),
    hofmannExtractor = require('../lib/hofmann-extractor'),
    pid = process.pid,
    printResult = function (set) {
        console.info((set.energyTotal).toFixed(0) + 'kJ ' + set.name);
    },
    setViewPortSize = function (page, callback) {
        page.set('viewportSize', { width: 1600, height: 900 }, function (err) {
            callback(err, page);
        });
    },
    setClipRect = function (page, callback) {
        page.set('clipRect', { left: 0, top: 0, width: 1600, height: 900 }, function (err) {
            callback(err, page);
        });
    },
    setPageOnInitialized = function (page, callback) {
        page.evaluate(function () {
            (function () {
                var userAgent = window.navigator.userAgent,
                    platform = window.navigator.platform;
//
//                window.navigator.__defineGetter__('width', function () {
//                    window.navigator.sniffed = true;
//                    return userAgent;
//                });
//
//                window.navigator.__defineGetter__('height', function () {
//                    window.navigator.sniffed = true;
//                    return platform;
//                });
                window.screen = {
                    width: 1600,
                    height: 900
                };
            })();
        }, function (err) {
            callback(err, page);
        });
    },
    logCurrentUrl = function (page, callback) {
        page.get('url', function (err, url) {
            console.log('current url is: ' + url);
            callback(null, page);
        });
    },
    getAndSetUserAgent = function (page, callback) {
        page.get('settings', function (err, settings) {
            console.info('switching user agent from: ' + JSON.stringify(settings.userAgent));
            console.info('to ' + JSON.stringify(config.userAgent));
            settings.userAgent = config.userAgent;
            page.set('settings', settings, function () {
                callback(null, page);
            });
        });
    },
    getNewPage = function (ph, callback) {
        ph.createPage(callback);
    },
    openMenuTafel = function (page, callback) {
        console.log('grrr öffne richtige seite...');
        page.open('https://menueweb.hofmann-menue.de/alacarte_33335/MenueTafel.aspx', function (err, status) {
            console.log('...opened: ' + status);
            page.clearCookies();
            callback(err, page);
        });
    },
    openLoginPage = function (page, callback) {
        page.open(config.loginPage, function (err, status) {
            if (err) {
                throw err;
            }
            console.log('page opened: ' + status);
            callback(err, page);
        });
    },
    setOnConsoleMessage = function (page, callback) {
        page.set('onConsoleMessage', function (msg) {
            console.log('browser console message: ' + msg);
        }, function (err) {
            callback(err, page);
        });
    },
    render = function (page, callback) {
        var imgName = pid + '_' + (new Date()).getTime() + '.png';
        page.render(imgName, function (err) {
            callback(err, page);
        });
    },
    phantom = require('node-phantom'),
    doTheThing = function () {
        async.waterfall([
            function (callback) {
                phantom.create(
                    function (err, ph) {
                        callback(err, ph);
                    }, {
                        parameters:
                        {
                            'ignore-ssl-errors':'yes',
                            'disk-cache': 'true',
                            'max-disk-cache-size': '16384',
                            'cookies-file': '/tmp/hungerliste.cookies'
                        }
                    }
                );
            },
            getNewPage,
            setPageOnInitialized,
            setViewPortSize,
            setClipRect,
            setOnConsoleMessage,
            getAndSetUserAgent,
            openLoginPage,
            logCurrentUrl,
            hofmannLogin,
            //render,
            //openMenuTafel,
            logCurrentUrl,
            hofmannExtractor,
            function (page, result, callback) {
                console.log(result);
                hofmannResult = result.result;
                callback(null, page);
            },
            //render
        ], function (err) {
            if (err) {
                console.log('end callback with error : ');
                console.error(err);
            }
        });

    };

hofmannLogin.setCredentials(config.username, config.password, config.kundenNummer);

console.log('creating server on port ' + config.port + '...');
http.createServer(function (request, response) {

    console.log('getting new request');


    if (request.method === 'OPTIONS') {
        response.writeHead(200, 'OK', {
            'Allow' : 'OPTIONS, GET',
            'Access-Control-Allow-Origin': '*'
        });
        response.end();
        return;
    }

    if (request.method !== 'GET') {
        response.writeHead(405, 'method not allowed', {
            'Allow' : 'OPTIONS, GET',
            'Access-Control-Allow-Origin': '*'
        });
        response.end();
        return;
    }

    request.on('data', function () {
        console.log('got data :/');
    });

    request.on('end', function () {
        var responseCode = hofmannResult ? 200 : 503,
            responseBody = JSON.stringify(hofmannResult);
        response.writeHead(responseCode, 'This is what I know', {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json; charset=utf8'
            //'Content-Length': responseBody.length
        });
        response.end(responseBody, "utf8");
    });
}).listen(config.port);


doTheThing();
setInterval(doTheThing, 5*60*1000);
