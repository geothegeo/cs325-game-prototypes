import "./phaser.js";

var game = new Phaser.Game({
    type: Phaser.AUTO,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
    parent: 'game',
    width: 800,
    height: 960,
    scene: MyScene
});

var rotationSpeed = 3;
var maxAngleDifference = 10;

var MyScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
    
    function MyScene () {

        Phaser.Scene.call(this, { key: 'MyScene', active: true });

        this.frames;
    },

    preload: function() {
        // Load an image and call it 'logo'.
        this.load.image("ball", "assets/ball.png");
        this.load.image("bar", "assets/bar.png");
        this.load.image("ring", "assets/ring.png");
    },
    
    create() {
        game.stage.backgroundColor = "#4488AA";

        var ring = game.add.sprite(game.width / 2, game.height / 2, "ring");
        ring.anchor.set(0.5);
        ring.alpha = 0.5;

        this.ball = game.add.sprite(0, 0, "ball");
        this.ball.anchor.set(0.5);
        this.ball.ballAngle = -90;
        this.placeBall();

        this.bar = game.add.sprite(game.width / 2, game.height / 2, "bar");
        this.bar.anchor.set(0, 0.5);
        this.bar.angle = -90;
        this.bar.crossingBall = false;
        this.bar.rotationDirection = 0;
        game.input.onDown.add(this.startMoving, this);

    },
    
    update() {
        this.bar.angle += rotationSpeed * this.bar.rotationDirection;
        var angleDifference = Math.abs(this.ball.ballAngle - this.bar.angle);
        if (angleDifference < maxAngleDifference && !this.bar.crossingBall) {
            this.bar.crossingBall = true;
        }
        if (angleDifference > maxAngleDifference && this.bar.crossingBall) {
            this.fail();
        }
    },

    placeBall: function() {
        do {
          var newAngle = game.rnd.angle();
        } while (angleDifference(newAngle, this.ball.ballAngle) < 40)
        this.ball.ballAngle = newAngle;
        this.ball.x = game.width / 2 + 175 * Math.cos(Phaser.Math.degToRad(this.ball.ballAngle));
        this.ball.y = game.height / 2 + 175 * Math.sin(Phaser.Math.degToRad(this.ball.ballAngle));
      },

    startMoving: function() {
        game.input.onDown.remove(this.startMoving, this);
        game.input.onDown.add(this.changeDirection, this);
        this.bar.rotationDirection = 1;
    },

    changeDirection: function() {
        var angleDifference = Math.abs(this.ball.ballAngle - this.bar.angle);
        if (angleDifference > maxAngleDifference) {
            this.fail();
        } else {
            this.bar.crossingBall = false;
            this.bar.rotationDirection *= -1;
            this.placeBall();
        }
    },

    fail: function () {
        this.bar.rotationDirection = 0; 
        this.bar.tint = 0xff0000;
    }
});

function angleDifference(a1, a2) {
    return Math.abs((a1 + 180 - a2) % 360 - 180);
}
