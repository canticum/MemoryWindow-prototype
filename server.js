/* global __dirname */
var express = require('express');
var app = express();
var path = require("path");
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function (client) {
    console.log(client.id + "_" + client.handshake.query.role + "_connection");
    client.on('search', function (data) {
        console.log(data);
        io.emit('result', data);
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
            res.sendFile(path.join(__dirname + '/lunaroot/luna.html'));
            break;
        case undefined:
            res.sendFile(path.join(__dirname + '/umbraroot/search.html'));
            break;
        default:
            res.sendFile(path.join(__dirname + '/' + req.params.page));
    }
});
server.listen(80);
