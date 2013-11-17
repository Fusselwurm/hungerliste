#!/usr/bin/node
/*global console,setTimeout, require */
var
    config = require('../config'),
    async = require('../node_modules/async/lib/async'),
    hofmannLogin = require('../lib/hofmann-login'),
    hofmannExtractor = require('../lib/hofmann-extractor'),

    printResult = function (set) {
        console.info((set.energyTotal).toFixed(0) + 'kJ ' + set.name);
    },
    logCurrentUrl = function (page, callback) {
        page.get('url', function (err, url) {
            console.log('current url is: ' + url);
            callback(null, page);
        })
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
    phantom = require('node-phantom');

hofmannLogin.setCredentials(config.username, config.password);

async.waterfall([
    phantom.create,
    getNewPage,
    getAndSetUserAgent,
    openLoginPage,
    logCurrentUrl,
    hofmannLogin,
    //openMenuTafel,
    logCurrentUrl,
    getAndSetUserAgent,
    hofmannExtractor,
    function (result, callback) {
        console.log('zadumm');
        callback(null, result);
    }
], function () {
    console.log('end callback');
    console.error(arguments);
    console.info('shutting down...');
    process.exit(0);
});