class Scene2 extends Phaser.Scene {
	constructor(){
		super("playGame")
	}

	create(){
		this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background')
		this.background.setOrigin(0,0);

		//Make the player a physics object with a handle to the "player" image
		this.player = this.physics.add.image(10.0, config.height/2, "player")
		this.player.setCollideWorldBounds(true);

		this.text = this.add.text(20, 40, "", {
			font: "15px Arial",
			fill: 'White'
		})

		//Create a variable to listen for keyboard events
		this.cursorKeys = this.input.keyboard.createCursorKeys();

		this.time = 0

		//Array of "tuples" of spear objects which contain the data in the first element, and the
		//image in the second element.
		this.spears = []

		gSettings.playerSpeed = 0
		gSettings.maxSpears = 2
	}

	update(){
		//Scroll the background
		this.background.tilePositionX += 7.0;

		//Gravitation aceleration
		gSettings.playerSpeed += 10;

		//Control the player's motion
		this.movePlayer();

		this.time++;

		//Potentially generate a spear to attack the player
		this.spearGen();

		this.spearDel();

		this.dispSettings();

		this.checkDead();
	}

	//Control player motion
	movePlayer(){
		if(this.cursorKeys.space.isDown){
			gSettings.playerSpeed -= 20.
		}
		//If we hit the top or bottom, kill the player
		if (this.player.y >= 520.0 || this.player.y <= 85.0){
			gSettings.state = 'dead'
		}
		this.player.setVelocityY(gSettings.playerSpeed);
	}

	//Every P frames, there will be a probability, Q, that a spear will be generated with a
	//velocity sampled from a distribution. P,
	spearGen(){
		var P = gSettings.spearEvery
		var Q = gSettings.spearProb
		var nSpears = this.spears.length

		if (this.time % 750 == 0){
			gSettings.maxSpears ++;
		}

		if (this.time % P == 0){
			if ((Math.random() < Q) && (nSpears < gSettings.maxSpears)){
				var spearY = 85+Math.random()*415;	//Make the y position of the spear a random location on the screen
				var spearX = 800;					//Set x position to far right of screen

				//Sample a Gaussian distribution for velocity
				var spearVx = -p5.prototype.randomGaussian(gSettings.spearAvgVel, gSettings.spearVelStd);

				//If the laser is too slow, or going in the opposite direction (which is possible with the Gaussian),
				//set velocity to the average
				if (spearVx > -5){
					spearVx = -gSettings.spearAvgVel;
				}

				//Add new spear
				this.spears.push([new spear(spearX, spearY, spearVx), this.physics.add.image(spearX, spearY, "spear")]);
				nSpears++;
				this.spears[nSpears-1][1].setVelocityX(this.spears[nSpears-1][0].vx);

				//Add collider with the player. Game over upon collision
				this.physics.add.overlap(this.player, this.spears[nSpears-1][1], this.die);
			}
		}
	}

	spearDel(){
		//This function will remove spears, deleting the data in the array for that spear, 
		//and resizing the array. This will all be facilitated by the changing of the 
		//'todelete' boolean to true
		var nSpears = this.spears.length;
		for (var i = 0; i < nSpears; i++){
			//If the spear reaches the end of the screen, destroy it
			if (this.spears[i][1].x < -27.0) {
				this.spears[i][0].todelete = true
			}
		}

		//Accomodate the fact that the array length is changing by decreasing the iterator variable,
		//i by 1 after removing a spear. Also break from the loop once the real end of the shortened
		//array is reached.
		for (var i = 0; i < nSpears; i++){
			if (i > this.spears.length - 1){
				break;
			}
			if (this.spears[i][0].todelete == true){
				this.spears[i][1].destroy(); //Destroy phaser physics object
				this.spears.splice(i,1); //Remove all data for this spear from the spears array
				i--;
			}
		}
	}

	dispSettings(){
		//Show info
		this.text.setText("y: "+this.player.y.toFixed(1)+'\nSurvival time (frames): '+this.time+'\n'+this.spears.length+' LASERS');
	}

	checkDead(){
		if (gSettings.state == 'dead'){
			//Launch scene 3 - Game over. Pass the time variable to the init function of scene 3 so it can display how long the player lived.
			this.scene.start("gameOver", this.time);
		}
	}

	die(){
		gSettings.state = 'dead'
	}
}

class spear {
	constructor(x, y, vx) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.todelete = false;
	}
}
