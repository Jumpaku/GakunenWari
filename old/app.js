/// <reference path="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.6.1/lodash.min.js">
/// <reference path="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min.js">
/// <reference paht="https://cdnjs.cloudflare.com/ajax/libs/mathjs/3.1.3/math.min.js">

Value = function () {
    this.v = 0;
};

var total = new Value();
var participants = _.range(0, 4).map(function () { return new Value(); });
var ratio = _.range(0, 4).map(function () { return new Value(); });
var diff = new Value();
var diffamounts = _.range(0, 4).map(function () { return new Value(); });
var ratioamounts = _.range(0, 4).map(function () { return new Value(); });

var variables = {};

function initializeVariables() {
    variables["total"] = total;

    for (var i = 0; i < 4; ++i) {
        variables["dp" + i] = participants[i];
    }
    variables["diff"] = diff;
    for (var i = 0; i < 4; ++i) {
        variables["da" + i] = diffamounts[i];
    }

    for (var i = 0; i < 4; ++i) {
        variables["rp" + i] = participants[i];
    }
    for (var i = 0; i < 4; ++i) {
        variables["rr" + i] = ratio[i];
    }

    for (var i = 0; i < 4; ++i) {
        variables["ra" + i] = ratioamounts[i];
    }
}

function updateView() {
    $("#total").val(variables["total"].v);

    for (var i = 0; i < 4; ++i) {
        $("#dp" + i).val(variables["dp" + i].v);
    }
    $("#diff").val(variables["diff"].v);
    for (var i = 0; i < 4; ++i) {
        $("#da" + i).text(variables["da" + i].v);
    }

    for (var i = 0; i < 4; ++i) {
        $("#rp" + i).val(variables["rp" + i].v);
    }
    for (var i = 0; i < 4; ++i) {
        $("#rr").val(variables["rr" + i].v);
    }

    for (var i = 0; i < 4; ++i) {
        $("#ra" + i).text(variables["ra" + i].v);
    }
}

window.onload = function () {
    var language = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
    if(language.substr(0,2) === "en"){
        window.location.href = "http://jumpaku.github.io/GakunenWari/English/";
    }

    $(function ($) {

        initializeVariables();

        $('.tabbuttons li').click(function () {
            var index = $('.tabbuttons li').index(this);
            $('.tabcontents li').css('display', 'none');
            $('.tabcontents li').eq(index).css('display', 'block');
            $('.tabbuttons li').removeClass('selected');
            $(this).addClass('selected');
        });

        $('.numinput').val(0);

        $('.numinput').on('blur', function (e) {
            var input = String($(this).val());
            var value = input.match(/^\d{1,9}$/) === null ? 0 : parseInt(input);
            $(this).val(value);
            var id = $(this).attr("id");
            variables[id].v = value;

            updateView();
        });

        $('.numinput').on('focus', function (e) {
            $(this).val("");
        });

        $('.numoutput').text(0);

        $('#gakunenwaributton').on('click', function (e) {
            var das = calculateByDiff(
                participants.map(function (v) { return v.v; }), total.v, diff.v);
            for (var i = 0; i < 4; ++i) {
                variables["da" + i].v = das[i];
            }

            var ras = calculateByRatio(
                participants.map(function (v) { return v.v; }), total.v, ratio.map(function (v) { return v.v; }));
            for (var i = 0; i < 4; ++i) {
                variables["ra" + i].v = ras[i];
            }

            updateView();
        })
    });
};

var calculateByDiff = function (participants, total, diff) {
    var n = _.sum(participants);
    if (n === 0) {
        return math.zeros(participants.length);
    }
    var is = _.range(0, 4);
    var sigma = math.dot(is, participants);
    var min = (total - diff * sigma) / n;

    return is.map(function (i) {
        return participants[i] === 0 ?
            0 : math.ceil(min + i * diff);
    });
};

var calculateByRatio = function (participants, total, ratio) {
    var sigma = math.dot(participants, ratio);

    if (sigma === 0) {
        return math.zeros(participants.length);
    }

    return _.range(0, 4).map(function (i) {
        return participants[i] === 0 ?
            0 : math.ceil(ratio[i] * total / sigma);
    });
};

