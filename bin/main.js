#!/usr/bin/node
/*global console,setTimeout */
var
    startPage = 'https://menueweb.hofmann-menue.de/alacarte_33335/MenueTafel.aspx',
    http = require('https'),
    hofmannLogin = require('../lib/hofmann-login'),
    hofmannExtractor = require('../lib/hofmann-extractor'),
    options = {
        host: 'menueweb.hofmann-menue.de',
        port: '80'
    },

    printResult = function (set) {
        console.info((set.energyTotal).toFixed(0) + 'kJ ' + set.name);
    },
    phantom = require('node-phantom');


//http.request(options);

phantom.create(function (err, ph) {

    ph.createPage(function (err, page) {
        page.open(startPage, function (err, status) {
           console.log(status);

            setTimeout(function () {

                hofmannLogin(page, function (err, res) {

                    console.log(arguments);
                    res.forEach(printResult);

                    console.log(res);

                    hofmannExtractor(page, function () {

                        console.log(arguments);
                        res.forEach(printResult);

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
