const json = require('./json.js');

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM('<!DOCTYPE html><html></html>');
const $ = require('jquery')(window);
const request = require('request');
const http = require("http");

module.exports = {
    query,
    getWordbreak
};

function query(query_text, limit, callback) {

    var api = 
            /*(query_text.split(" ").length > 1) ?
            "http://designav.io/api/image/search_multi/" : */
            "http://designav.io/api/image/search/";

    var url = api + encodeURIComponent(query_text) + "?limit=" + limit;
    console.log(url);

    var records = [];
    var count = 0;
    json.fetch(url, (data) => {
        console.log("Total records: " + data.length);
        data.forEach((rec) => {
            var record = new json.Record(rec.id, rec.content,
                    rec.img_link, JSON.parse(rec.detail_infos));
            records.push(record);
            IsValidImageUrl(rec.img_link, (isValid) => {
                record.img_link_valid = isValid;
                next();
            });
        });
        function next() {
            count++;
            if (count === data.length) {
                result = [];
                records.forEach((record) => {
                    if (record.img_link_valid) {
                        var text;
                        if (record.content.includes(query_text))
                            text = record.content.replace(/\n/g, " ");
                        else if (record.detail_infos.includes(query_text))
                            text = record.detail_infos.replace(/\n/g, " ");
                        result.push({
                            img_url: record.img_link,
                            content: text
                        });
                    }
                });
                callback(result);
            }
        }
    });

}

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

