const http = require('http');
const fs = require("fs");

module.exports = {
    fetch: function (url, callback) {
        http.get(url, (res) => {
            var body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                callback(JSON.parse(body));
            });
        }).on('error', (e) => {
            console.log("Got an error: ", e);
        });
    },
    write: function (path, content) {
        var str = JSON.stringify(content);
        fs.writeFile(path, str, (err) => {
            if (err)
                console.log(err);
            else
                console.log(path + " saved.");
        });
    }
};