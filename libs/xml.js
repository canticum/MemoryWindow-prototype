const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM('<!DOCTYPE html><html></html>');
const $ = require('jquery')(window);
const fs = require("fs");
const XMLHttpRequest = require("w3c-xmlhttprequest").XMLHttpRequest;

module.exports = {
    fetch: function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            var data = xhr.response;
            callback(data);
        };
        xhr.send(null);
    },
    write: function (url, data) {
        fs.writeFile(url, data.toString(), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(url + " was saved!");
            }
        });
    },
    Record: function (header, metadata) {
        this.header = header;
        this.metadata = metadata;
        this.identifier = function () {
            return $(this.header).find("identifier").text();
        };
        this.link = function (filetypes) {
            var res = $(this.metadata).find("dc\\:description").filter((index, element) => {
                if ($(element).text().startsWith("http://")) {
                    if (!filetypes)
                        return true;
                    for (var type of filetypes) {
                        if ($(element).text().toUpperCase().endsWith(type.toUpperCase()))
                            return true;
                    }
                }
                return false;
            });
            return decodeURIComponent(res.text());
        };
        this.title = function () {
            return $(this.metadata).find("dc\\:title").text();
        };
        this.subjects = function () {
            return $(this.metadata).find("dc\\:subject").map((index, element) => {
//                return $(element).attr("xmlns:dc");
                return $(element).text();
            }).get();
        };
        this.description = function () {
            var res = $(this.metadata).find("dc\\:description").filter((index, element) => {
                return (!$(element).text().startsWith("http://"));
            });
            return res.text();
        };
    }
};