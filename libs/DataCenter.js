(function () {
    'use strict';
    var ideasql = require('./ideasql')();
    var TWDC = require('./twdc');
    var {Result} = require('../config.js').DATA;

    module.exports = function (limit, callback) {
        var methods = {};
        var twdc = new TWDC(limit, callback);

        methods.getResult = function (data, callback) {
            var result = new Result(data.client, data.text);

            twdc.query(result.query_str, (twdc_result) => {
                console.log("twdc_result = " + twdc_result.length);
                twdc_result.forEach(function (r) {
                    result.record_set.push(r);
                });

//                var quota = limit - result.record_set.length;
                var quota = limit;
                if (quota > 0) {
                    ideasql.query(result.query_str, quota, (ideasql_result) => {
                        console.log("ideasql_result = " + ideasql_result.length);
                        ideasql_result.forEach(function (r) {
                            result.record_set.push(r);
                        });
                        callback(result);
                    });
                } else
                    callback(result);
            });
        };

        return methods;
    };
}());

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