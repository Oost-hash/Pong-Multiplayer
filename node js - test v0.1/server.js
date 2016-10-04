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

var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, function () {
    console.log('Listening on 3000')
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});


