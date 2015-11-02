/// <reference path="lodash.js"/>

var mult = function (a, b) {
    return a * b;
}

var constant = function (c) {
    return (function () {
        return c;
    });
}

var isValidNumber = function(n){
    return _.isNumber(n) && _.isFinite(n);
}
