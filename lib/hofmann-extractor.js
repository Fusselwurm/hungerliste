/*jshint browser:true */
/*global document, XPathResult, parseInt  */

var
    extractor = function () {
        var
            /**
             * @return Array
             */
                xpathGetAll = function (expression, element) {
                var xpathresult = document.evaluate(expression, element || document, null, XPathResult.ANY_TYPE);
                var res = [], tmp;
                while ((tmp = xpathresult.iterateNext())) {
                    res.push(tmp);
                }
                return res;
            },
            /**
             * @return DOMNode
             */
                xpathGetFirst = function (expression, element) {
                var xpathresult = document.evaluate(expression, element || document, null, XPathResult.ANY_TYPE);
                return xpathresult.iterateNext();
            },
            addEnergyTotal = function (set) {
                set.energyTotal = set.energyPerKg * set.massInKg;
            },
            rows = xpathGetAll('//tr[@class="clsTableItemBestell"]', document),
            res = [];

        rows.forEach(function (row) {
            var resultset;
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
                res.push(e);
            }
        });

        res = res.sort(function (a, b) {
            return a.energyTotal - b.energyTotal;
        });


    },
    openList = function (callback) {
        __doPostBack('dlProduktGruppen$_ctl0$lbProduktGruppe','');
        setTimeout(callback);
    };


/**
 *
 * evaluate this in teh phantom page
 */
module.exports = function (page, callback) {
    page.evaluate(openList, function () {
        page.evaluate(extractor, callback);
    });


};
