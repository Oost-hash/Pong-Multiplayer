/**************************************************
 ** Ball
 **************************************************/

var ball = {
    //Start position ball
    xPos: canvas.width / 2,
    yPos: canvas.height - 30,

    //Ball movement speed and random start.
    dx: rand(1, 3),
    dy: 2,

    //Ball size
    width: 5,
    height: 5,
    size: 2,
    color: '#FFF'
};

//Random start host or right
function rand(min, max) {
    var offset = min;
    var range = (max - min);

    var side = Math.floor(Math.random() * range) + offset;
    if (side == 2) {
        var returnVal = '-' + 2;
        return parseInt(returnVal);
    }
    return 2;
}

//Draw ball function
function drawBall() {
    ctx.beginPath();
    ctx.rect(ball.xPos, ball.yPos, ball.width, ball.height);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}