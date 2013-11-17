/*jshint browser:true */
/*global document, XPathResult, parseInt  */

var
    extractor = function () {
        var
            getXpathExpressions = function () {
                var pageTypeAlt = document.location.href.toLowerCase().indexOf('menuetafelalt.aspx') !== -1;

                return pageTypeAlt ? {
                    rows: '//tr[@class="clsTableItemBestell"]',
                    name: './/span[contains(@id,"Label2")]/text()',
                    energyPer100g: './/*[contains(@id, "divBrennwert")]/text()',
                    mass: './/*[@id="Table6"]//td[contains(@id, "MenueEinwaage")]/following-sibling::td/div[@class="clsNwHeader"]/text()'
                } : {
                    rows: '//tr[@class="clsTableItemBestell"]',
                    name: './/div[@class="divTafelBezei"]/text()',
                    energyPer100g: './/*[contains(@id, "divBrennwert")]/text()',
                    mass: './/*[contains(@id, "Einwaage")]//div[@class="clsNwHeader"]/text()'
                };
            },
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
                set.energyTotal = (set.energyPerKg * set.massInKg).toFixed(0);
            },
            numberFromDomText = function (node) {
                if (node) {
                    return parseInt(node.data, 10);
                }
                return NaN;
            },
            stringFromDomText = function (node) {
               return node ? node.data : '';
            },
            xpathExpressions = getXpathExpressions(),
            rows = xpathGetAll(xpathExpressions.rows, document),
            res;

        res = rows.map(function (row) {
            var
                resultset;
            try {
                resultset = {
                    name: stringFromDomText(xpathGetFirst(xpathExpressions.name, row)),
//                    energyPerKg: parseInt(xpathGetFirst(xpathExpressions.energyPer100g, row), 10) * 10,
                    energyPerKg: numberFromDomText(xpathGetFirst(xpathExpressions.energyPer100g, row)).toFixed(0) * 10,
                    //massInKg: parseInt(xpathGetFirst(xpathExpressions.mass, row), 10) / 1000
                    massInKg: (numberFromDomText(xpathGetFirst(xpathExpressions.mass, row)) / 1000).toFixed(3)
                };
                addEnergyTotal(resultset);
                return resultset;
            } catch (e) {
                window.console && console.error(e);
                return e;
            }
        });

        return {result: res, debug: ''/*document.body.innerHTML*/};
    },
    openList = function () {
        var pageTypeAlt = document.location.href.toLowerCase().indexOf('menuetafelalt.aspx') !== -1;
        if (pageTypeAlt) {
            return;
        }
        __doPostBack('dlProduktGruppen$_ctl0$lbProduktGruppe','')
        //__doPostBack('dlProduktGruppen$_ctl0$lbProduktGruppe','');
    };


/**
 *
 * evaluate this in teh phantom page
 */
module.exports = function (page, callback) {
    page.evaluate(openList, function (err, result) {
        if (err) {
            throw err;
        }
        console.info('waiting a bit for menus to hopefully load...');
        setTimeout(function () {
            page.evaluate(extractor, function (err, result) {
                callback(err, page, result)
            });
        }, 5000);

    });
};
