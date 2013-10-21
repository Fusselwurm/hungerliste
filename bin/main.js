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
	xpathGetAll = function (expression, element) {
		var xpathresult = document.evaluate(expression, element || document, null, XPathResult.ANY_TYPE);
		var res = [], tmp;
		while ((tmp = xpathresult.iterateNext())) {
			res.push(tmp);
		}
		return res;
	},
	xpathGetFirst = function (expression, element) {
		var xpathresult = document.evaluate(expression, element || document, null, XPathResult.ANY_TYPE);
		return tmp = xpathresult.iterateNext();
	},
	addEnergyTotal = function (set) {
		set.energyTotal = set.energyPerKg * set.massInKg;
	},
	printResult = function (set) {
		console.info((set.energyTotal).toFixed(0) + 'kJ ' + set.name);
	};
    returnHofmannTable = function () {

        var
            //document.evaluate('//*[@id="grdTafel"]/tbody/tr[14]', document, null, XPathResult.ANY_TYPE);
            rows = xpathGetAll('//tr[@class="clsTableItemBestell"]', document, null, XPathResult.ANY_TYPE),
            next,
            res = [];

	rows.forEach(function (row) {
		try {
			resultset = {
				name: xpathGetFirst('.//div[@class="divTafelBezei"]', row).textContent, 
				energyPerKg: parseInt(xpathGetFirst('.//*[contains(@id,"divBrennwert")]', row).textContent, 10) * 10,
				massInKg: parseInt(xpathGetFirst('.//*[contains(@id, "Einwaage")]//div[@class="clsNwHeader"]', row).textContent, 10) / 1000
			};
			addEnergyTotal(resultset);
			res.push(resultset);
		} catch (e) {
			console.error(e);
		}
	});
	
	res = res.sort(function (a, b) {
		return a.energyTotal - b.energyTotal;
	});
	
	res.forEach(printResult);
	
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
/*



res = res.map(function (e) {
	document.evaluate('[clsNaehrwerte])
	return []
});*/