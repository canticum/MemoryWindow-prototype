const twdc = require('./twdc.js');
const {Result} = require('./data.js');
const {Record_Query} = require('./data.js');
const ideasql = require('./ideasql.js');

module.exports = {
    getResult
};

var limit = 20;
//twdc.refresh();

function getResult(data, callback) {
    var result = new Result(data.client, data.text);

    twdc.query(result.query_str, limit, (twdc_result) => {
        twdc_result.forEach(function (r) {
            result.record_set.push(r);
        });

        var quota = limit - result.record_set.length;
        if (quota > 0) {
            ideasql.query(result.query_str, quota, (ideasql_result) => {
//        console.log(ideasql_result);
//        result.record_set.push(ideasql_result);
                ideasql_result.forEach(function (r) {
                    result.record_set.push(r);
                });
                callback(result);
            });
        }
        callback(result);
    });
}
// var IMG_POOL = require("./test_data/data.js").IMG_POOL;
//var TXT_POOL = require("./test_data/data.js").TXT_POOL;
// temperary codes --
//var number = parseInt(Math.random() * 10) + 1;
//for (i = 0; i < number; i++) {
//    var img_index = parseInt(Math.random() * IMG_POOL.length);
//    var txt_index = parseInt(Math.random() * TXT_POOL.length);
//    var record = new Record_Query(
//            IMG_POOL[img_index],
//            TXT_POOL[txt_index]);
//    result.record_set.push(record);
//}
// temperary codes ^^