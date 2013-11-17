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
            page.set('settings.userAgent', config.userAgent);
            callback(null, page);
        });
    },
    getNewPage = function (ph, callback) {
        ph.createPage(callback);
    },
    openMenuTafel = function (page, callback) {
        console.log('grrr öffne richtige seite...');
        page.open('https://menueweb.hofmann-menue.de/alacarte_33335/MenueTafel.aspx', function (err, status) {
            console.log('...opened: ' + status);
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
    openMenuTafel,
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
/*
 phantom.create(function (err, ph) {
 ph.createPage(function (err, page) {
 page.open(config.loginPage, function (err, status) {

 setTimeout(function () {

 hofmannLogin(page, function (err, res) {
 if (err) {
 throw err;
 }
 console.info('login submitted (?)');

 hofmannExtractor(page, function (err, res) {

 if (err) {
 throw err;
 }

 console.log(res);

 ph.exit();
 process.exit();
 });
 });
 }, 3000);
 console.info('results in 3s...');
 });
 });

 });


 //
 /*



 res = res.map(function (e) {
 document.evaluate('[clsNaehrwerte])
 return []
 });*/
