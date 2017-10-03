(function () {
    const cf = require('../config.js').data;
    const json = require('./json.js')();
    const request = require('request');

    module.exports = function () {
        var methods = {};

        methods.query = function (query_text, limit, callback) {
            var api = (query_text.split(" ").length > 1) ?
                    cf.IDEASQL.MULTI_URL : cf.IDEASQL.URL;
            var url = api + encodeURIComponent(query_text) + "?limit=" + limit;
            console.log(decodeURIComponent(url));

            var records = [];
            var count = 0;
            json.fetch(url, (data) => {
//        console.log("Total records: " + data.length);
                if (data.length === 0)
                    next(0);
                data.forEach((rec) => {
                    var record = new json.Record(rec.id, rec.content,
                            rec.img_link, JSON.parse(rec.detail_infos));
                    records.push(record);
                    IsValidImageUrl(rec.img_link, (isValid) => {
                        record.img_link_valid = isValid;
                        next(1);
                    });
                });
                function next(n) {
                    count += n;
                    if (count === data.length) {
                        result = [];
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

        IsValidImageUrl = function (url, callback) {
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

