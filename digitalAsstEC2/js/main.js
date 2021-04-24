import "./phaser.js";

const { abs, max, min } = Math;
const { BetweenPoints } = Phaser.Math.Distance;

var graphics;

var alph = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var p = [[],[],[],[],[]];
var gameTxt;
var txt1, txt2, txt3, txt4, txt5;
var key1, key2, key3, key4, key5;

var score = 0;
var misses = 0;
var gameStart = false;
var isGenerate = true;

var startTime = 1750;
var gTime = startTime;
var txtNum = 1;
var subLvl = 1;
var radius = 20;

// const cursor = new Phaser.Math.Vector2();

function create ()
{
    graphics = this.add.graphics();

    gameTxt = this.make.text({
        x: 16, 
        y: 16,
        style: {
            font: '20px',
            color: '#000'
        }
    });
    txt1 = this.add.text(0,0,"",{ fontFamily: 'Arial', fontSize: 20, color: '#ffc30b' }).setOrigin(0.5);
    txt2 = this.add.text(0,0,"",{ fontFamily: 'Arial', fontSize: 20, color: '#ffc30b' }).setOrigin(0.5);
    txt3 = this.add.text(0,0,"",{ fontFamily: 'Arial', fontSize: 20, color: '#ffc30b' }).setOrigin(0.5);
    txt4 = this.add.text(0,0,"",{ fontFamily: 'Arial', fontSize: 20, color: '#ffc30b' }).setOrigin(0.5);
    txt5 = this.add.text(0,0,"",{ fontFamily: 'Arial', fontSize: 20, color: '#ffc30b' }).setOrigin(0.5);

    gameTxt.setText("Please click anywhere inside the game to start.");
}

function update ()
{
    if(misses >= 3) {
        gameStart = false;
        graphics.clear();
        gameTxt.setText("Game Over! You score was " + score + ".");
        resetGame();
        return;
    }

    let pointer = this.input.activePointer;

    if(!gameStart && pointer.isDown) {
        gameStart = true;
    }

    // this.input.on('pointerdown', function(pointer) {        

    // }, this);
    if(gameStart) {

        gameTxt.setText([
            'Time:          ' + gTime,
            'Current score: ' + score,
            'Misses:        ' + misses
        ]);

        if(isGenerate) {
            graphics.clear();
            graphics.lineStyle(1, 0xffffff, 1);
            
            if(subLvl == 6){
                if(txtNum <= 5) {
                    txtNum += 1;
                    subLvl = 1;
                }
                if(radius >= 12)
                    radius -= 2;
            }
            
            if (gTime > 400 || txtNum != 5)
                gTime = startTime - (275-(txtNum-1)*25) * (subLvl-1);

            genPoints();
            drawCircles();

            if(p[0].length != 0) {
                txt1.x = p[0][0]; txt1.y = p[0][1]; txt1.setText(p[0][2]);
                key1 = this.input.keyboard.addKey(p[0][2]);
            }
            if(p[1].length != 0) {
                txt2.x = p[1][0]; txt2.y = p[1][1]; txt2.setText(p[1][2]);
                key2 = this.input.keyboard.addKey(p[1][2]);
            }
            if(p[2].length != 0) {
                txt3.x = p[2][0]; txt3.y = p[2][1]; txt3.setText(p[2][2]);
                key3 = this.input.keyboard.addKey(p[2][2]);
            }
            if(p[3].length != 0) {
                txt4.x = p[3][0]; txt4.y = p[3][1]; txt4.setText(p[3][2]);
                key4 = this.input.keyboard.addKey(p[3][2]);
            }
            if(p[4].length != 0) {
                txt5.x = p[4][0]; txt5.y = p[4][1]; txt5.setText(p[4][2]);
                key5 = this.input.keyboard.addKey(p[4][2]);
            }

            isGenerate = false;
        } else {
            gTime -= 1;
            let isComplete = p[0].length == 0 && p[1].length == 0 && p[2].length == 0 && p[3].length == 0 && p[4].length == 0;
            if(gTime == 0) {
                if(!isComplete) {
                    for(let i = 0; i < txtNum; i++) {
                        if(p[i].length != 0) 
                            misses += 1;
                    }
                    isComplete = true;
                    subLvl -= 1;
                }
            }

            if(isComplete) {
                isGenerate = true;
                subLvl += 1;
            } else {
                if(!(typeof key1 === 'undefined')) {
                    if(key1.isDown && pointer.isDown) {
                        let dist = Phaser.Math.Distance.Between(p[0][0], p[0][1], pointer.x, pointer.y);
                        if(dist <= radius) {
                            score += 1;
                            graphics.fillStyle(0xC0C0C0, 1).fillCircle(p[0][0], p[0][1], radius);
                            this.input.keyboard.removeKey(p[0][2]);
                            txt1.setText("");
                            p[0] = [];
                        } 
                    }
                }
                if(!(typeof key2 === 'undefined')) {
                    if(key2.isDown && pointer.isDown) {
                        let dist = Phaser.Math.Distance.Between(p[1][0], p[1][1], pointer.x, pointer.y);
                        if(dist <= radius) {
                            score += 1;
                            graphics.fillStyle(0xC0C0C0, 1).fillCircle(p[1][0], p[1][1], radius);
                            this.input.keyboard.removeKey(p[1][2]);
                            txt2.setText("");
                            p[1] = [];
                        } 
                    }
                }
                if(!(typeof key3 === 'undefined')) {
                    if(key3.isDown && pointer.isDown) {
                        let dist = Phaser.Math.Distance.Between(p[2][0], p[2][1], pointer.x, pointer.y);
                        if(dist <= radius) {
                            score += 1;
                            graphics.fillStyle(0xC0C0C0, 1).fillCircle(p[2][0], p[2][1], radius);
                            this.input.keyboard.removeKey(p[2][2]);
                            txt3.setText("");
                            p[2] = [];
                        } 
                    }
                }
                if(!(typeof key4 === 'undefined')) {
                    if(key4.isDown && pointer.isDown) {
                        let dist = Phaser.Math.Distance.Between(p[3][0], p[3][1], pointer.x, pointer.y);
                        if(dist <= radius) {
                            score += 1;
                            graphics.fillStyle(0xC0C0C0, 1).fillCircle(p[3][0], p[3][1], radius);
                            this.input.keyboard.removeKey(p[3][2]);
                            txt4.setText("");
                            p[3] = [];
                        } 
                    }
                }
                if(!(typeof key5 === 'undefined')) {
                    if(key5.isDown && pointer.isDown) {
                        let dist = Phaser.Math.Distance.Between(p[4][0], p[4][1], pointer.x, pointer.y);
                        if(dist <= radius) {
                            score += 1;
                            graphics.fillStyle(0xC0C0C0, 1).fillCircle(p[4][0], p[4][1], radius);
                            this.input.keyboard.removeKey(p[4][2]);
                            txt5.setText("");
                            p[4] = [];
                        } 
                    }
                }
            }
        }
    }
}

function genPoints() {
    for(let i = 0; i < txtNum; i++) {
        p[i].push(Phaser.Math.Between(100, 700)); // x
        p[i].push(Phaser.Math.Between(100, 500)); // y
        let l = Phaser.Math.Between(0, 25);
        p[i].push(alph[l]); // letter
    }
}

function drawCircles() {
    for(let i = 0; i < txtNum; i++) {
        graphics.fillStyle(0x857be2, 0.75).fillCircle(p[i][0], p[i][1], radius);
    }
}

function resetGame() {
    p = [[],[],[],[],[]];
    txt1.setText("");
    txt2.setText("");
    txt3.setText("");
    txt4.setText("");
    txt5.setText(""); 
    txtNum = 1;
    subLvl = 1;
    radius = 20;
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 0xC0C0C0,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};
  
var game = new Phaser.Game(config);
