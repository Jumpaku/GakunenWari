/// <reference path="initialize.js">

var readNumber = function (id) {
    var n = parseInt(document.getElementById(id).value);
    return _.isFinite(n) ? n : 0;
}

var readPeople = function () {
    return indexes.map(function (i) {
        return readNumber("grade" + i);
    });
}

var writePays = function (pays) {
    var people = readPeople();
    pays.forEach(function (pay, i) {
        document.getElementById("pay" + i).innerHTML = String(people[i] === 0 ? 0 : Math.ceil(pay));
    });
}

var reset = function (id, value) {
    document.getElementById(id).value = String(value);
}

var set0IfInvalid = function (id) {
    var n = parseInt(document.getElementById(id).value);
    if (!_.isFinite(n)) {
        reset(id, 0);
    }
}

var selectText = function(id){
    document.getElementById(id).select();
}
