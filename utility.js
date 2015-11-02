/// <reference path="lodash.js"/>

var mult = function (a, b) {
    return a * b;
}

var constant = function (c) {
    return (function () {
        return c;
    });
}

var satisfiesAll = function () {
    var checkers = _.toArray(arguments);
    return function (x) {
        return checkers.reduce(function (result, checker) {
            return result && checker(x);
        });
    };
}

var isIn = function(min, max){
    return function(x){
        return min <= x && x <= max;
    }
}
