import "./phaser.js";

var config = {
    type: Phaser.CANVAS,
    // autoCenter: Phaser.Scale.CENTER_BOTH,
    // mode: Phaser.Scale.FIT,
    width: 800,
    height: 960,
    backgroundColor: '#4488AA',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('bar', 'assets/bar.png');
    this.load.image('ring', 'assets/ring.png');
}

var ring;
var ball;
var bar;

function create() {
    ring = this.add.sprite(400, 480, 'ring');
    // ball.anchor.set(0.5);
    ring.alpha = 0.5;

    ball = this.add.sprite(0, 0, "ball");
    // ball.anchor.set(0.5);
    ball.ballAngle = -90;
    placeBall();

    bar = this.add.sprite(400, 480, "bar");
    // bar.anchor.set(0, 0.5);
    bar.angle = -90;
    bar.crossingBall = false;
    bar.rotationDirection = 0;
    this.input.onDown.add(startMoving(), this);
}

function placeBall() {
    do {
        var newAngle = Math.random(360) - 180;
    } while (angleDifference(newAngle, ball.ballAngle) < 40)
    ball.ballAngle = newAngle;
    ball.x = game.width / 2 + 175 * Math.cos(ball.ballAngle * Math.PI/180);
    ball.y = game.height / 2 + 175 * Math.sin(ball.ballAngle * Math.PI/180);
    }

function startMoving() {
    this.input.onDown.remove(startMoving(), this);
    this.input.onDown.add(changeDirection(), this);
    bar.rotationDirection = 1;
}

function changeDirection() {
    var angleDifference = Math.abs(ball.ballAngle - bar.angle);
    if (angleDifference > maxAngleDifference) {
        fail();
    } else {
        bar.crossingBall = false;
        bar.rotationDirection *= -1;
        placeBall();
    }
}

function fail() {
    bar.rotationDirection = 0; 
    bar.tint = 0xff0000;
}

function update() {
    bar.angle += rotationSpeed * bar.rotationDirection;
    var angleDifference = Math.abs(ball.ballAngle - bar.angle);
    if (angleDifference < maxAngleDifference && !bar.crossingBall) {
        bar.crossingBall = true;
    }
    if (angleDifference > maxAngleDifference && bar.crossingBall) {
        fail();
    }
}

function angleDifference(a1, a2) {
    return Math.abs((a1 + 180 - a2) % 360 - 180);
}




