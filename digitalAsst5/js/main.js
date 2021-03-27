import "./phaser.js";

var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var ballDistance = 120;
var rotationSpeed = 2.5;
var angleRange = [25, 155];
var visibleTargets = 7;

var camera;
var text;
var saveRotationSpeed;
var targetArray = [];
var rotatingDirection = Phaser.Math.Between(0,1);
var gameGroup;
var targetGroup;
var ballGroup;
var score = 0;
var gameover = false;

var arm;
var balls;
var target;

var rotationAngle;
var rotatingBall;

var startX;
var startY;

function preload ()
{
    this.load.image("ball", "assets/ball.png");
    this.load.image("target", "assets/target.png");
    this.load.image("arm", "assets/arm.png");
}

function create ()
{
    text = this.add.text(0, config.height - 64, "Score: 0", {
        font: "bold 54px Arial",
        fill: "#ffffff"
    });
    text.setScrollFactor(0,0);

    saveRotationSpeed = rotationSpeed;

    camera = this.cameras.main;
    camera.setBackgroundColor("#03a5fc");

    gameGroup = this.add.group();
    targetGroup = this.add.group();
    ballGroup = this.add.group();
    gameGroup.add(targetGroup);
    gameGroup.add(ballGroup);

    arm = this.add.sprite(config.width/2, config.height/4*2.7, "arm");
    arm.setOrigin(0, 0.5);
    arm.tint = 0xff5300;
    arm.depth = 100;
    ballGroup.add(arm);

    balls = [
        this.add.sprite(config.width/2, config.height/4*2.7, "ball"),
        this.add.sprite(config.width/2, config.height/2, "ball")
    ]
    balls[0].setOrigin(0.5);
    balls[0].tint = 0xff5300;
    balls[0].depth = 100;
    balls[1].setOrigin(0.5);
    balls[1].tint = 0xff5300; 
    balls[1].depth = 100;
    ballGroup.add(balls[0]);
    ballGroup.add(balls[1]);

    rotationAngle = 0;
    rotatingBall = 1;
    target = this.add.sprite(0, 0, "target");
    target.setOrigin(.5);
    target.x = balls[0].x;
    target.y = balls[0].y;
    targetGroup.add(target);
    targetArray.push(target);

    gameGroup.x = balls[0].x;
    gameGroup.y = balls[0].y;

    for (var i = 0; i < visibleTargets; i++) {
        addCircle(this);
    }
}

function update() {

    if(gameover)
    {
        text.setText("Game Over! Score: " + score);
        return;
    }

    text.setText("Score: " + score);

    var pointer = this.input.activePointer;

    if(pointer.isDown) {
        pointer.isDown = false;
        var distanceFromTarget = Phaser.Math.Distance.Between(balls[rotatingBall].x, balls[rotatingBall].y, targetArray[1].x, targetArray[1].y);
        if (distanceFromTarget < 20) {
            rotatingDirection = Phaser.Math.Between(0, 1);
            targetArray[0].destroy();
            score ++;
            targetArray.shift();
            arm.x = balls[rotatingBall].x;
            arm.y = balls[rotatingBall].y;
            rotatingBall = 1 - rotatingBall;
            rotationAngle = Phaser.Math.Angle.Between(balls[1 - rotatingBall].x, balls[rotatingBall].x, balls[1 - rotatingBall].y, balls[rotatingBall].y) - 90;
            arm.angle = rotationAngle + 90;
            for (var i = 0; i < targetArray.length; i++) {
                targetArray[i].alpha += 1 / 7;
            }
            saveRotationSpeed += .25;
            addCircle(this);
        } else {
            gameOver(this);
        }
    }

    rotationAngle = (rotationAngle + saveRotationSpeed * (rotatingDirection * 2 - 1)) % 360;
    arm.angle = rotationAngle + 90;
    balls[rotatingBall].x = balls[1 - rotatingBall].x - ballDistance * Math.sin(rotationAngle * Math.PI/180);
    balls[rotatingBall].y = balls[1 - rotatingBall].y + ballDistance * Math.cos(rotationAngle * Math.PI/180);
    
    camera.startFollow(targetArray[0], false, .01, .01);
  }

function addCircle(context) {
    startX = targetArray[targetArray.length - 1].x;
    startY = targetArray[targetArray.length - 1].y;
    var target = context.add.sprite(0, 0, "target");
    var randomAngle = Phaser.Math.Between(angleRange[0] + 90, angleRange[1] + 90);
    target.setOrigin(0.5);
    target.x = startX + ballDistance * Math.sin(randomAngle * Math.PI/180);
    target.y = startY + ballDistance * Math.cos(randomAngle * Math.PI/180);
    target.alpha = 1 - targetArray.length * (1 / 7);
    targetGroup.add(target);
    targetArray.push(target);
}

function gameOver(context) {
    saveRotationSpeed = 0;
    arm.destroy();
    balls[1 - rotatingBall].destroy();
    gameover = true;
}