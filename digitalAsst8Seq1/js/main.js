import "./phaser.js";

// var path;
var curve;
var points;
var graphics;

var startX;
var endX;
var point;
var location;
var px;
var distance;

var text;
var ropeTimer = 0;
var gameStart = false;
var speed = 1;
var gameOver = false;

function create ()
{
    graphics = this.add.graphics().lineStyle(1, 0xffffff, 1);

    // path = { t: 0, vec: new Phaser.Math.Vector2() };

    points = [
        274, 342,
        412, 257,
        522, 341,
        664, 264,
        724, 235,
        900, 432
    ];

    startX = points[0];
    endX = points[points.length - 2];

    console.log(startX, endX);

    curve = new Phaser.Curves.Spline(points);

    curve.draw(graphics, 64);

    point = curve.getPointAt(0);

    location = this.add.rectangle(point.x, point.y, 16, 16, 0xff00ff, 0.8);

    text = this.add.text(32, 32);

    this.input.on('pointermove', pointer => {

        //  getPointAt requires a value between 0 and 1 (start and end of curve)
        //  We know the start and end x coordinate of the curve, so we can calculate it from that

        let px = pointer.worldX;
        distance = endX - startX;

        if (px >= startX && px <= endX)
        {
            px -= startX;

            curve.getPointAt(px / distance, point);

            location.setPosition(point.x, point.y);
        }

    });
}

function update ()
{
    var pointer = this.input.activePointer;

    this.input.on('pointerdown', function (pointer) {
        gameStart = true;
    }, this);

    if(gameStart) {
        ropeTimer += 1;
        // text.setText('Seconds passed: ' + ropeTimer.toString());
    
        graphics.clear();
    
        graphics.lineStyle(1, 0xffffff, 1);
    
        for(let i = 0; i < points.length; i+=2) {
            points[i] -= speed;
        }
        
        if (points[2] <= 0) {
            points.shift();
            points.shift();
        }
    
        if (points[points.length-2] <= 850) {
            points.push(Phaser.Math.Between(900, 1000));
            points.push(Phaser.Math.Between(50, 550));
        } 
    
        curve = new Phaser.Curves.Spline(points);
    
        curve.draw(graphics, 64);

        // --------------------------------------------------------------------

        if(points[0] <= 0) {
            startX = 0;
        } else {
            startX = points[0];
        }
        endX = 800;
    
        distance = endX - startX;

        if (px >= startX && px <= endX)
        {  
            curve.getPointAt(px / distance, point);

            location.setPosition(point.x, point.y);
        }

        text.setText([
            'Seconds passed: ' + ropeTimer.toString(),
            'Pointer x: ' + pointer.worldX,
            'Pointer y: ' + pointer.worldY,
            'Curve x: ' + point.x,
            'Curve y: ' + point.y,
            'dist: ' + Phaser.Math.Distance.BetweenPoints(point, pointer),
            'speed: ' + speed,
            'gameOver: ' + gameOver
        ]);

        if(Phaser.Math.Distance.BetweenPoints(point, pointer) >= 50) {
            gameOver = true;
        } else {
            gameOver = false;
        }

        if(ropeTimer / 1000 == 1) 
            speed += .5;
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 0x482742,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};
  
var game = new Phaser.Game(config);
