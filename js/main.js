var canvas;
var ctx;

var player = {
	speed: 3,
	// velocity is not really a point, but it's an xy tuple
	vel: new Point(),
	pos: new Point(50, 50),
}

var frameDuration = 20;

function init() {
	canvas = document.getElementById('kiwijam');
	ctx = canvas.getContext('2d');
	
	registerListeners();
	
	var gameLoop = setInterval(runGame, frameDuration);
}

function runGame() {
	player.pos.offsetBy(player.vel.times(player.speed));
	drawScreen();
}

function drawScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#BFFF00'; // lime green
	
	ctx.beginPath();
	// x, y, width, startAngle, endAngle, reverse
	ctx.arc(player.pos.x, player.pos.y, 20, 0, 2 * Math.PI, false);
	
	ctx.fill();
}
