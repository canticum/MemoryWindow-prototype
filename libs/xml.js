const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM('<!DOCTYPE html><html></html>');
const $ = require('jquery')(window);
const fs = require("fs");
const XMLHttpRequest = require("w3c-xmlhttprequest").XMLHttpRequest;

module.exports = {
    fetch,
    write,
    Record
};

function fetch(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
        var data = xhr.response;
        callback(data);
    };
    xhr.send(null);
}

function write(url, data) {
    fs.writeFile(url, data.toString(), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(url + " was saved!");
        }
    });
}

function Record(header, metadata) {
    this.identifier = $(header).find("identifier").text();
    this.title = $(metadata).find("dc\\:title").text();
    this.subjects = $(metadata).find("dc\\:subject").map(function () {
        return $(this).text();
    }).get();
    this.description = $(metadata).find("dc\\:description").filter(function () {
        return (!$(this).text().startsWith("http://"));
    }).text().replace(/\n/g, '; ');
    this.link = decodeURIComponent($(metadata).find("dc\\:description").filter(function () {
        return ($(this).text().startsWith("http://")) ;
    }).text());
    this.filetype = this.link.split(".").pop();

    this.contains = function (keyword) {
        for (index = 0; index < this.subjects.length; index++) {
            if (this.subject[index].contains(keyword))
                return this.title;
        }
        if (this.title.contains(keyword))
            return this.title;
        if (this.description.contains(keyword))
            return this.description;
    };
}
