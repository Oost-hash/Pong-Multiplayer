/**************************************************
 ** Default values: Canvas, ctx, ball x and y position, players
 **************************************************/
var canvas = document.getElementById('pongCanvas');
var ctx = canvas.getContext('2d');

var players = {
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
 ** Game initialize
 **************************************************/

function collision() {
    //Collision Left and right
    if (ball.xPos + ball.dx < ball.size) {
        if (ball.yPos < paddle.yP1 + paddle.height && ball.yPos > paddle.yP1) {
            ball.dx = -ball.dx + 0.25;
        } else {
            players.player1.score++;
            ball.xPos = canvas.width / 2;
            ball.yPos = canvas.height - 30;
            ball.dx = -2;
        }
    } else if (xPos + ball.dx > canvas.width - paddle.width) {
        if (yPos < paddle.yP2 + paddle.height && yPos > paddle.yP2) {
            ball.dx =- ball.dx - 0.25;
        } else {
            players.player2.score++;
            ball.xPos = canvas.width / 2;
            ball.yPos = canvas.height - 30;
            ball.dx = 2;
        }
    }

    //Collision top and down;
    if (ball.yPos + ball.dy > canvas.height - ball.size || ball.yPos + ball.dy < ball.size) {
        ball.dy = -ball.dy;
    }

    //Paddle collision and up/down movement;
    if (paddle.upP1 && paddle.yP1 < canvas.height - paddle.height) {
        if (players.player1.left) {
            paddle.yP1 += paddle.speed;
            socket.emit('yCord', paddle.yP1);
        }
    }
    else if (paddle.downP1 && paddle.yP1 > 0) {
        if (players.player1.left) {
            paddle.yP1 -= paddle.speed;
            socket.emit('yCord', paddle.yP1);
        }
    }

    if (paddle.upP2 && paddle.yP2 < canvas.height - paddle.height) {
        if (players.player1.left == false) {
            paddle.yP2 += paddle.speed;
            socket.emit('yCord2', paddle.yP2);
        }
    }
    else if (paddle.downP2 && paddle.yP2 > 0) {
        if (players.player1.left == false) {
            paddle.yP2 -= paddle.speed;
            socket.emit('yCord2', paddle.yP2);
        }
    }

    if (players.player1.score == scoreLimit) {
        // alert('Player 1 won');
        // document.location.reload();
    } else if (players.player2.score == scoreLimit) {
        // alert('Player 2 won');
        // document.location.reload();
    }
}

function drawScore() {
    ctx.font = "20pt Arial";
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

//Draw function, draw the ctx on the canvas
function init() {
    //Clears ball for new position
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawLine();
    drawBall();
    drawPaddlePlayer1();
    drawPaddlePlayer2();
    collision();

    //moves the ball
    if (players.player1.left) {
        ball.xPos += ball.dx;
        ball.yPos += ball.dy;
        socket.emit('ball', {xPos: ball.xPos, yPos: ball.yPos});
    }
}

setInterval(init, 30);