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
    phantom = require('node-phantom');

hofmannLogin.setCredentials(config.username, config.password);

async.waterfall([
    phantom.create,
    function (ph, callback) {
        ph.createPage(callback);
    },
    function (page, callback) {
        page.open(config.loginPage, function (err, status) {
            if (err) {
                throw err;
            }
            console.log('page opened: ' + status);
            callback(err, page);
        });
    },
    hofmannLogin,
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
