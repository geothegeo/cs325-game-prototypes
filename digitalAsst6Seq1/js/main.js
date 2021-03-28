import "./phaser.js";

var config = {
    type: Phaser.AUTO,
    backgroundColor: 0x4488aa,
    mode: Phaser.Scale.FIT,
    // autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
 
var game = new Phaser.Game(config);

var frames;
var deck = [];
var cardOrder = []; // Track card name string order
var cardClicked = []; // Make sure score/hit can only be set off once
var tfArr = []; // Based on cardOrder, track T/F based on card Interval

var timeIntrvl = 2000;
var totalTime = timeIntrvl*52 + 1999;
var deckTimer;

var score = 0;
var misses = 0;
var totalHits = 0;
var currentInd = 0;
var cardIntrvl = 3;
var gameOver = false;
var text;

function preload() {
    this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
}

function create() {
    frames = this.textures.get('cards').getFrameNames();
    // remove card back
    frames.shift();
    // remove joker
    frames.splice(frames.indexOf("joker"),1);
    
    createArrs(this);
    // console.log(frames);
    // console.log(deck);
    // console.log(cardOrder);
    // console.log(tfArr);

    currentInd = deck.length - 1;

    deckTimer = this.time.addEvent({ delay: totalTime, callback: killGame, callbackScope: this});

    text = this.add.text(5, 5, "Current Hits: 0", {
        font: "40px Arial",
        fill: "#ffffff"
    });

    // this.input.on("pointerup", this.checkMatch, this);
}

function update() {
    var pointer = this.input.activePointer;

    if(totalHits == 0) {
        text.setText("Please refresh to reshuffle the deck!");
        return;
    }
    if(misses == 3) {
        text.setText("Game Over! You Mishit Too Many!");
        return;
    }
    if(gameOver || deck.length == 0) {
        text.setText("Game Finished! Total Hits: " + score + "/" + totalHits);
        return;
    }
    if((deckTimer.getRemainingSeconds() % (timeIntrvl/1000)) < 0.02) {
        moveCard(this);
        currentInd -= 1;
    }

    if(pointer.isDown && !cardClicked[currentInd]) {
        pointer.isDown = false;
        cardClicked[currentInd] = true;
        checkMatch();    
    }
    text.setText("Display Time between each card: 2 sec" + "\nCard Interval: 3" + "\nPossible Number of Hits: " + totalHits + "\nCurrent Hits: " + score);

    // text.setText("Hit: " + tfArr[currentInd] + "\nMod: " + (deckTimer.getRemainingSeconds() % (timeIntrvl/1000)) + "\nTime: " + deckTimer.getRemainingSeconds().toFixed(1) + "\nCurrent Hits: " + score);
    // text.setText("\nTime: " + deckTimer.getRemainingSeconds().toFixed(1));
    // text.setText("\nCurrent Hits: " + score);
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




 
