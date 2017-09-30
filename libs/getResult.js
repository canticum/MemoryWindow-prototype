var IMG_POOL = require("./test_data/data.js").IMG_POOL;
var TXT_POOL = require("./test_data/data.js").TXT_POOL;

module.exports = {
    getResult: function (data) {
        var result = new Result(data.text);

        // temperary codes --
        var number = parseInt(Math.random() * 10) + 1;
        for (i = 0; i < number; i++) {
            var img_index = parseInt(Math.random() * IMG_POOL.length);
            var txt_index = parseInt(Math.random() * TXT_POOL.length);
            var record = new Record_Query(
                    IMG_POOL[img_index],
                    TXT_POOL[txt_index]);
            result.record_set.push(record);
        }
        // temperary codes ^^
        return result;
    }
};

function Result(query_string) {
    this.query_str = query_string;
    this.record_set = [];
}

function Record_Query(url, text) {
    this.img_url = url;
    this.content = text;
}