(function () {
    'use strict';
    var cf = require('../config.js').DATA;
    var json = require('./json.js')();
    var request = require('request');

    module.exports = function () {
        var methods = {};

        methods.get_url = function (query_text, limit) {
            var api = (query_text.split(" ").length > 1) ?
                    cf.IDEASQL.MULTI_URL : cf.IDEASQL.URL;
            var url = api + encodeURIComponent(query_text) +
                    ((limit > 0) ? "?limit=" + limit : "");
            console.log(decodeURIComponent(url));
            return url;
        };

        methods.query = function (query_text, limit, callback) {
            var records = [];
            var count = 0;
            json.fetch(methods.get_url(query_text, limit), (data) => {
//        console.log("Total records: " + data.length);
                if (data.length === 0)
                    next(0);
                data.forEach((rec) => {
                    var record = new json.Record(rec.id, rec.content,
                            rec.img_link, JSON.parse(rec.detail_infos));
                    records.push(record);
                    methods.IsValidImageUrl(rec.img_link, (isValid) => {
                        record.img_link_valid = isValid;
                        next(1);
                    });
                });
                function next(n) {
                    count += n;
                    if (count === data.length) {
                        var result = [];
                        records.forEach((record) => {
                            if (record.img_link_valid) {
                                var text = record.title.includes(query_text) ?
                                        record.title : record.content;
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
        };

        methods.IsValidImageUrl = function(url, callback) {
            request.get(url, (error, response, body) => {
                callback(!error && response.statusCode === 200);
            });
        };

        methods.getWordbreak = function (content, callback) {
            var text = content;

            var url = cf.IDEASQL.WB_URL + encodeURIComponent(text);
//    console.log(decodeURIComponent(url));
            (url, function (content) {
                callback(content);
            });
        };

        return methods;
    };
}());

