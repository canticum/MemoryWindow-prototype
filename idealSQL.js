const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM('<!DOCTYPE html><html></html>');
const $ = require('jquery')(window);
var request = require('request');

var http = require("http");

//var url = "http://designav.io/api/image?limit=10";
var url = "http://designav.io/api/image/search/"
        + encodeURIComponent("#台中港")
        + "?limit=10";

http.get(url, function (res) {
    var body = '';

    res.on('data', function (chunk) {
        body += chunk;
    });
    res.on('end', function () {
        var data = JSON.parse(body);
        var str = JSON.stringify(data);
        var fs = require("fs");
        fs.writeFile("data/data.json", str, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
//                console.log(body);
            }
        });
        data.forEach(function (r, index) {
            IsValidImageUrl(r.img_link, function (isValid) {
                console.log((index + 1) + ".");
                console.log("Image Link: " + r.img_link);
                console.log("Link Valid: " + isValid);
//                console.log("Title: " + JSON.parse(r.detail_infos).title);
            });
        });
    });
    function IsValidImageUrl(url, callback) {
        request.get(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback("true");
            } else {
                callback("false");
            }
        });
    }
}).on('error', function (e) {
    console.log("Got an error: ", e);
});

