var gSettings = {
	playerSpeed: 0,
	maxSpears: 0,
	spearEvery: 20,
	spearProb: 1.0,
	spearAvgVel: 450,
	spearVelStd: 200,
	state: 'alive'
}
var config = {
	width: 800,
	height: 600,
	backgroundColor: 'black',
	scene: [Scene1, Scene2, Scene3],
	pixelArt: true,
	//Enable arcade physics, which is very lightweight
	physics: {
		default: "arcade",
		arcade:{
			debug: false
		}
	}
}
var game = new Phaser.Game(config);