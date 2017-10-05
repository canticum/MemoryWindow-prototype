var ideasql = require("../ideasql.js")();
var json = require("../json.js")();
var fs = require('fs');
var util = require('util');

function test1(text) {
    ideasql.query(text, 20, (data) => {
        console.log(data);
    });
}

function test2(text) {
    var path = "./libs/test_data/" + text + ".json";
    ideasql.query(text, 0, (data) => {
        json.write(path, data);
    });
}

function test3(text, limit) {

    var url = ideasql.get_url(text, limit);
    json.fetch(url, (data) => {
        var count = 0, url_good = 0;
        var bad_url = [];
        data.forEach((rec) => {
            ideasql.IsValidImageUrl(rec.img_link, (isValid) => {
                if (isValid)
                    url_good++;
                else
                    bad_url.push(rec.img_link);
                next(1);
            });
        });
        function next() {
            count++;
            if (count === data.length) {
                var result = 'query text = ' + text + '(' + limit + ')\r\n';
                result += 'total data = ' + data.length + '\r\n';
                result += 'good url = ' + url_good + '\r\n';
                result += 'good % = ' + (url_good / data.length * 100).toFixed(2) + '%\r\n\r\n';
                result += 'bad links:\r\n';
                bad_url.forEach((u) => {
                    result += u + '\r\n';
                });

                var path = "./libs/test_data/" + text + ".txt";
                var log_file = fs.createWriteStream(path, {flags: 'w'});
                var log_stdout = process.stdout;

                log_file.write(util.format(result) + '\n');
                log_stdout.write(util.format(result) + '\n');
            }
        }
    });
}

var n = 100;
//test3("台中", n);
//test3("后里", n);
//test3("豐原", n);
//test3("綠川", n);
//test3("大甲", n);
//test3("東勢", n);
//test3("太陽餅", n);
//test3("柳川", n);
//test3("大肚山", n);
//test3("大雅", n);
//test3("湖心亭", n);
//test3("港區", n);
//test3("媽祖", n);
//test3("潭子", n);