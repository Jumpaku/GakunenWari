/// <reference path="lodash.js"/>
/// <reference path="utility.js"/>
/// <reference path="initialize.js">
/// <reference paht="htmlio.js">

var getLowest = function (people) {
    for (var i = 0; i < indexes.length; ++i) {
        if (people[i] !== 0) {
            return i;
        }
    }
}

var getHeighest = function (people) {
    for (var i = indexes.length - 1; i >= 0; --i) {
        if (people[i] !== 0) {
            return i;
        }
    }
}

var calcPays = function (people, total, delta) {
    var sigma = _.sum(_.zipWith(indexes, people, mult));// \sum_{i in [0, n)} (i * people_i)
    var n = _.sum(people);// 全人数

    if (delta === 0) {
        return people.map(constant(0));
    }

    // minPay = (total - delta * \sum_{i in [0, n)} (people_i * i)) / n
    var minPay = (total - delta * sigma) / n;
        
    // pay_i = minPay + i * delta
    return indexes.map(function (i) {
        return minPay + i * delta; });
}
