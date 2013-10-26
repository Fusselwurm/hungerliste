var
    username = '',
    password = '',
    waitForPage = function(page, callback) {

        setTimeout(function () {
            page.get('url', function (err, url) {
                console.log('wir sind auf ' + url);
                callback(err);
            });
        }, 2000);
    },
    login = function (callback) {
        document.querySelector('#txtPassword').value = password;
        document.querySelector('#txtUser').value = password;
        document.querySelector('#btnLogin').click(); // yes. click.


    };




module.exports = function (page, callback) {

    page.evaluate('window.password = ' + JSON.stringify(password));
    page.evaluate('window.username = ' + JSON.stringify(username));
    page.evaluate(login, callback);
    waitForPage(page, callback);
};

exports.setCredentials = function (user, pass) {
    username = user;
    password = pass;
};
