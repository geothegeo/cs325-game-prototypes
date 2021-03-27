import "./phaser.js";

class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
    }
    create() {
        this.frames = this.textures.get('cards').getFrameNames();
        let x = config.width/2;
        let y = config.height/2;
        this.deck = [];
        for (var i = 0; i < 64; i++)
        {
            this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames)).setInteractive();
        }
        this.tfArr = [];
        // createTFArr();

        this.timeIntrvl = 5000;
        this.totalTime = this.timeIntrvl*52
        this.deckTimer = this.time.addEvent({ delay: this.totalTime, callback: this.killGame, callbackScope: this});
        this.gameOver = false;

        this.score = 0;
        this.currentInd = 0;
        this.cardIntrvl = 12;
 
        this.text = this.add.text(0, config.height - (config.height-64), "Current Hits: 0", {
            font: "48px Arial",
            fill: "#ffffff"
        });

        // this.input.on("pointerup", this.checkMatch, this);
    }
    update() {
        // if(score == -3) {
        //     this.text.setText("Game Over! You Mishit Too Many!");
        //     return;
        // }
        if(this.gameOver) {
            this.text.setText("Game Finished! Total Hits: " + score);
            return;
        }
        // if(this.deckTimer.getRemainingSeconds() % this.timeIntrvl == 0) {
        //     this.moveCard(gameObject);
        //     this.currentInd += 1;
        //     score += 1;
        // }
        // this.text.setText("Current Hits: " + score);
    }

    // createTFArr() {
    //     for(i = 0; i < 52; i++) {
    //         this.tfArr.add(false);
    //     }
    //     for(i = this.cardIntrvl-1; i < 52; i++) {
    //         let checkInd = this.cardIntrvl + 1;
    //         if(this.deck[i]%13 == this.deck[i-checkInd]%13)
    //             this.tfArr[i] = true;
    //     }
    // }
 
    // checkMatch(e) {
    //     if(this.tfArr[this.currentInd] == true) {
    //         score += 1;
    //     } else {
    //         score -= 1;
    //     }
    // }
 
    // moveCard(gameObject) {
    //     // tween the card outside of the stage to the right
    //     this.tweens.add({
    //         targets: this.cardsInGame[cardToMove],
    //         x: game.config.width + 2 * gameOptions.cardWidth * gameOptions.cardScale,
    //         duration: 500,
    //         ease: "Cubic.easeOut"
    //     }); 

        // this.tweens.add({
        //     targets: this.cardsInGame[cardToMove],
        //     y: game.config.height / 2,
        //     duration: 500,
        //     ease: "Cubic.easeOut",
        //     callbackScope: this,
        //     onComplete: function(){
 
        //         // ... then recycle the card which we moved outside the screen
        //         cardToMove = this.nextCardIndex % 2;
        //         this.cardsInGame[cardToMove].setFrame(this.deck[this.nextCardIndex]);
        //         this.nextCardIndex = (this.nextCardIndex + 1) % 52;
        //         this.cardsInGame[cardToMove].x = gameOptions.cardWidth * gameOptions.cardScale / -2;
 
        //         // now we can swipe again
        //         this.isMatch = true;
        //     }
        // });
    // }

    killGame() {
        this.gameOver = true;
    }
}

var config = {
    type: Phaser.AUTO,
    backgroundColor: 0x4488aa,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "thegame",
        width: 576,
        height: 800
    },
    scene: playGame
};

var game;
 
game = new Phaser.Game(config);

 
