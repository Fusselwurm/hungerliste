#!/usr/bin/node
/*global console,setTimeout */
var
    startPage = 'https://menueweb.hofmann-menue.de/alacarte_33335/MenueTafel.aspx',
    http = require('https'),
    options = {
        host: 'menueweb.hofmann-menue.de',
        port: '80'
    },
    phantom = require('node-phantom'),
    returnHofmannTable = function () {

        var
            //document.evaluate('//*[@id="grdTafel"]/tbody/tr[14]', document, null, XPathResult.ANY_TYPE);
            resultset = document.evaluate('//div', document, null, XPathResult.ANY_TYPE),
            next,
            res = [];

        while ((next = resultset.iterateNext())) {
            res.push(next);
        }
        return res;
    };



//http.request(options);

phantom.create(function (err, ph) {

    ph.createPage(function (err, page) {
        page.open(startPage, function (err, status) {
           console.log(status);

            setTimeout(function () {
                page.evaluate(returnHofmannTable, function (err, res) {
                    console.log(res);

                    ph.exit();
                    process.exit();
                });
            }, 3000);
            console.info('results in 3s...');
        });
    });

});


//
