var login = function () {
    document.querySelector('#txtPassword').value = '';
    document.querySelector('#txtUser').value = 'MoritzSchmidt';
};




module.exports = function (page, callback) {

    page.evaluate(new Function ('function () { window.password = "' + + '"}'))
    page.evaluate(login, callback);
};

module.exports.setCredentials = function () {

};
