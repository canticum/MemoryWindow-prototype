const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM('<!DOCTYPE html><html></html>');
const $ = require('jquery')(window);
var request = require('request');
var http = require("http");

var selector = "#台中";
var limit = 200;
var api = (selector.split(" ").length > 1) ?
        "http://designav.io/api/image/search_multi/" :
        "http://designav.io/api/image/search/";
var url = api + encodeURIComponent(selector) + "?limit=" + limit;
console.log(url);

http.get(url, function (res) {
    var body = '';

    res.on('data', function (chunk) {
        body += chunk;
    });
    res.on('end', function () {
        var data = JSON.parse(body);
        var str = JSON.stringify(data);
        var fs = require("fs");
        fs.mkdir("data", (err) => {
            if (!err || err.code === 'EEXIST')
                fs.writeFile("data/data.json", str, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("The file was saved!");
                    }
                });
        });
        var valid_links = [];
        data.forEach(function (rec) {
            IsValidImageUrl(rec.img_link, function (isValid) {
                if (isValid)
                    valid_links.push(rec.img_link);
                next();
            });
        });
        var count = data.length;
        function next() {
            count--;
            if (count === 0) {
                console.log("Total records: " + data.length);
                valid_links.forEach(function (link) {
                    console.log("'" + link + "',");
                });
                console.log("Valid links: " + valid_links.length);
                console.log("Valid percentage: " + (valid_links.length / data.length * 100) + "%");
            }
        }
//                console.log("Title: " + JSON.parse(r.detail_infos).title);
    });
    function IsValidImageUrl(url, callback) {
        request.get(url, function (error, response, body) {
            callback(!error && response.statusCode === 200);
        });
    }
}).on('error', function (e) {
    console.log("Got an error: ", e);
});

