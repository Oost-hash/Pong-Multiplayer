//=========================================================
//
// SERVER File for Pong multiplayer
//
// Handles node.js, Socket.io and basic server config
//
//=========================================================

//=========================================================
// Requirements
//=========================================================

var util = require("util"),                 // Module for logging
    express = require('express'),           // Module for express framework
    http = require('http'),                 // using http
    socketio = require('socket.io');        // loads up socket.io


/**************************************************
 ** SERVER SERTUP
 **************************************************/
var app = express(),                    // create express instance
    server = http.createServer(app),    // create the http server from express
    io = socketio(server);              // setup socket io to listen to the server

var players = [];                       // array for players


var nspClient = io.of('/client');

// gives access to game and client files
app.use('/public', express.static('public'));

// request to the root of dir (homepage) send the request to client index
app.get('/', function(request, response){
    response.sendFile(__dirname + '/pong.html');
});

function init() {
    server.listen(3000, function () {
        util.log('Server Started listing on port: 3000')
    });

    nspClient.on('connection', clientConnected);
}




function clientConnected(client){
    util.log('Client joined ' + client.id);
    players.add(client.id);
    client.on('playerY', function(paddleY){
        util.log('client id: '  +client.id + ' PosY: ' + paddleY.pos);
        if(client.id != players[0]){
            players[0].emit('movePlayer', {pos: paddleY.pos, id: client.id});
        } else{
            players[1].emit('movePlayer', {pos: paddleY.pos, id: client.id});
        }
    });
}

init();