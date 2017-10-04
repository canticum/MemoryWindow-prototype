(function () {
    'use strict';
    var http = require('http');
    var fs = require("fs");

    module.exports = function () {
        var methods = {};

        methods.fetch = function (url, callback) {
            http.get(url, (res) => {
                var body = '';
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    try {
                        callback(JSON.parse(body));
                    } catch (err) {
                        callback(JSON.parse('[]'));
                    }
                });
            }).on('error', (e) => {
                console.log("Got an error: ", e);
            });
        };

        methods.write = function (path, content) {
            var str = JSON.stringify(content, null, 4);
            fs.writeFile(path, str, (err) => {
                if (err)
                    console.log(err);
                else
                    console.log(path + " saved.");
            });
        };
        methods.Record = function (id, content, img_link, detail_infos) {
            this.id = id;
            this.content = content.replace(/\n/g, " ");
            this.img_link = img_link;
            this.detail_infos = detail_infos;
            this.title = detail_infos.title.replace(/\n/g, " ");
            this.img_link_valid = false;
        };


        return methods;
    };
}());