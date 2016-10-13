/**************************************************
 * SERVER FILE
 *
 * Uses Socket.io with Express
 *
 **************************************************
 * REQUIREMENTS
 **************************************************/
var util = require("util"),                                     // Module for logging
    express = require('express'),                               // Module for express framework
    http = require('http'),                                     // Module for http server
    socketio = require('socket.io');                            // Module for Socket.io

var port = 3000;                                                // Default Port
var players = [];                                               // Array for players
var waitingLine = [];                                           // Array for waiting players

/**************************************************
 ** SERVER SERTUP
 **************************************************/
var app = express(),                                            // Create express instance
    server = http.createServer(app),                            // Create the http server from express
    io = socketio(server);                                      // Setup socket io to listen to the server

var nspClient = io.of('/client');                               // Name space for connecting clients
app.use('/public', express.static(__dirname  + '/public'));     // Public folders

//Redirects to pong !!need to change it to start
app.get('/', function(request, response){
    //noinspection JSUnresolvedFunction
    response.sendFile(__dirname + '/pong.html');                // Index file on connect
});

/**************************************************
 ** Event Handlers
 **************************************************/

function clientDisconnect(client){
    client.leave('room1');
    util.log('Client disconnected: ' + client.id)
}

//test function
function clientConnected(client){
    util.log('Client joined ' + client.id);
    enterRoom(client);

    //need to refractor
    client.on('yCord', function (cord) {
        client.broadcast.to('room1').emit('test', cord);
        util.log(cord);
    });

    client.on('yCord2', function (cord) {
        client.broadcast.to('room1').emit('test2', cord);
        util.log(cord);
    });

    client.on('ball', function (data) {
        client.broadcast.to('room1').emit('test3', data);
    });
}

//test function
var count = 0;
function enterRoom(client){
    client.join('room1');
    var room = 'room1';
    var clients = nspClient.adapter.rooms['room1'].sockets;
    util.log('Clients in ' + room + ' : ');
    console.log(clients);
    if(count == 1) {
        console.log('hij gaat de count in');
        nspClient.to(client.id).emit('player1');
        count = 0;
    }
    count++;
    console.log('count is: ' + count);
    play(room);
}

function play(room) {
    // nspClient.in(room).emit('test', 'msg');
}

/**************************************************
 ** Initialize server
 **************************************************/

function init() {
    server.listen(port, function () {
        util.log('Server Started listing on port: 3000')
    });

    nspClient.on('connection', clientConnected);
    nspClient.on('disconnect', clientDisconnect)
}

init();