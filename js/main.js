var canvas;
var ctx;

var player = {
	speed: 3,
	// velocity is not really a point, but it's an xy tuple
	vel: new Point(),
	pos: new Point(50, 50),
}

var scoopy = {
	walkSpeed: 1,
	runSpeed: 5,
	vel: new Point(),
	pos: new Point(70, 70),
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
	moveScoopy();
	drawScreen();
}

function moveScoopy() {
	var dir = player.pos.minus(scoopy.pos).normalize();
	scoopy.pos.x += dir.x * scoopy.walkSpeed;
	scoopy.pos.y += dir.y * scoopy.walkSpeed;
}

function drawScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = '#BFFF00'; // lime green
	ctx.beginPath();
	// x, y, width, startAngle, endAngle, reverse
	ctx.arc(player.pos.x, player.pos.y, 20, 0, 2 * Math.PI, false);
	ctx.fill();
	
	ctx.fillStyle = 'rgb(255,0,0)';
	ctx.beginPath();
	ctx.arc(scoopy.pos.x, scoopy.pos.y, 20, 0, 2 * Math.PI, false);
	ctx.fill();
	
	var gradRef1 = player.pos;
	var gradRef2 = player.pos;
	var gradient = ctx.createRadialGradient(gradRef1.x, gradRef1.y, 120, gradRef2.x, gradRef2.y, 25);
	gradient.addColorStop(0,"rgba(0,0,0,1)");
	gradient.addColorStop(1,"rgba(0,100,150,0.2)");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}
