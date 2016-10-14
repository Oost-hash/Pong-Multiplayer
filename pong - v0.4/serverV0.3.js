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
app.use('/public', express.static(__dirname + '/public'));      // Public folders

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/pong.html');                // Game file (pong) on connect
});

/**************************************************
 ** Event Handlers
 **************************************************/

function clientConnected(client) {
    util.log('Client joined ' + client.id);

    client.on('play', function () {
        enterRoom(client)
    });

    //Event handlers for paddle and ball, updates the cords
    client.on('sendP1Y', function (data) {
        client.broadcast.to(data.room).emit('updateP1Y', data.yCord);
    });

    client.on('sendP2Y', function (data) {
        client.broadcast.to(data.room).emit('updateP2Y', data.yCord);
    });

    client.on('sendBall', function (data) {
        client.broadcast.to(data.room).emit('updateBall', data);
    });

    client.on('sendScore', function (data) {
        client.broadcast.to(data.room).emit('updateScore', data);
    });

    client.on('matchDone', function (data) {
        client.to(data.room).emit('winner', data.name);
    });

    client.on('sendName', function (data) {
        console.log('nickName received: ' + data.name);
        client.to(data.room).emit('updatePlayers', {name: data.name, id: client.id});
    });
}

// Function to create a game rooms, if a game is not available
function enterRoom(client) {
    if (checkRooms(client) == false) {
        client.join('game' + gameCount);
        gameCount++;
    } else {
        var game = gameCount - 1;
        nspClient.in('game' + game).emit('start', 'game' + game);
        nspClient.to(client.id).emit('hostFalse');
    }
}

// Function to checks if a game room is available
function checkRooms(client) {
    for (var i = 0; i < gameCount; i++) {
        var rooms = nspClient.adapter.rooms['game' + i];
        if (rooms != null && rooms.length < 2) {
            client.join('game' + i);
            return true;
        }
    }
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
    nspClient.on('disconnect', function () {
        console.log('does this even work?');
    });
}

init();