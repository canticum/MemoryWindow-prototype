(function () {
    'use strict';
    var jsdom = require("jsdom");
    var {JSDOM} = jsdom;
    var {window} = new JSDOM('<!DOCTYPE html><html></html>');
    var $ = require('jquery')(window);

    var xml = require('./xml.js')();
    var {Record} = require('./xml.js')();
    var {Record_Query} = require('../config.js').DATA;
    var cf = require('../config.js').DATA;

    module.exports = function (limit, callback) {
        var methods = {};
        var dataset = [];

        methods.refresh = function () {
            xml.fetch(cf.TWDC.URL, (data) => {
                var xml_records = $(data).find("record");

                xml_records.each(function () {
                    var record = new Record(
                            $(this).find("header"),
                            $(this).find("metadata"));
                    if (record.link && cf.FILETYPES.indexOf(record.filetype) > -1)
                        dataset.push(record);
                });
                console.log("Initializing twdc dataset completed. Total record fetched = "
                        + dataset.length);
                callback();
            });
        };

        methods.query = function (text, callback) {
            var records = [];
            var n = limit;
            for (var i = 0; i < dataset.length; i++) {
                var result = dataset[i].contains(text);
                if (result.length > 0) {
                    n--;
                    records.push(new Record_Query(
                            dataset[i].link,
                            result
                            ));
                }
//                if (n === 0)
//                    break;
            }
            callback(records);
        };

        methods.refresh();
        return methods;
    };
}());


