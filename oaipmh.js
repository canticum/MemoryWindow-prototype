const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM('<!DOCTYPE html><html></html>');
const $ = require('jquery')(window);

const XMLHttpRequest = require("w3c-xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

xhr.open("GET", "http://data.digitalculture.tw/taichung/oai?verb=ListRecords&metadataPrefix=oai_dc", true);

xhr.addEventListener('load', function (event) {
    var data = xhr.response;
    var fs = require('fs');
    fs.writeFile("data/data_download.xml", data.toString(), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
    var records = $(data).find("record");
    console.log('records.length = ' + records.length);

    records.each(function (index) {
//        var header = $(this).find("header");
        var metadata = $(this).find("metadata");
//        console.log("[" + (index + 1) + "]" + ". ------------------------------");
//        console.log("Identifier: " + header.find("identifier").text());
//        console.log("Title: " + metadata.find("dc\\:title").text());
//        console.log("Type: " + metadata.find("dc\\:type").text());
        var descriptions = metadata.find("dc\\:description");
//        var desc = descriptions.filter(function () {
//            return !$(this).text().startsWith("http://");
//        });
//        console.log("Description: "+ desc.text());
        var link = descriptions.filter(function () {
            return $(this).text().startsWith("http://")
            && $(this).text().toLowerCase().endsWith(".jpg");
        });
//        console.log("Link: " + link.text());
        if (link.text())
            console.log('"' + link.text() + '",');
    });
}, false);
xhr.send();