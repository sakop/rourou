var game = new Phaser.Game(800, 600, Phaser.AUTO, "game");
var platforms, ground, dude, gameStart = false, cursors, stars, soundScore, soundBalloon;

var hitCount = 0;
var messages = ["你好萌萌", "祝你生日快乐!", "漂漂亮亮", "可可爱爱", "回回美美", "健健康康", "早日升职", "早日发财", "还有别忘记好好对你老公!"];


function showMessage(dude, star) {

    star.kill();
    soundScore.play();
    var colors = ["yellow", "white", "red", "blue", "green", "brown", "turquoise", "magenta"];
    var text = game.add.text(game.width / 2, 10, messages[hitCount], {
        fontSize: 32,
        fill: colors[hitCount % colors.length]
    });
    hitCount++;
    text.anchor.setTo(0.5);
    game.add.tween(text).to({y: game.height + 100}, 4000, null, true, 0, 0, false);

    if (hitCount == 9) {
        setTimeout(function () {
            game.state.start("memorial");
        }, 1500);
    }
}

var boot = {
    preload: function () {
        game.load.image("boot_background", "assets/background-star.png");
    },
    create: function () {
        game.state.start("preload");
    }
};

var loadingText;
var preload = {
    init: function () {
        var bootBackground = game.add.image(0, 0, "boot_background");
        bootBackground.width = game.width;
        bootBackground.height = game.height;

        loadingText = game.add.text(game.width / 2, 300, "Plz wait, Loading: 0%", {
            font: "32px Arial",
            fill: "#ffffff",
            align: "center"
        });
        loadingText.anchor.setTo(.5);
    },
    preload: function () {
        game.load.image("background", "assets/sky.png");
        game.load.image("star", "assets/star.png");
        game.load.spritesheet("dude", "assets/dude.png", 32, 48, 9);
        game.load.image("platform", "assets/platform.png");
        game.load.image("cats", "assets/cat_lovers.jpg");
        game.load.audio("score", "assets/score.wav");
        game.load.audio("balloon", "assets/balloon.mp3");
        game.load.image("cat", "assets/cat_lovers.jpg");
        game.load.image("white", "assets/white.png");
        game.load.image("red", "assets/red.png");
        game.load.onFileComplete.add(this.fileLoaded, this);
    },
    create: function () {
        game.state.start("game");
    },
    fileLoaded: function (progress) {
        loadingText.text = "Plz wait, Loading: " + progress + "%";
    }

};

var stateA = {
    preload: function () {

    },

    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        soundScore = game.add.sound('score');
        soundBalloon = game.add.sound('balloon');

        soundBalloon.play();
        game.add.sprite(0, 0, "background");
        platforms = game.add.group();
        platforms.enableBody = true;
        ground = platforms.create(0, game.world.height - 64, "platform");
        ground.scale.setTo(2);
        ground.body.immovable = true;

        var ledge = platforms.create(20, 120, "platform");
        ledge.body.immovable = true;
        ledge.scale.setTo(0.5);

        var ledge2 = platforms.create(190, 220, "platform");
        ledge2.body.immovable = true;
        ledge2.scale.setTo(0.5);

        var ledge3 = platforms.create(300, 420, "platform");
        ledge3.body.immovable = true;
        ledge3.scale.setTo(0.5);

        var ledge4 = platforms.create(500, 320, "platform");
        ledge4.body.immovable = true;
        ledge4.scale.setTo(0.5);

        dude = game.add.sprite(150, game.world.height - 250, "dude");
        game.physics.arcade.enable(dude);
        dude.body.collideWorldBounds = true;
        dude.body.gravity.y = 400;
        dude.body.bounce.y = .3;
        dude.frame = 4;

        dude.animations.add("left", [0, 1, 2, 3], 10);
        dude.animations.add("right", [5, 6, 7, 8], 10);

        cursors = game.input.keyboard.createCursorKeys();

        stars = game.add.group();
        stars.enableBody = true;
        for (var i = 0; i < 9; i++) {
            var star = stars.create(20 + 70 * i, i, "star");
            star.body.gravity.y = 300;
            star.body.bounce.y = 0.5;
            star.message = messages[i];
        }

    },

    update: function () {
        var isCollide = game.physics.arcade.collide(dude, platforms);
        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.overlap(dude, stars, showMessage);
        if (cursors.left.isDown) {
            dude.body.velocity.x = -150;
            dude.animations.play("left");
        } else if (cursors.right.isDown) {
            dude.body.velocity.x = 150;
            dude.animations.play("right");
        } else {
            dude.body.velocity.x = 0;
            dude.frame = 4;
        }

        if (cursors.up.isDown && isCollide && dude.body.touching.down) {
            dude.body.velocity.y = -350;
        }
    }

};

var happyBirthDayChinese, happyBirthDayEnglish, amengmeng;
var stateB = {
    preload: function () {
    },
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        var bg = game.add.sprite(0, 0, "cat");
        bg.width = game.width;
        bg.height = game.height;

        amengmeng = game.add.text(10, 50, "阿萌萌!", {fontSize: 32, fill: "purple"});
        game.add.tween(amengmeng).to({x: game.width}, 2500, null, true, 0, 20000, true);

        happyBirthDayChinese = game.add.text(10, 250, "祝你生日快乐!", {fontSize: 32, fill: "yellow"});
        game.add.tween(happyBirthDayChinese).to({x: game.width}, 2500, null, true, 0, 20000, true);

        happyBirthDayEnglish = game.add.text(10, 450, "Happy Birthday!", {fontSize: 32, fill: "red"});
        game.add.tween(happyBirthDayEnglish).to({x: game.width}, 3000, null, true, 0, 20000, true);


        var emitter = game.add.emitter(game.world.centerX, 200);
        emitter.makeParticles('white');
        emitter.setXSpeed(-200, 200);
        emitter.setYSpeed(-150, -250);
        emitter.gravity = 300;
        emitter.flow(5000, 200, 1, -1);

        var emitter2 = game.add.emitter(game.world.centerX, 400);
        emitter2.makeParticles('red');
        emitter2.setXSpeed(-200, 200);
        emitter2.setYSpeed(-150, -250);
        emitter2.gravity = 300;
        emitter2.flow(5000, 200, 1, -1);
    },
    update: function () {
        happyBirthDayChinese.rotation += 0.02;
        happyBirthDayEnglish.rotation += 0.03;
    }
};

game.state.add("boot", boot);
game.state.add("preload", preload);
game.state.add("game", stateA);
game.state.add("memorial", stateB);
game.state.start("memorial");

