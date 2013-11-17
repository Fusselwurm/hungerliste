var
    credentials,
    waitForPage = function(page, callback) {
        setTimeout(function () {
            page.get('url', function (err, url) {
                console.log('wir sind auf ' + url);
                callback(err, page);
            });
        }, 5000);
    },
    login = function (callback) {
        document.querySelector('#txtPassword').value = credentials.password;
        document.querySelector('#txtUser').value = credentials.username;
        document.querySelector('#txtKunnr').value = credentials.kundenNummer;
        document.querySelector('#btnLogin').click(); // yes. click.
        callback();
    };

module.exports = function (page, callback) {
    if (!credentials) {
        throw new Error('plz set credentials first!');
    }
    console.log('login starting');
    page.evaluate('window.credentials = ' + JSON.stringify(credentials));

    page.evaluate(login, function () {
        console.log('login executed, waiting..');
        waitForPage(page, callback);
    });

};

module.exports.setCredentials = function (user, pass, kundenNummer) {
    credentials = {
        username: user,
        password: pass,
        kundenNummer: kundenNummer
    };
};
