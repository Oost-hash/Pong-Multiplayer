/**************************************************
 ** Paddle
 **************************************************/
var canvas = document.getElementById('pongCanvas');

var paddle = {
    height: 30,
    width: 5,
    speed: 2,
    color: '#FFF',

    //Movement controllers
    upP1: false,
    upP2: false,
    downP1: false,
    downP2: false,

    //Start paddle middle of canvas
    yP1: (canvas.height - 30) / 2,
    yP2: (canvas.height - 30) / 2
};

//Event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//Key down handler
function keyDownHandler(e) {
    if (e.keyCode == 83) {
        if (players.host == true) {
            paddle.upP1 = true;
        } else {
            paddle.upP2 = true;
        }
    }
    else if (e.keyCode == 87) {

        if (players.host == true) {
            paddle.downP1 = true;
        } else {
            paddle.downP2 = true;
        }
    }
}

//Key up handler
function keyUpHandler(e) {
    if (e.keyCode == 83) {
        if (players.host == true) {
            paddle.upP1 = false;
        } else {
            paddle.upP2 = false;
        }
    }
    else if (e.keyCode == 87) {
        if (players.host == true) {
            paddle.downP1 = false;
        } else {
            paddle.downP2 = false;
        }
    }
}

//Draw paddle´s
function drawPaddlePlayer1() {
    ctx.beginPath();
    ctx.rect((canvas.width - canvas.width), paddle.yP1, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddlePlayer2() {
    ctx.beginPath();
    ctx.rect(canvas.width - paddle.width, paddle.yP2, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();
}
//Paddle collision and up/down movement;
function paddleCollision() {
    if (paddle.upP1 && paddle.yP1 < canvas.height - paddle.height) {
        if (players.host) {
            paddle.yP1 += paddle.speed;
            socket.emit('sendP1Y', {room: players.room, yCord: paddle.yP1});
        }
    }
    else if (paddle.downP1 && paddle.yP1 > 0) {
        if (players.host) {
            paddle.yP1 -= paddle.speed;
            socket.emit('sendP1Y', {room: players.room, yCord: paddle.yP1});
        }
    }
    if (paddle.upP2 && paddle.yP2 < canvas.height - paddle.height) {
        if (players.host == false) {
            paddle.yP2 += paddle.speed;
            socket.emit('sendP2Y', {room: players.room, yCord: paddle.yP2});
        }
    }
    else if (paddle.downP2 && paddle.yP2 > 0) {
        if (players.host == false) {
            paddle.yP2 -= paddle.speed;
            socket.emit('sendP2Y', {room: players.room, yCord: paddle.yP2});
        }
    }
}