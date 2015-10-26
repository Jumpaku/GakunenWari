/// <reference path="lodash.js">

var grades = _.zipWith(_.range(1, 7), ["1年", "2年", "3年", "4年", "M 1", "M 2"], function (g, name) {
    return { "grade": g, "gradeName": name };
});

var indexes = grades.map(function (v, i) { return i; });

var writeTable = function () {    
    document.getElementById("tableBody").innerHTML = indexes.map(function (i) {
        return String("<tr><td class=\"c0\">")
            + String(grades[i].gradeName)
            + String("</td> <td class=\"c1\"><input id=\"grade")
            + String(i)
            + String("\" type=\"text\" onblur=\"set0IfInvalid(\'grade")
            + String(i)
            + String("\')\"onfocus=\"eraseText(\'grade")
            + String(i)
            + String("\')\" /></td> <td class=\"c2\"><span id=\"pay")
            + String(i)
            + String("\"></span></td></tr>\n");
    }).reduce(function (prev, curr) { return curr + prev; });
}
