#!/usr/bin/node
/*global console,setTimeout, require */
var
    config = require('../config'),
    hofmannLogin = require('../lib/hofmann-login'),
    hofmannExtractor = require('../lib/hofmann-extractor'),

    printResult = function (set) {
        console.info((set.energyTotal).toFixed(0) + 'kJ ' + set.name);
    },
    phantom = require('node-phantom');


//http.request(options);

phantom.create(function (err, ph) {

    if (err) {
        console.error(err);
        process.exit(1);
        return;
    }

    ph.createPage(function (err, page) {

        if (err) {
            console.error(err);
            process.exit(2);
            return;
        }

        page.open(config.loginPage, function (err, status) {
           console.log('page opened: ' + status);

            if (err) {
                throw err;
            }

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
