(function () {
    'use strict';
    const ideasql = require('./ideasql')();
    const TWDC = require('./twdc');
    const {Result} = require('./data.js');

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

                var quota = limit - result.record_set.length;
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

