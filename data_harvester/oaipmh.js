const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM('<!DOCTYPE html><html></html>');
const $ = require('jquery')(window);
const fs = require("fs");

const xml = require('./libs/xml.js');
const json = require('./libs/json.js');

var records = [];
var url = "http://data.digitalculture.tw/taichung/oai?verb=ListRecords&metadataPrefix=oai_dc";
xml.fetch(url, (data) => {
    fs.mkdir("data", (err) => {
        if (!err || err.code === 'EEXIST')
            xml.write("data/data_download.xml", data);
    });
    var xml_records = $(data).find("record");
    console.log('records.length = ' + xml_records.length);
    var descriptions = [], titles = [];
    xml_records.each(function () {
        var record = new xml.Record(
                $(this).find("header"),
                $(this).find("metadata"));
        records.push(record);
        if (record.description().length > 0)
            descriptions.push(record.description());
        if (record.title().length > 0)
            titles.push(record.title());
//        console.log("Identifier: " + record.identifier());
//        console.log("[" + (index + 1) + "]" + ". ------------------------------");
//        console.log("Title: " + metadata.find("dc\\:title").text());
//        console.log("Type: " + metadata.find("dc\\:type").text());
//        console.log("Link: " + record.link());
        var filetypes = ['jpg', 'png'];
        var link = record.link(filetypes);
//        var link = record.link();
        if (link.length > 0) {
            console.log(record.title());
            console.log(record.subjects());
            console.log('"' + link + '",');
        }
    });
    json.write("data/descriptions.json", descriptions);
    json.write("data/titles.json", titles);
});