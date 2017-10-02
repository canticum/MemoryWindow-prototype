/* global __dirname */
var {getResult} = require('./libs/getResult.js');
var express = require('express');
var app = express();
var path = require("path");
var server = require('http').createServer(app);
//var port = process.env.port || process.env.npm_package_config_LOCAL_PORT;
var port = process.env.port || process.env.PORT || 1337;

var io = require('socket.io')(server);
const {SYSTEM_LOGO_TIME_OUT} = require('./global.js');
const {SEARCH_DELAY} = require('./global.js');

io.on('connection', function (client) {
    console.log(client.id + "_" + client.handshake.query.role + "_connection");
    client.on('query', function (data) {
        getResult(data, (result) => {
            var data_package = result;
            console.log('找到' + data_package.record_set.length + '筆內容。');
            io.emit('message', {
                user: data.client,
                message: '找到' + data_package.record_set.length + '筆內容。'
            });
            setTimeout(function () {
                io.emit('result', data_package);
            }, SEARCH_DELAY);
        });
    });
    client.on('disconnect', function () {
        console.log("disconnect");
    });
});
var fire_id = setInterval(function () {
    io.emit('fire', {user: "Server"});
}, SYSTEM_LOGO_TIME_OUT);

app.use(express.static('lunaroot'));
app.use(express.static('umbraroot'));
app.use(express.static('node_modules'));
app.get('/:page?', function (req, res) {
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
console.log("Server listening to port: " + port);
server.listen(port);
