const xml = require('./xml.js');
const json = require('./json.js');

var {twdc_records} = require('./data.js');
var {Record} = require('./xml.js');
var {Record_Query} = require('./data.js');

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM('<!DOCTYPE html><html></html>');
const $ = require('jquery')(window);

var url = "http://data.digitalculture.tw/taichung/oai?verb=ListRecords&metadataPrefix=oai_dc";
var filetypes = ['jpg', 'png', 'JPG', 'PNG'];

module.exports = {
    refresh,
    query
};


function refresh(callback) {
    twdc_records = [];
    xml.fetch(url, (data) => {
        var xml_records = $(data).find("record");

        xml_records.each(function () {
            var record = new Record(
                    $(this).find("header"),
                    $(this).find("metadata"));
            if (record.link && filetypes.indexOf(record.filetype) > -1)
                twdc_records.push(record);
        });
        callback(twdc_records);
    });
}

function query(text) {
    records = [];
    if (twdc_records)
        for (i = 0; i < twdc_records.length; i++) {
            var result = twdc_records[i].find(text);
            if (result)
                records.push(new Record_Query(
                        twdc_records[i].link,
                        twdc_records[i].result
                        ));
        }
    return records;
}

