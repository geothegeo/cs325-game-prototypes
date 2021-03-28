import "./phaser.js";

var config = {
    type: Phaser.AUTO,
    backgroundColor: 0x4488aa,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    dom: {
        createContainer: true
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var startGame = false;

var game = new Phaser.Game(config);

var frames;
var deck = [];
var cardOrder = []; // Track card name string order
var cardClicked = []; // Make sure score/hit can only be set off once
var tfArr = []; // Based on cardOrder, track T/F based on card Interval

var timeIntrvl = 0;
var totalTime = 0;
var deckTimer;

var score = 0;
var misses = 0;
var totalHits = 0;
var currentInd = 0;
var cardIntrvl = 0;
var gameOver = false;
var text;

function preload ()
{
    this.load.html('nameform', 'assets/text/form.html');
    this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
}

function create ()
{
    let preText = this.add.text(175, 10, 'Please Set Values to Play', { color: 'white', fontFamily: 'Arial', fontSize: '40px '});

    let element = this.add.dom(400, 600).createFromCache('nameform');
    element.setPerspective(800);
    element.addListener('click');
    element.on('click', event => {
        if (event.target.name === 'playButton')
        {
            let inputDisplayIntrvl = element.getChildByName('displayIntrvl');
            let inputCardIntrvl = element.getChildByName('cardIntrvl');

            if (inputDisplayIntrvl.value !== '' && inputCardIntrvl.value !== '')
            {
                element.removeListener('click');

                element.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 1500, ease: 'Power3' });
                element.scene.tweens.add({ targets: element, scaleX: 2, scaleY: 2, y: 700, duration: 1500, ease: 'Power3',
                    onComplete: function ()
                    {
                        element.setVisible(false);
                    }
                });
                timeIntrvl = parseInt(inputDisplayIntrvl.value) * 1000;
                cardIntrvl = parseInt(inputCardIntrvl.value);
                startGame = true;
                totalTime = timeIntrvl*52 + (timeIntrvl-1);
                deckTimer = this.time.addEvent({ delay: totalTime, callback: killGame, callbackScope: this});
                preText.setText("");
            }
            else
            {
                element.scene.tweens.add({ targets: preText, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
            }
        }
    });
 
    this.tweens.add({
        targets: element,
        y: 300,
        duration: 3000,
        ease: 'Power3'
    });

    frames = this.textures.get('cards').getFrameNames();
    // remove card back
    frames.shift();
    // remove joker
    frames.splice(frames.indexOf("joker"),1);
    
    do {
        createArrs(this);
    } while (totalHits < 3);

    currentInd = deck.length - 1;

    text = this.add.text(5, 5, " ", {
        font: "40px Arial",
        fill: "#ffffff"
    });
}

function update() {
    if (startGame) {
        if(misses == 3) {
            text.setText("Game Over! You Mishit Too Many!");
            return;
        }
        if(gameOver || deck.length == 0) {
            if(score == totalHits)
                text.setText("You Win! You Slapped All " + totalHits + " Possible Hits!");
            else
                text.setText("Game Finished! You Got " + score + "/" + totalHits + " Possible Hits.");
            return;
        }
        if((deckTimer.getRemainingSeconds() % (timeIntrvl/1000)) < 0.02) {
            moveCard(this);
            currentInd -= 1;
        }

        this.input.on('gameobjectdown', function (pointer, gameObject) {
            gameObject.disableInteractive();
            if(!cardClicked[currentInd])
                checkMatch();
            cardClicked[currentInd] = true;       
        }, this);

        // text.setText("Hit: " + tfArr[currentInd] + "\nMod: " + (deckTimer.getRemainingSeconds() % (timeIntrvl/1000)) + "\nTime: " + deckTimer.getRemainingSeconds().toFixed(1) + "\nCurrent Hits: " + score);
        // text.setText("time Interval: " + timeIntrvl/1000 + "\nCard Interval: " + cardIntrvl + "\n");
        text.setText("Cards left in Deck: " + deck.length + "\nPossible Number of Hits: " + totalHits + "\nMishits: " + misses);
    } 
}

function createArrs(context) {
    let x = config.width/2;
    let y = config.height/2;
    let checkInd = cardIntrvl + 1;

    deck = [];
    cardOrder = [];
    cardClicked = [];
    tfArr = [];

    for (var i = 0; i < frames.length; i++)
    {
        let cardName = Phaser.Math.RND.pick(frames);
        let card = context.add.image(x, y, 'cards', cardName).setInteractive();
        deck.push(card);
        cardName = cardName.replace("clubs", "");
        cardName = cardName.replace("diamonds", "");
        cardName = cardName.replace("hearts", "");
        cardName = cardName.replace("spades", "");
        cardOrder.push(cardName);
        cardClicked.push(false);
    }

    for(var j = 0; j < cardOrder.length; j++) {
        if (j < cardOrder.length - cardIntrvl) {
            if(cardOrder[j] === cardOrder[j+checkInd]) {
                tfArr.push(true);
                totalHits += 1;
            } else
                tfArr.push(false);
        } else {
            tfArr.push(false);
        }
    }
}

function checkMatch() {
    if(tfArr[currentInd] == true) {
        score += 1;
    } else {
        misses += 1;
    }
}

function moveCard(context) {
    context.tweens.add({
        targets: deck[currentInd],
        y: { value: config.height*1.5, duration: 750, ease: 'Power0' }
    });

    deck.pop();
}

function killGame() {
    gameOver = true;
}