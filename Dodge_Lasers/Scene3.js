class Scene3 extends Phaser.Scene {
	constructor() {
		super("gameOver"); //'super' makes the class inherit all the characteristics of its predecessor, the class 'Scene' from Phaser
	}

	//Import the time variable from Scene2 upon initialization.  
	init(data){
		this.time = data
	}

	create() {
		this.text = this.add.text(222, config.height/2.-100, "Game Over", {
			font: "65px Arial",
			fill: 'White'
		});

		this.text2 = this.add.text(250, 500, "You survived for "+this.time+" frames")

		//Create the restart button and make it clickable
		const restart = this.add.image(385, config.height/2., "RESTART")
		restart.setInteractive();

		this.text3 = this.add.text(333,333, "Press Shift")

		//Create a variable to listen for Keyboard Events
		this.cursorKeys = this.input.keyboard.createCursorKeys();

		//Restart game when restart button is clicked
		restart.on('pointerdown', () => { this.rrestart(); });
	}
	update(){

		this.text.setText("Game Over")

		if(this.cursorKeys.shift.isDown){
			this.rrestart();
		}

		if (gSettings.state == 'alive'){
			this.scene.start("playGame"); //Launch scene 2
		}

		this.checkDead();
	}

	//'restart' is already taken (variable name of the button)
	rrestart() {
		gSettings.state = 'alive'
	}
	checkDead(){
		if (gSettings.state == 'alive'){
			this.scene.start("playGame"); //Launch scene 2
		}
	}
}