var canvas;
var ctx;

// player-lengths
var sightDist = 6;

var player = {
	speed: 4,
	// velocity is not really a point, but it's an xy tuple
	vel: new Point(),
	pos: new Point(50, 50),
	rad: 50
}

var scoopy = {
	walkSpeed: 0.5,
	runSpeed: 2,
	wanderAngle: 0,
	pos: new Point(70, 70),
	rad: 100,
}

var frameDuration = 20;

function init() {
	canvas = document.getElementById('kiwijam');
	ctx = canvas.getContext('2d');
	
	resizeCanvas();

	registerListeners();

	var gameLoop = setInterval(runGame, frameDuration);
}

function runGame() {
	player.pos.offsetBy(player.vel.times(player.speed));
	moveScoopy();
	drawScreen();
}

function moveScoopy() {
	var offset = player.pos.minus(scoopy.pos);
	var dir = offset.normalize();

	if (offset.length() < player.rad * (sightDist - 1)) {
		scoopy.pos.x += dir.x * scoopy.runSpeed;
		scoopy.pos.y += dir.y * scoopy.runSpeed;
	} else {
		scoopy.wanderAngle += (Math.random() - 0.5) / 2;
		var x = Math.cos(scoopy.wanderAngle) * scoopy.walkSpeed;
		var y = Math.sin(scoopy.wanderAngle) * scoopy.walkSpeed;
		scoopy.pos.x += x;
		scoopy.pos.y += y;
	}
}

function resizeCanvas(e) {
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
}

function drawScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Draw map
	tileEngine(ctx);

	ctx.fillStyle = '#BFFF00'; // lime green
	ctx.beginPath();
	// x, y, width, startAngle, endAngle, reverse
	ctx.arc(player.pos.x, player.pos.y, player.rad, 0, 2 * Math.PI, false);
	ctx.fill();

	ctx.fillStyle = 'rgb(255,0,0)';
	ctx.beginPath();
	ctx.arc(scoopy.pos.x, scoopy.pos.y, scoopy.rad, 0, 2 * Math.PI, false);
	ctx.fill();

	var gradRef1 = player.pos;
	var gradRef2 = player.pos;
	var gradient = ctx.createRadialGradient(gradRef1.x, gradRef1.y, player.rad * 6, gradRef2.x, gradRef2.y, 25);
	gradient.addColorStop(0,"rgba(0,0,0,1)");
	gradient.addColorStop(1,"rgba(0,100,150,0.2)");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}
