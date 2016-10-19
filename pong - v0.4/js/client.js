/**************************************************
 ** Functions Client
 **************************************************/

//Hides the correct divs
$('#help').hide();
$('#pongCanvas').hide();
$('#loading').hide();
$('#winner').hide();
$('#scoreboard').hide();

// When play button is pressed on start screen, send nickName to server and start searching for other player.
function play() {
    if ($('#nickName').val().length > 0) {
        players.nickName = $('#nickName').val();
        players.paddleColor = $('[name="colorPicker"]').val();
        console.log('player nickName is: ' + players.nickName);
        socket.emit('play');
        $('#start').hide();
        $('#loading').show();
    } else {
        $("#nickName").css({'border-color': "red"});
    }
}

// start a new game
function playAgain() {
    $('#winner').hide();
    $('#scoreboard').hide();
    $('#start').show();
    players.start = false;
    resetValues();
}

// Reset's all the values for new game.
function resetValues() {
    //players reset

    players.player1.name = 'Player 1';
    players.player2.name = 'Player 2';
    players.player1.id = 'noID';
    players.player2.id = 'noID';
    players.player1.score = 0;
    players.player2.score = 0;
    players.host = true;

    //Paddle reset

    //Movement controllers
    paddle.upP1 = false;
    paddle.upP2 = false;
    paddle.downP1 = false;
    paddle.downP2 = false;

    //Start paddle middle of canvas
    paddle.yP1 = (canvas.height - 30) / 2;
    paddle.yP2 = (canvas.height - 30) / 2;

    //Ball reset

    //Start position ball
    paddle.xPos = canvas.width / 2;
    paddle.yPos = canvas.height - 30;

    //Ball movement speed and random start.
    ball.dx = rand(1, 3);
    ball.dy = 2;
}

//show and hide help
function showHelp(){
    $('#start').hide();
    $('#help').show();
}

function hideHelp(){
    $('#start').show();
    $('#help').hide();
}

/**************************************************
 ** Event Handlers - Client
 **************************************************/

//starts the game
socket.on('start', function (data) {
    $('#loading').hide();
    $('#pongCanvas').show();
    $('#scoreboard').show();
    players.room = data;
    players.start = true;
    socket.emit('sendPlayerInfo', {room: players.room, name: players.nickName, paddleColor: players.paddleColor});
});

//updates players values
socket.on('updatePlayers', function (data) {
    if (players.host) {
        players.player1.name = players.nickName;
        players.player1.paddleColor = players.paddleColor;
        players.player2.name = data.name;
        players.player2.id = data.id;
        players.player2.paddleColor = data.paddleColor;
    } else {
        players.player2.name = players.nickName;
        players.player2.paddleColor = players.paddleColor;
        players.player1.id = data.id;
        players.player1.name = data.name;
        players.player1.paddleColor = data.paddleColor;
    }
    $('#player1').text(players.player1.name);
    $('#player2').text(players.player2.name);
});

//sets host value to false, if not a host
socket.on('hostFalse', function () {
    players.host = false;
});

//sets paddle coordinates for player 1, if not the host
socket.on('updateP1Y', function (data) {
    if (players.host == false) {
        paddle.yP1 = data;
    }
});

//sets paddle coordinates for player 2, if the host
socket.on('updateP2Y', function (data) {
    if (players.host == true) {
        paddle.yP2 = data;
    }
});

//sets ball coordinates for player 2
socket.on('updateBall', function (data) {
    if (players.host == false) {
        ball.xPos = data.xPos;
        ball.yPos = data.yPos;
    }
});

//sets score for player 2
socket.on('updateScore', function (data) {
    if (players.host == false) {
        players.player1.score = data.scoreP1;
        players.player2.score = data.scoreP2;
    }
});

//show the winner
socket.on('winner', function (data) {
    if (data == players.nickName) {
        $('#name').text(data);
        $('#reason').text('You won with ' + players.player1.score + ' : ' + players.player2.score);
    } else {
        $('#name').text(data);
        $('#reason').text('Has won with ' + players.player1.score + ' : ' + players.player2.score);
    }
    $('#winner').show();
    $('#pongCanvas').hide();
});

//give message when player disconnected
socket.on('disconnect', function () {
    if (players.host) {
        $('#name').text(players.player1.name);
        $('#reason').text('has disconnected you won!');
    } else {
        $('#name').text(players.player2.name);
        $('#reason').text('has disconnected you won!');
    }
    $('#winner').show();
    $('#pongCanvas').hide();
});