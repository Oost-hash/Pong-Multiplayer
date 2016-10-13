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
var gameCount = 0;                                              // Games played and for creation of rooms

/**************************************************
 ** SERVER SERTUP
 **************************************************/
var app = express(),                                            // Create express instance
    server = http.createServer(app),                            // Create the http server from express
    io = socketio(server);                                      // Setup socket io to listen to the server

var nspClient = io.of('/client');                               // Name space for connecting clients
app.use('/public', express.static(__dirname + '/public'));     // Public folders

//Redirects to pong !!need to change it to start
app.get('/', function (request, response) {
    //noinspection JSUnresolvedFunction
    response.sendFile(__dirname + '/pong.html');                // Index file on connect
});

/**************************************************
 ** Event Handlers
 **************************************************/

function clientDisconnect(client) {
    client.leave('room1');
    util.log('Client disconnected: ' + client.id);
}

//test function
function clientConnected(client) {
    util.log('Client joined ' + client.id);

    client.on('play', function () {
        enterRoom(client)
    });

    //need to refractor and improve !!better names?
    client.on('player1cord', function (data) {
        client.broadcast.to(data.room).emit('p1y', data.yCord);
    });

    client.on('yCord2', function (data) {
        client.broadcast.to(data.room).emit('test2', data.yCord);
    });

    client.on('ball', function (data) {
        client.broadcast.to(data.room).emit('test3', data);
    });

    client.on('score', function (data) {
        client.broadcast.to(data.room).emit('updateScore', data);
    });
}

function enterRoom(client) {
    if (checkRooms(client) == false) {
        client.join('game' + gameCount);
        console.log('Room is false');
        var rooms = nspClient.adapter.rooms;
        console.log(rooms);
        gameCount++;
    } else {
        var game = gameCount -1;
        nspClient.in('game' + game).emit('start', 'game' + game);
        nspClient.to(client.id).emit('player1');
    }
}

function checkRooms(client) {
    for (var i = 0; i < gameCount; i++) {
        var rooms = nspClient.adapter.rooms['game' + i];
        if (rooms != null && rooms.length < 2) {
            client.join('game' + i);
            console.log('Room is true');
            var room = nspClient.adapter.rooms;
            console.log(room);
            return true;
        }
    }

    var room = nspClient.adapter.rooms;
    console.log(room);
    return false;
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