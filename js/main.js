var canvas;
var ctx;

function init() {
	canvas = document.getElementById('kiwijam');
	ctx = canvas.getContext('2d');
	
	drawScreen();
}

function drawScreen() {
	ctx.fillStyle = '#BFFF00'; // lime green
	
	ctx.beginPath();
	// x, y, width, startAngle, endAngle, reverse
	ctx.arc(50, 50, 20, 0, 2 * Math.PI, false);
	
	ctx.fill();
	console.log(ctx);
}
