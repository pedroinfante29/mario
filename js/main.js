var game = new Phaser.Game(400, 490);
var music;
var starfield;
var explosions;

var mainState = {

    preload: function() { 
        //game.stage.backgroundColor = '#71c5cf';
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
        game.load.image('mario', 'assets/mario.png'); 
        game.load.image('mariom', 'assets/mariom.png');  
        game.load.image('cajat', 'assets/cajat.png'); 
        game.load.audio('jump', 'assets/jump.wav');
        game.load.image('background', 'assets/fon.jpg');
        game.load.audio("Sonido","assets/sonido.wav");
        game.load.audio("Muerte","assets/muerte.wav");
        game.load.image('explo', 'assets/explocion.png');
        
    },

    create: function() {
    	muerte = game.add.audio('Muerte');
    	sonido = game.add.audio('Sonido');
    	sonido.play();
    	
    	
        if(!game.device.desktop) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }
        starfield = game.add.tileSprite(0, 0, 400, 490, 'background');
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.cajats = game.add.group();
        this.timer = game.time.events.loop(1500, this.addRowOfcajats, this);           

        this.mario = game.add.sprite(100, 245, 'mario');
        game.physics.arcade.enable(this.mario);
        this.mario.body.gravity.y = 1000; 
        this.mario.anchor.setTo(-0.2, 0.5); 
 
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this); 
        game.input.onDown.add(this.jump, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  
		if(this.score >= 30){
			alert('Nivel Superado');
		}
		
        this.jumpSound = game.add.audio('jump');
        this.jumpSound.volume = 0.2;
        
    },

    update: function() {
    	
    	starfield.tilePosition.x -= 1;
        game.physics.arcade.overlap(this.mario, this.cajats, this.hitcajat, null, this); 

        if (this.mario.y < 0 || this.mario.y > game.world.height)
            this.restartGame(); 

        if (this.mario.angle < 20)
            this.mario.angle += 1;  
    },

    jump: function() {
        if (this.mario.alive == false)
            return; 

        this.mario.body.velocity.y = -350;

        game.add.tween(this.mario).to({angle: -20}, 100).start();

        this.jumpSound.play();
    },

    hitcajat: function() {
		
    	sonido.stop();
    	
        if (this.mario.alive == false)
            return;
            
        this.mario.alive = false;

        game.time.events.remove(this.timer);
    
    	game.add.image(this.mario.x, this.mario.y, 'mariom');
    	this.mario.visible = false;
    
        this.cajats.forEach(function(p){
            p.body.velocity.x = 100;
        }, this);
        muerte.play();
        muerte.speed = 9;
        
        
    },

    restartGame: function() {
        game.state.start('main');
        sonido.stop();
        muerte.stop();
    },
	
    addOnecajat: function(x, y) {
        var cajat = game.add.sprite(x, y, 'cajat');
        this.cajats.add(cajat);
        game.physics.arcade.enable(cajat);

        cajat.body.velocity.x = -200;  
        cajat.checkWorldBounds = true;
        cajat.outOfBoundsKill = true;
    },

    addRowOfcajats: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.addOnecajat(400, i*60+10);   
    
        this.score += 1;
        this.labelScore.text = this.score;  
    },
};

game.state.add('main', mainState);  
game.state.start('main'); 