const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM('<!DOCTYPE html><html></html>');
const $ = require('jquery')(window);
const request = require('request');
const http = require("http");
const fs = require("fs");

const json = require('./libs/json');

function Record(id, content, img_link, detail_infos) {
    this.id = id;
    this.content = content;
    this.img_link = img_link;
    this.detail_infos = detail_infos;
    this.title = detail_infos.title;
    this.img_link_valid = false;
}

var selector = "#台中";
var limit = 50;
var api = (selector.split(" ").length > 1) ?
        "http://designav.io/api/image/search_multi/" :
        "http://designav.io/api/image/search/";

var url = api + encodeURIComponent(selector) + "?limit=" + limit;
console.log(url);

var records = [];
var valid_count = 0, count = 0;
json.fetch(url, (data) => {
    console.log("Total records: " + data.length);
    fs.mkdir("data", (err) => {
        if (!err || err.code === 'EEXIST')
            json.write("data/data.json", data);
        data.forEach((rec) => {
            var record = new Record(rec.id, rec.content,
                    rec.img_link, JSON.parse(rec.detail_infos));
            records.push(record);
            IsValidImageUrl(rec.img_link, (isValid) => {
                if (isValid) {
                    record.img_link_valid = true;
                    valid_count++;
                }
                next();
            });
        });
    });
    
    function next() {
        count++;
        if (count === data.length) {
            fs.mkdir("data/records", (err) => {
                records.forEach((record) => {
                    var filename = "data/records/record_" + record.id + ".json";
                    if (!err || err.code === 'EEXIST')
                        json.write(filename, record.detail_infos);
                });
            });
            console.log("Valid links: " + valid_count);
            console.log("Valid percentage: " + (valid_count / data.length * 100) + "%");
        }
    }
});

function IsValidImageUrl(url, callback) {
    request.get(url, (error, response, body) => {
        callback(!error && response.statusCode === 200);
    });
}

function getWordbreak(content, callback) {
    var text = content;
    var api2 = "http://designav.io/api/image/wordbreak/";
    var url = api2 + encodeURIComponent(text);
//    console.log(decodeURIComponent(url));
    (url, function (content) {
        callback(content);
    });
}
