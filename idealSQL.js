const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM('<!DOCTYPE html><html></html>');
const $ = require('jquery')(window);
var request = require('request');

var http = require("http");

//var url = "http://designav.io/api/image?limit=10";
//

var selector = "#台中 #人生";
var limit = 1000;
var api = (selector.split(" ").length > 1) ?
        "http://designav.io/api/image/search_multi/" :
        "http://designav.io/api/image/search/";
var url = api + encodeURIComponent(selector) + "?limit=" + limit;
//if (selector.split(" ") > 1) {
//    url = "http://designav.io/api/image/search_multi/"
//            + encodeURIComponent(selector)
//            + "?limit=150";
//} else {
//    url = "http://designav.io/api/image/search/"
//            + encodeURIComponent(selector)
//            + "?limit=1000";
//}

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
        var links = []
        data.forEach(function (r, index) {
            IsValidImageUrl(r.img_link, function (isValid) {
                links[index] = {
                    image_link: r.img_link,
                    link_valid: isValid
                }
                next();
            });
        });
        var count = data.length;
        function next() {
            count--;
            if (count === 0) {
                console.log("Total records: " + links.length);
                var valid_count = 0;
                links.forEach(function (link, index) {
//                    console.log((index + 1) + ".");
//                    console.log("Image Link: " + link.image_link);
//                    console.log("Link Valid: " + link.link_valid);
                    if (link.link_valid)
                        valid_count++;
                    console.log("'" + link.image_link + "',");
                });
                console.log("Valid links: " + valid_count);
                console.log("Valid percentage: " + (valid_count / links.length * 100) + "%");
            }
        }
//                console.log("Title: " + JSON.parse(r.detail_infos).title);
    });
    function IsValidImageUrl(url, callback) {
        request.get(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(true);
            } else {
                callback(false);
            }
        });
    }
}
).on('error', function (e) {
    console.log("Got an error: ", e);
});

