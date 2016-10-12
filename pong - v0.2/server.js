/**************************************************
 ** SERVER FILE
 *
 * Uses Socket.io with Express
 *
 * Requirements
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
}


function clientConnected(client){
    util.log('Client joined ' + client.id);
    enterRoom(client);
}

function enterRoom(client){
    client.join('room1');
    var room = 'room1';
    var clients = nspClient.adapter.rooms['room1'].sockets;
    util.log('Clients: ');
    console.log(clients);

    play(room);
}

function play(room) {
    nspClient.in(room).emit('test', 'msg');
}

 nspClient.on('yCord', function (cord) {
     console.log(cord);
 });

init();

//idee om posities door te geven:
// util.log('client id: '  +client.id + ' PosY: ' + paddleY.pos);
// if(client.id != players[0]){
//     players[0].emit('movePlayer', {pos: paddleY.pos, id: client.id});
// } else{
//     players[1].emit('movePlayer', {pos: paddleY.pos, id: client.id});
// }