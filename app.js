/// <reference path="initialize.js">
/// <reference psth="htmlio.js">
/// <reference paht="calculate.js">

var executeGakinenWari = function () {
    writePays(calcPays(readPeople(), readNumber("total"), readNumber("delta")));
}

var executeWarikan = function () {
    var pay = readNumber("total") / _.sum(readPeople());
    writePays(indexes.map(constant(pay)));
}

window.onload = function () {
    writeTable();
    indexes.forEach(function (i) {
        document.getElementById("grade" + i).value = 0;
        document.getElementById("pay" + i).innerHTML = 0;
    });
    document.getElementById("total").value = 0;
    document.getElementById("delta").value = 0;
};
