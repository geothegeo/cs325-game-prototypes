import "./phaser.js";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var bombs;
var platforms;
var movingPlatform;
var gameOver = false;
var time_delay = 45000;
var timerText;
var timedEvent;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/room.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('groundS', 'assets/platformS.png');
    this.load.image('star', 'assets/bearS.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    this.add.image(400, 300, 'sky').setScale(2);

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 605, 'ground').setScale(2).refreshBody();
    movingPlatform = this.physics.add.image(200, 450, 'groundS');
    platforms.create(500, 336, 'groundS');
    platforms.create(200, 252, 'groundS');
    platforms.create(Phaser.Math.Between(600, 650), 174, 'groundS');
    
    movingPlatform.setImmovable(true);
    movingPlatform.body.allowGravity = false;
    movingPlatform.setVelocityX(50);


    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    stars = this.physics.add.group({
        key: 'star',
        repeat: 9,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.75, 0.1));
        child.setCollideWorldBounds(true);
        child.setVelocityX(Phaser.Math.Between(-1, 1) * 50);
        child.allowGravity = false;
    });

    bombs = this.physics.add.group();

    timerText = this.add.text(16, 16, ' ', { fontSize: '28px', fill: '#2510e2' });
    timedEvent = this.time.addEvent({ delay: time_delay, callback: killGame, callbackScope: this});

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, movingPlatform);
    this.physics.add.collider(stars, movingPlatform);
    this.physics.add.collider(bombs, movingPlatform);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update ()
{
    var pointer = this.input.activePointer;

    if (gameOver)
    {
        return;
    }

    timerText.setText('Pick up your toys before time runs out! \nTimer(sec): ' + timedEvent.getRemainingSeconds().toFixed(1));

    if (player.body.touching.down && !pointer.isDown) 
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    else if (pointer.isDown) 
    {
        if (pointer.x <= player.x && pointer.y > player.y)
        {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        }     
        else if (pointer.x <= player.x && (pointer.y <= player.y) && player.body.touching.down ) 
        {
            player.setVelocityX(-160);
            player.setVelocityY(-330);
            player.anims.play('left', true);
        }

        else if (pointer.x > player.x && pointer.y > player.y)
        {
            player.setVelocityX(160);
            player.anims.play('right', true);
        }     
        else if (pointer.x > player.x && (pointer.y <= player.y) && player.body.touching.down ) 
        {
            player.setVelocityX(160);
            player.setVelocityY(-330);
            player.anims.play('right', true);
        }
    } 

    if (movingPlatform.x >= 600)
    {
        movingPlatform.setVelocityX(-50);
    }
    else if (movingPlatform.x <= 200)
    {
        movingPlatform.setVelocityX(50);
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        if (time_delay >= 23000)
            time_delay -= 3000;
        this.time.removeEvent(timedEvent);
        timedEvent = this.time.addEvent({ delay: time_delay, callback: killGame, callbackScope: this});

        var star = stars.create(Phaser.Math.Between(0, 800), 16, 'star');
        star.setBounceY(Phaser.Math.FloatBetween(0.75, 1));
        star.setCollideWorldBounds(true);
        star.setVelocityX(Phaser.Math.Between(-1, 1) * 50);
        star.allowGravity = false;

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}

function killGame()
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}