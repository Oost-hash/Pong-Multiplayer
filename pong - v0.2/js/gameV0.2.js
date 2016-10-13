/**************************************************
 ** Default values: Canvas, ctx, x and y position, players
 **************************************************/
var canvas = document.getElementById('pongCanvas');
var ctx = canvas.getContext('2d');

//size of the ball
var ballSize = 2;

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

//Start position ball
var xPos = canvas.width/2;
var yPos = canvas.height-30;

if(players.player1.left){
    var dx = rand(1, 3);
    var dy = 2;
}


//Random start left or right
function rand(min, max) {
    var offset = min;
    var range = (max - min);

    var side = Math.floor(Math.random() * range) + offset;
    if(side == 2){
        var returnVal =  '-' + 2;
        return parseInt(returnVal);
    }
    return 2;
}

/**************************************************
 ** Game initialize
 **************************************************/

//Draw ball function
function drawBall() {
    ctx.beginPath();
    ctx.rect(xPos, yPos, 5, 5);
    ctx.fillStyle = "#FFF";
    ctx.fill();
    ctx.closePath();
}

function collision(){
    //Collision Left and right
    if(xPos + dx < ballSize) {
        if(yPos < paddle.yP1 + paddle.height && yPos > paddle.yP1 ) {
            dx = -dx + 0.25;
        }else{
            players.player1.score++;
            xPos = canvas.width/2;
            yPos = canvas.height-30;
            dx = -2;
        }
    } else if(xPos  + dx > canvas.width - paddle.width ) {
        if(yPos < paddle.yP2  + paddle.height && yPos > paddle.yP2 ) {
            dx = -dx - 0.25;
        }else{
            players.player2.score++;
            xPos = canvas.width/2;
            yPos = canvas.height-30;
            dx = 2;
        }
    }

    //Collision top and down;
    if(yPos + dy > canvas.height-ballSize  || yPos + dy < ballSize) {
        dy =- dy;
    }

    //Paddle collision and up/down movement;
    if(paddle.upP1 && paddle.yP1 < canvas.height-paddle.height) {
        if(players.player1.left) {
            paddle.yP1 += paddle.speed;
            socket.emit('yCord', paddle.yP1);
        }
    }
    else if(paddle.downP1 && paddle.yP1 > 0) {
        if(players.player1.left) {
            paddle.yP1 -= paddle.speed;
            socket.emit('yCord', paddle.yP1);
        }
    }

    if(paddle.upP2 && paddle.yP2 < canvas.height-paddle.height) {
        if(players.player1.left == false) {
            paddle.yP2 += paddle.speed;
            socket.emit('yCord2', paddle.yP2);
        }
    }
    else if(paddle.downP2 && paddle.yP2 > 0) {
        if(players.player1.left == false) {
            paddle.yP2 -= paddle.speed;
            socket.emit('yCord2', paddle.yP2);
        }
    }

    if(players.player1.score == scoreLimit)
    {
        // alert('Player 1 won');
        // document.location.reload();
    } else if ( players.player2.score == scoreLimit)
    {
        // alert('Player 2 won');
        // document.location.reload();
    }
}


function drawScore() {
    ctx.font = "20pt Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText(players.player1.score.toString(), canvas.width /2 - 50, 25);
    ctx.fillText(players.player2.score.toString(), canvas.width /2 + 25, 25);
}

function drawLine()
{
    ctx.beginPath();
    ctx.strokeStyle = '#FFf';
    //noinspection JSUnresolvedFunction
    ctx.setLineDash([10]);
    ctx.moveTo(canvas.width/2,0);
    ctx.lineTo(canvas.height, canvas.height);
    ctx.stroke();
    ctx.closePath();
}

//Draw function, draw the ctx on the canvas
function init() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawLine();
    drawBall();
    drawPaddlePlayer1();
    drawPaddlePlayer2();
    collision();

    //moves the ball
    if(players.player1.left){
        xPos += dx;
        yPos += dy;
        socket.emit('ball', {xPos: xPos, yPos: yPos});
    }
}

setInterval(init, 30);