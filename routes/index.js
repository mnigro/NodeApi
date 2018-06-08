var express = require("express");
var app = express();
var https = require("https");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/states', function(req, res) {
    //res.contentType("application/json");
    var states=null;
    apiMeli('https://api.mercadolibre.com/classified_locations/countries/BR',function (data) {
        res.contentType("application/json; charset=utf-8");
        states = data["states"];
        res.send(JSON.stringify(states));
    });

});

// res.send('respond with a resource');

app.get('/cities/:id', function(req, res) {
    var cities=null;
    apiMeli('https://api.mercadolibre.com/classified_locations/states/' + req.params.id,function (data) {
        res.contentType("application/json; charset=utf-8");
            cities = data["cities"];
        res.send(JSON.stringify(cities));
    });
});

app.get('/neighborhoods/:id', function(req, res) {
    var neighborhood=null;
    apiMeli('https://api.mercadolibre.com/classified_locations/cities/' + req.params.id,function (data) {
        res.contentType("application/json; charset=utf-8");
            neighborhood = data["neighborhoods"];
        res.send(JSON.stringify(neighborhood));
    });
});

function apiMeli(url, callback) {
    https.get(url, function (res) {
        var data ='';
        res.on('data', function (d) {
            data += d;
        });

        res.on('end', function (d) {
            callback(JSON.parse(data));
        });
        res.on('error', function (e) {
            console.error(e);
        });
    });
}

module.exports = app;
