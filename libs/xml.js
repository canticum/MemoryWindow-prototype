(function () {
    'use strict';
    var jsdom = require("jsdom");
    var {JSDOM} = jsdom;
    var {window} = new JSDOM('<!DOCTYPE html><html></html>');
    var $ = require('jquery')(window);
    var fs = require("fs");
    var XMLHttpRequest = require("w3c-xmlhttprequest").XMLHttpRequest;

    module.exports = function () {
        var methods = {};

        methods.fetch = function (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onload = function () {
                var data = xhr.response;
                callback(data);
            };
            xhr.send(null);
        };

        methods.write = function (url, data) {
            fs.writeFile(url, data.toString(), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(url + " was saved!");
                }
            });
        };

        methods.Record = function (header, metadata) {
            this.identifier = $(header).find("identifier").text();
            this.title = $(metadata).find("dc\\:title").text();
            this.subjects = $(metadata).find("dc\\:subject").map(function () {
                return $(this).text();
            }).get();
            this.description = $(metadata).find("dc\\:description").filter(function () {
                return (!$(this).text().startsWith("http://"));
            }).text().replace(/\n/g, '; ');
            this.link = decodeURIComponent($(metadata).find("dc\\:description").filter(function () {
                return ($(this).text().startsWith("http://"));
            }).text());
            this.filetype = this.link.split(".").pop();

            this.contains = function (keyword) {
                var result = '';
                if (this.subjects.length > 0) {
                    for (var index = 0; index < this.subjects.length; index++) {
                        if (this.subjects[index].includes(keyword))
                            result = this.subjects[index];
                    }
                    if (result.length > 0)
                        result += ':' + this.title + '。' + this.description;
                }
                if (this.title.includes(keyword))
                    result = this.title + '。' + this.description;
                else if (this.description.includes(keyword))
                    result = this.description;
                return result;
            };
        };

        return methods;
    };
}());

