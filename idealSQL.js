const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM('<!DOCTYPE html><html></html>');
const $ = require('jquery')(window);
const request = require('request');
const fs = require("fs");

const json = require('./libs/json');

var selector = "#台中";
var limit = 50;
var api = (selector.split(" ").length > 1) ?
        "http://designav.io/api/image/search_multi/" :
        "http://designav.io/api/image/search/";
var url = api + encodeURIComponent(selector) + "?limit=" + limit;
console.log(url);

json.fetch(url, (data) => {
    fs.mkdir("data", (err) => {
        if (!err || err.code === 'EEXIST') {
            json.write('./data/data.json', data);
        }
    });
    var records = [], titles = [];
    var valid_link_num = 0;
    data.forEach((rec) => {
        var record = new json.Record(rec.id, rec.content,
                rec.img_link, JSON.parse(rec.detail_infos));
        IsValidImageUrl(rec.img_link, function (isValid) {
            if (isValid) {
                record.img_link_valid = true;
                valid_link_num++;
            }
            records.push(record);
            titles.push(record.title);
            next();
        });
    });
    var count = data.length;
    function next() {
        count--;
        if (count === 0) {
            json.write('./data/title.json', titles);
            console.log("Total records: " + data.length);
            records.forEach((record) => {
                console.log("'" + record.title + "',");
            });
            console.log("Valid links: " + valid_link_num);
            console.log("Valid percentage: " + (valid_link_num / data.length * 100) + "%");
        }
    }
//                console.log("Title: " + JSON.parse(r.detail_infos).title);
});

function IsValidImageUrl(url, callback) {
    request.get(url, function (error, response, body) {
        callback(!error && response.statusCode === 200);
    });
}

