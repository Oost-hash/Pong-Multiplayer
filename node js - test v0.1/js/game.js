//==================================================
//Default values: Canvas, ctx, x and y position
//==================================================
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var xPos = canvas.width/2;
var yPos = canvas.height-30;

//Makes the ball move
var dx = rand(1, 3);
var dy = 2;
console.log(dx);

//size of the ball
var ballSize = 2;

//Score
var scorePlayer1 = 0;
var scorePlayer2 = 0;
var scoreLimit = 5;

//Speed paddle
var paddleSpeed = 2;

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


//==================================================
//Paddle
//==================================================

var paddleHeight = 30;
var paddleWidth = 5;

//Paddle movement
var paddleYPlayer1 = (canvas.height-paddleHeight)/2;
var paddleYPlayer2 = (canvas.height-paddleHeight)/2;

var upPlayer1 = false;
var downPlayer1 = false;

var upPlayer2 = false;
var downPlayer2 = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 40) {
        upPlayer2 = true;
    }
    else if(e.keyCode == 38) {
        downPlayer2 = true;
    }
    else if(e.keyCode == 83) {
        upPlayer1 = true;
    }
    else if(e.keyCode == 87) {
        downPlayer1 = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 40) {
        upPlayer2 = false;
    }
    else if(e.keyCode == 38) {
        downPlayer2 = false;
    }
    else if(e.keyCode == 83) {
        upPlayer1 = false;
    }
    else if(e.keyCode == 87) {
        downPlayer1 = false;
    }
}

//Draw paddle
function drawPaddlePlayer1() {
    ctx.beginPath();
    ctx.rect((canvas.width - canvas.width), paddleYPlayer1, paddleWidth, paddleHeight);
    ctx.fillStyle = "#FFF";
    ctx.fill();
    ctx.closePath();
}

function drawPaddlePlayer2() {
    ctx.beginPath();
    ctx.rect(canvas.width - paddleWidth  , paddleYPlayer2, paddleWidth, paddleHeight);
    ctx.fillStyle = "#FFF";
    ctx.fill();
    ctx.closePath();
}


//==================================================
//Game
//==================================================

//Draw ball function
function drawBall() {
    ctx.beginPath();
    ctx.rect(xPos, yPos, 5, 5);
    ctx.fillStyle = "#FFF";
    ctx.fill();
    ctx.closePath();
}

//Draw function, draw the ctx on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawLine();
    // drawBall();
    drawPaddlePlayer1();
    drawPaddlePlayer2();

    //Collision Left and right
    if(xPos + dx < ballSize) {
        if(yPos < paddleYPlayer1 + paddleHeight && yPos > paddleYPlayer1 ) {
            dx = -dx + 0.25;
        }else{
            // scorePlayer2++;
            xPos = canvas.width/2;
            yPos = canvas.height-30;
            dx = -2;
        }
    } else if(xPos  + dx > canvas.width - paddleWidth ) {
        if(yPos < paddleYPlayer2  + paddleHeight && yPos > paddleYPlayer2 ) {
            dx = -dx - 0.25;
        }else{
            // scorePlayer1++;
            xPos = canvas.width/2;
            yPos = canvas.height-30;
            dx = 2;
        }
    }

    //Collision top and down;
    if(yPos + dy > canvas.height-ballSize  || yPos + dy < ballSize) {
        dy = -dy;
    }

    //Paddle collision and up/down speed;
    if(upPlayer1 && paddleYPlayer1 < canvas.height-paddleHeight) {
        paddleYPlayer1 += paddleSpeed;
    }
    else if(downPlayer1 && paddleYPlayer1 > 0) {
        paddleYPlayer1 -= paddleSpeed;
    }

    if(upPlayer2 && paddleYPlayer2 < canvas.height-paddleHeight) {
        paddleYPlayer2 = paddleSpeed;
    }
    else if(downPlayer2 && paddleYPlayer2 > 0) {
        paddleYPlayer2 -= paddleSpeed;
    }

    // if(upPlayer2 && paddleYPlayer2 < canvas.height-paddleHeight) {
    //     paddleYPlayer2 = paddleSpeed;
    // }
    // else if(downPlayer2 && paddleYPlayer2 > 0) {
    //     paddleYPlayer2 -= paddleSpeed;
    // }

    if(scorePlayer1 == scoreLimit)
    {
        alert('Player 1 won');
        document.location.reload();
    } else if ( scorePlayer2 == scoreLimit)
    {
        alert('Player 2 won');
        document.location.reload();
    }

    xPos += dx;
    yPos += dy;
}

function drawScore() {
    ctx.font = "20pt Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText(scorePlayer1.toString(), canvas.width /2 - 50, 25);
    ctx.fillText(scorePlayer2.toString(), canvas.width /2 + 25, 25);
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

setInterval(draw, 30);