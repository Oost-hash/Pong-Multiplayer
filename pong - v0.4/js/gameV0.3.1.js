/**************************************************
 ** Default values: Canvas, ctx, players
 **************************************************/
var canvas = document.getElementById('pongCanvas');
var ctx = canvas.getContext('2d');

var players = {
    room: 'game',
    start: false,
    host: true,
    nickName: '',
    player1: {
        name: 'Player 1',
        id: 'noID',
        score: 0
    },
    player2: {
        name: 'Player 2',
        id: 'noID',
        score: 0
    }
}, scoreLimit = 5;

/**************************************************
 ** Game functions
 **************************************************/

function canvasCollision() {
    //Collision Left and right
    if (ball.xPos + ball.dx < ball.size) {
        if (ball.yPos < paddle.yP1 + paddle.height && ball.yPos > paddle.yP1) {
            ball.dx = -ball.dx + 0.25;
        } else {
            if(players.host){
                players.player1.score++;
                socket.emit('sendScore', { room: players.room, scoreP1: players.player1.score, scoreP2: players.player2.score});
                ball.xPos = canvas.width / 2;
                ball.yPos = canvas.height - 30;
                ball.dx = -2;
            }
        }
    } else if (ball.xPos + ball.dx > canvas.width - paddle.width) {
        if (ball.yPos < paddle.yP2 + paddle.height && ball.yPos > paddle.yP2) {
            ball.dx = -ball.dx - 0.25;
        } else {
            if(players.host){
                players.player2.score++;
                socket.emit('sendScore', { room: players.room, scoreP1: players.player1.score, scoreP2: players.player2.score});
                ball.xPos = canvas.width / 2;
                ball.yPos = canvas.height - 30;
                ball.dx = 2;
            }
        }
    }

    //Collision top and down;
    if (ball.yPos + ball.dy > canvas.height - ball.size || ball.yPos + ball.dy < ball.size) {
        ball.dy =- ball.dy;
    }
}

// Checks if there is a winner
function score() {

    if (players.player1.score == scoreLimit) {
        socket.emit('matchDone', {room: players.room, name: players.player1.name});
        players.start = false;
    } else if (players.player2.score == scoreLimit) {
        socket.emit('matchDone', {room: players.room, name: players.player2.name});
        players.start = false;
    }
}

//draws score on canvas
function drawScore() {
    ctx.font = "20pt Orbitron";
    ctx.fillStyle = "#FFF";
    ctx.fillText(players.player1.score.toString(), canvas.width / 2 - 50, 25);
    ctx.fillText(players.player2.score.toString(), canvas.width / 2 + 25, 25);
}

//Draws the mid line
function drawLine() {
    ctx.beginPath();
    ctx.strokeStyle = '#FFF';
    ctx.setLineDash([10]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.height, canvas.height);
    ctx.stroke();
    ctx.closePath();
}

/**************************************************
 ** Game initialize
 **************************************************/
function init() {
    //Clears ball for new position
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawLine();
    if (players.start) {
        drawBall();
        drawPaddlePlayer1();
        drawPaddlePlayer2();
        canvasCollision();
        paddleCollision();
        score();
        //moves the ball
        if (players.host) {
            ball.xPos += ball.dx;
            ball.yPos += ball.dy;
            socket.emit('sendBall', {room: players.room, xPos: ball.xPos, yPos: ball.yPos});
        }
    }
}


setInterval(init, 30);

