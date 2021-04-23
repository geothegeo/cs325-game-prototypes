import "./phaser.js";

const { abs, max, min } = Math;
const { BetweenPoints } = Phaser.Math.Distance;

// var path;
var curve;
var points;
var graphics;

var text;
var ropeTimer = 0;
var gameStart = false;
var speed = 1.5;
var gameOver = false;

const cursor = new Phaser.Math.Vector2();

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

    curve = new Phaser.Curves.Spline(points);

    curve.draw(graphics, 64);

    text = this.add.text(32, 32);

    this.input.on('pointermove', function(pointer) {
        cursor.set(pointer.worldX, pointer.worldY);
    });
}

function update ()
{
    this.input.on('pointerdown', function(pointer) {
        gameStart = true;
    }, this);

    if(gameStart && !gameOver) {
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

        graphics.fillStyle(0xFF0000, 0.8).fillCircle(cursor.x, cursor.y, 10);
  
        const closest = getClosestR(cursor, curve, 10, 3, BetweenPoints);
      
        drawPoint(closest.point, 0x0000FF, 0.8);

        text.setText([
            'Seconds passed: ' + ropeTimer.toString(),
            'speed: ' + speed,
            'distance: ' + closest.distance,
            'gameOver: ' + gameOver
        ]);
 
        if(closest.distance >= 25) {
            gameOver = true;
            graphics.clear();
            return;
        } else {
            gameOver = false;
        }

        if(ropeTimer % 1000 == 0) 
            speed += .5;
    } else {
        cursor.set(points[0], points[1]);
    }
}

function drawPoint(p, color, alpha) {
    graphics
      .fillStyle(color, alpha)
      .lineStyle(1, color, alpha)
      .fillCircle(p.x, p.y, 10)
      .lineBetween(p.x, p.y, cursor.x, cursor.y);
  }
  
function BetweenPointsX(a, b) {
    return abs(a.x - b.x);
}

function BetweenPointsY(a, b) {
    return abs(a.y - b.y);
}

function getClosest(target, curve, start, end, divisions, getDistance) {
    let d = (end - start) / divisions;
    let m = Infinity;
    let result = null;

    for (let t = start; t <= end; t += d) {
        const point = curve.getPoint(t);
        const distance = getDistance(target, point);
        const tLow = max(0, t - d);
        const tHigh = min(1, t + d);

        if (distance < m) {
            m = distance;
            result = {
                d,
                distance,
                point,
                t,
                tLow,
                tHigh,
                tRange: tHigh- tLow,
                dx: target.x - point.x,
                dy: target.y - point.y,
            };
        }
    }

    return result;  
}

function getClosestR(target, curve, divisions, iterations, getDistance) {
    let result = { tLow: 0, tHigh: 1 };

    while (iterations > 0) {
        iterations -= 1;

        result = getClosest(
        target,
        curve,
        result.tLow,
        result.tHigh,
        divisions,
        getDistance
        );
    }

    return result;
}

function objToString(o) {
    return JSON.stringify(o, replace, 2);
}

function replace(k, v) {
    if (k && v && v.toFixed) {
        return Number(v.toFixed(3));
    }

    return v;
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
