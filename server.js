/* global __dirname */
var express = require('express');
var app = express();
app.use(express.static('lunaroot'));
app.use(express.static('umbraroot'));
app.use(express.static('node_modules'));
app.get('/:page?', function (req, res) {
    var path = require("path");
    switch (req.params.page) {
        case 'luna':
            res.sendFile(path.join(__dirname + '/lunaroot/luna.html'));
            break;
        case undefined:
            res.sendFile(path.join(__dirname + '/umbraroot/umbra.html'));
            break;
        default:
            res.sendFile(path.join(__dirname + '/' + req.params.page));
    }
});
var server = require('http').createServer(app);
var port = process.env.port || process.env.PORT || 1337;
//var port = process.env.port || process.env.npm_package_config_LOCAL_PORT;
var io = require('socket.io')(server);
const cf = require('./config.js');
var dc = require('./libs/DataCenter')(20, () => {
    io.on('connection', function (client) {
        console.log(client.id + "_" + client.handshake.query.role + "_connection");
        client.on('query', function (data) {
            dc.getResult(data, (result) => {
                var data_package = result;
                var result_str = (data_package.record_set.length === 0) ?
                        '抱歉，' + data.text + ' 沒有搜尋到任何內容。'
                        : data.text + ' 找到' + data_package.record_set.length + '筆內容。';
                console.log(result_str);
                io.emit('message', {
                    user: data.client,
                    message: result_str
                });
                if (data_package.record_set.length > 0)
                    io.emit('result', data_package);
            });
        });
        client.on('disconnect', function () {
            console.log("disconnect");
        });
    });

    setInterval(function () {
        io.emit('fire', {user: "Server"});
    }, cf.luna.SYSTEM_LOGO_TIME_OUT);

    console.log("Server listening to port: " + port);
    server.listen(port);
});



