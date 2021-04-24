import "./phaser.js";

const { abs, max, min } = Math;
const { BetweenPoints } = Phaser.Math.Distance;
const colors = [0x3bd6c6, 0x40e0d0, 0x43e8d8, 0x89ecda];

var curve;
var points;
var graphics;

var text;
var txtBot;
var rect;
var rectX = 50;
var score = 0;
var gameStart = false;
var gameOver = false;
var bgSound;
var bgSndConfig;

var colorIdx = 1;
var localStorageName = "ropeScore";
var speed = 1.6;
var dist = 52;

const cursor = new Phaser.Math.Vector2();

function preload ()
{
    this.load.audio("bgMusic", "assets/background.mp3");
}

function create ()
{
    var bgSndConfig = {
        volume: .25,
        loop: true,
        delay: 0
    }
    bgSound = this.sound.add('bgMusic', bgSndConfig);
    
    graphics = this.add.graphics();

    points = [
        274, 342,
        412, 257,
        522, 341,
        664, 264,
        724, 235,
        900, 432
    ];

    curve = new Phaser.Curves.Spline(points);

    text = this.make.text({
        x: 16, 
        y: 16,
        style: {
            font: '20px',
            color: '#000'
        }
    });
    txtBot = this.make.text({
        x: 624, 
        y: 536,
        style: {
            font: 'bold 22px Arial',
            color: '#000'
        }
    });

    this.input.on('pointermove', function(pointer) {
        cursor.set(pointer.worldX, pointer.worldY);
    });

    text.setText("Please click inside the red circle to begin");
    graphics.fillStyle(0xd62d20, 0.8).fillCircle(points[0], points[1], 20);
}

function update ()
{
    this.input.on('pointerdown', function(pointer) {
        let beginDist = Phaser.Math.Distance.Between(274, 342, pointer.x, pointer.y);
        if (beginDist <= 20 && !gameStart){
            points = [
                274, 342,
                412, 257,
                522, 341,
                664, 264,
                724, 235,
                900, 432
            ];
            curve = new Phaser.Curves.Spline(points);
            gameStart = true;
            gameOver = false;
            cursor.set(pointer.x, pointer.y);
            bgSound.play(bgSndConfig);
            speed = 1.6;
            dist = 52;
            score = 0;
            rectX = 50;
        }
    }, this);

    if(gameStart && !gameOver) {
        score += 1;
        // text.setText('Seconds passed: ' + score.toString());
    
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
            points.push(Phaser.Math.Between(950, 1050));
            points.push(Phaser.Math.Between(75, 525));
        } 

        curve = new Phaser.Curves.Spline(points);
        curve.draw(graphics, 64);

        if(rectX <= 600)
            rectX += speed/50;
        rect = Phaser.Geom.Rectangle.FromXY(0, 75, rectX, 525);
        graphics.fillStyle(0x0000FF, 0.8).fillCircle(cursor.x, cursor.y, 10);
        graphics.fillStyle(0xffa700, 0.9).fillRectShape(rect);

        const closest = getClosestR(cursor, curve, 10, 3, BetweenPoints);
        drawPoint(closest.point, 0xFF0000, 0.8);

        text.setText([
            'Current score:      ' + score,
            'Distance from line: ' + closest.distance.toFixed(2),
        ]);
        txtBot.setText([
            'Max Dist:  ' + dist,
            'Speed:     x' + speed.toFixed(1)
        ]);
 
        if(closest.distance >= dist || (cursor.x-10) <= rectX) {
            gameStart = false;
            gameOver = true;
            bgSound.stop();
            graphics.clear();
            let prevHS = localStorage.getItem(localStorageName) == null ? 0 :localStorage.getItem(localStorageName);
            let highScore = Math.max(score, prevHS);
            localStorage.setItem(localStorageName, highScore);
            let hsTxt = score > prevHS ? "NEW HIGH SCORE! " : "";
            hsTxt += "Previous best score: " + prevHS + ".";
            text.setText([
                "Game Over! You score was " + score + "!",
                hsTxt,
                "",
                "Click inside the red circle to start over."
            ]);
            graphics.fillStyle(0xd62d20, 0.8).fillCircle(274, 342, 20);
            txtBot.setText("");
        }

        if(score % 750 == 0){
            if(speed != 4)
                speed += .4;
            if(dist != 20)
                dist -= 4;
            colorIdx += 1;
            this.cameras.main.setBackgroundColor(colors[colorIdx%3]);
        }
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
    backgroundColor: 0x3bd6c6,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
  
var game = new Phaser.Game(config);
