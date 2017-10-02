const http = require('http');
const fs = require("fs");

module.exports = {
    fetch, write, Record
};

function fetch(url, callback) {
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
}

function   write(path, content) {
    var str = JSON.stringify(content, null, 4);
    fs.writeFile(path, str, (err) => {
        if (err)
            console.log(err);
        else
            console.log(path + " saved.");
    });
}

function  Record(id, content, img_link, detail_infos) {
    this.id = id;
    this.content = content;
    this.img_link = img_link;
    this.detail_infos = detail_infos;
    this.title = detail_infos.title;
    this.img_link_valid = false;
}