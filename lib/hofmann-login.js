var
    username = '',
    password = '',
    credentialsSet = false,
    waitForPage = function(page, callback) {
        setTimeout(function () {
            page.get('url', function (err, url) {
                console.log('wir sind auf ' + url);
                callback(err, page);
            });
        }, 5000);
    },
    login = function (callback) {
        document.querySelector('#txtPassword').value = password;
        document.querySelector('#txtUser').value = username;
        document.querySelector('#btnLogin').click(); // yes. click.
        callback();
    };

module.exports = function (page, callback) {
    if (!credentialsSet) {
        throw new Error('plz set credentials first!');
    }
    console.log('login starting');
    page.evaluate('window.password = ' + JSON.stringify(password));
    page.evaluate('window.username = ' + JSON.stringify(username));

    page.evaluate(login, function () {
        console.log('login executed, waiting..');
        waitForPage(page, callback);
    });

};

module.exports.setCredentials = function (user, pass) {
    credentialsSet = true;
    username = user;
    password = pass;
};
