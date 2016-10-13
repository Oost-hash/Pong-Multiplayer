/**************************************************
 * SERVER FILE
 *
 * Uses Socket.io with Express
 *
 **************************************************
 * REQUIREMENTS
 **************************************************/

var util = require("util"),                 // Module for logging
    express = require('express'),           // Module for express framework
    http = require('http'),                 // using http
    socketio = require('socket.io');        // loads up socket.io

var port = 3000;                            // port
var players = [];                           // array for players
var waitingLine = [];                       // array for waiting players

/**************************************************
 ** SERVER SERTUP
 **************************************************/
var app = express(),                            // create express instance
    server = http.createServer(app),            // create the http server from express
    io = socketio(server);                      // setup socket io to listen to the server

var nspClient = io.of('/client');               //Name space for connecting clients
app.use('/public', express.static(__dirname  + '/public'));   //Css an js access for node

//Redirects to pong !!need to change it to start
app.get('/', function(request, response){
    response.sendFile(__dirname + '/pong.html');
});

//test shit for players

var player1 = {
    name: 'rob',
    left: true
};

var player2 = {
    name: 'niels',
    left: false
};

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

function clientDisconnect(client){
    client.leave('room1');
    util.log('Client disconnected: ' + client.id)
}

function clientConnected(client){
    util.log('Client joined ' + client.id);
    enterRoom(client);

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
};


init();

//idee om posities door te geven:
// util.log('client id: '  +client.id + ' PosY: ' + paddleY.pos);
// if(client.id != players[0]){
//     players[0].emit('movePlayer', {pos: paddleY.pos, id: client.id});
// } else{
//     players[1].emit('movePlayer', {pos: paddleY.pos, id: client.id});
// }