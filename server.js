/* global __dirname */
var getResult = require('./include.js').getResult;
var express = require('express');
var app = express();
var path = require("path");
var server = require('http').createServer(app);
//var port = process.env.port || process.env.npm_package_config_LOCAL_PORT;
var port = process.env.port || 1337;

var io = require('socket.io')(server);
io.on('connection', function (client) {
    console.log(client.id + "_" + client.handshake.query.role + "_connection");
    client.on('query', function (data) {
//        console.log(data);
        var data_package = getResult(data);
        io.emit('result', data_package);
    });
    client.on('fire', function (data) {
        io.emit('fire', data);
    });
    client.on('disconnect', function () {
        console.log("disconnect");
    });
});

app.use(express.static('lunaroot'));
app.use(express.static('umbraroot'));
app.use(express.static('node_modules'));
app.get('/:page?', function (req, res) {
    switch (req.params.page) {
        case 'luna':
            console.log('luna');
            console.log(__dirname);
            res.sendFile(path.join(__dirname + '/lunaroot/luna.html'));
            break;
        case undefined:
            res.sendFile(path.join(__dirname + '/umbraroot/umbra.html'));
            break;
        default:
            res.sendFile(path.join(__dirname + '/' + req.params.page));
    }
});
server.listen(port);
