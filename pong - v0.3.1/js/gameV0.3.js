/**************************************************
 ** Default values: Canvas, ctx, players
 **************************************************/
var canvas = document.getElementById('pongCanvas');
var ctx = canvas.getContext('2d');

var players = {
    room: '',
    start: false,
    player1: {
        name: 'Player 1',
        id: 'noID',
        score: 0,
        left: true
    },
    player2: {
        name: 'player 2',
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
            players.player1.score++;
            if(players.player1.left){
                socket.emit('score', { room: players.room, scoreP1: players.player1.score, scoreP2: players.player2.score});
            }
            ball.xPos = canvas.width / 2;
            ball.yPos = canvas.height - 30;
            ball.dx = -2;
        }
    } else if (ball.xPos + ball.dx > canvas.width - paddle.width) {
        if (ball.yPos < paddle.yP2 + paddle.height && ball.yPos > paddle.yP2) {
            ball.dx = -ball.dx - 0.25;
        } else {
            players.player2.score++;
            if(players.player1.left){
                socket.emit('score', { room: players.room, scoreP1: players.player1.score, scoreP2: players.player2.score});
            }
            ball.xPos = canvas.width / 2;
            ball.yPos = canvas.height - 30;
            ball.dx = 2;
        }
    }

    //Collision top and down;
    if (ball.yPos + ball.dy > canvas.height - ball.size || ball.yPos + ball.dy < ball.size) {
        ball.dy =- ball.dy;
    }
}

function score() {
    if (players.player1.score == scoreLimit) {
        // alert('Player 1 won');
        // document.location.reload();
    } else if (players.player2.score == scoreLimit) {
        // alert('Player 2 won');
        // document.location.reload();
    }
}

function drawScore() {
    ctx.font = "20pt Orbitron";
    ctx.fillStyle = "#FFF";
    ctx.fillText(players.player1.score.toString(), canvas.width / 2 - 50, 25);
    ctx.fillText(players.player2.score.toString(), canvas.width / 2 + 25, 25);
}

function drawLine() {
    ctx.beginPath();
    ctx.strokeStyle = '#FFF';
    //noinspection JSUnresolvedFunction
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
        if (players.player1.left) {
            ball.xPos += ball.dx;
            ball.yPos += ball.dy;
            socket.emit('ball', {room: players.room, xPos: ball.xPos, yPos: ball.yPos});
        }
    }
}

setInterval(init, 30);