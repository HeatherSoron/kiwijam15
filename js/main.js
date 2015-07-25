var canvas;
var ctx;
var gameLoop;

// player-lengths
var sightDist = 6;

var cones = [];

var player;
var scoopy;
var currentLevel;
var objects;

var lost = false;

var frameDuration = 20;

function init() {
	canvas = document.getElementById('kiwijam');
	ctx = canvas.getContext('2d');
	
	resizeCanvas();
	registerListeners();
	
	startGame();
}

function fullImagePath(path) {
	return "resources/images/" + path;
}

function processLevel(level) {
	var processed = {};
	for (var key in level) {
		processed[key] = level[key];
	}
	
	for(rowIndex in processed.map) {
		var row = processed.map[rowIndex].split('');
		for (var colIndex in row) {
			var symbol = row[colIndex];
			if (symbol in processed.objects) {
				var obj = processed.objects[symbol];
				addObject(obj, colIndex, rowIndex, processed.tileSize);
				row[colIndex] = obj.floorTile;
			}
		}
		processed.map[rowIndex] = row;
	}
	return processed;
}

function addObject(objDef, x, y, tileSize) {
	objects.push({
		def: objDef,
		imageVariation: Math.floor(Math.random() * objDef.images.length),
		pos: new Point(x * tileSize, y * tileSize),
	});
}

function startGame() {
	objects = [];
	currentLevel = processLevel(foo.level);
	player = {
		speed: 3,
		// velocity is not really a point, but it's an xy tuple
		vel: new Point(),
		pos: new Point(121, 121),
		rad: 50,
		scoopCount: 3,
		frameCount: {
			'r': 8,
			'l': 8,
		},
		frameCols: {
			'r': 8,
			'l': 8,
		},
		frame: 0,
		frameDelay: 60,
		currentFrameDelay: 0,
		facing: 'r',
		images: {
			'r': 'Right',
			'l': 'Left',
		},
	};
	for (var facing in player.images) {
		var image = new Image();
		image.src = fullImagePath("characters/Alice_" + player.images[facing] + ".png");
		player.images[facing] = image;
	}
	
	scoopy = {
		walkSpeed: 0.5,
		runSpeed: 3.1,
		wanderAngle: 0,
		pos: new Point(500, 200),
		rad: 100,
		// delays in ms
		currentDelay: 0,
		eatDelay: 700,
		frameCount: {
			'l': 8,
		},
		frameCols: {
			'l': 4,
		},
		frame: 0,
		frameDelay: 60,
		currentFrameDelay: 0,
		facing: 'l',
		images: {
			'l': 'left',
		},
	};
	for (var facing in scoopy.images) {
		var image = new Image();
		image.src = fullImagePath("characters/scoopy_" + scoopy.images[facing] + "side_sprite.png");
		scoopy.images[facing] = image;
	}

	gameLoop = setInterval(runGame, frameDuration);
}

function runGame() {
	if (isCollidable((player.vel.times(player.speed).x + player.pos.x), player.pos.y)){
		player.vel.x = 0;
	}else if(isCollidable(player.pos.x, (player.vel.times(player.speed).y + player.pos.y))){
		player.vel.y = 0;
	}
	player.pos.offsetBy(player.vel.times(player.speed));
	interactWithObjects();
	animateAlice();
	
	moveScoopy();
	drawScreen();
}

function throwCone() {
	if (player.scoopCount <= 0) {
		return false;
	}
	player.scoopCount--;
	var offset = scoopy.pos.minus(player.pos);
	var dir = offset.normalize();

	var pos = dir.times(player.rad * 1).offsetBy(player.pos);
	cones.push(pos);
	return true;
}

function moveScoopy() {
	if (scoopy.currentDelay > 0) {
		scoopy.currentDelay -= frameDuration;
		return;
	}

	var offset = player.pos.minus(scoopy.pos);
	var playerDir = offset.normalize();
	var cone = undefined;

	for (var i = 0; i < cones.length; ++i) {
		var otherOffset = cones[i].minus(scoopy.pos);
		if (otherOffset.length() < offset.length()) {
			offset = otherOffset;
			cone = i;
		}
	}

	var dir = offset.normalize();
	
	var x = 0;
	var y = 0;
	var running = false;
	if (offset.length() < player.rad * (sightDist - 1)) {
		x = dir.x * scoopy.runSpeed;
		y = dir.y * scoopy.runSpeed;
		if (offset.length() < player.rad / 2) {
			if (cone === undefined) {
				lost = true;
				clearInterval(gameLoop);
			} else {
				cones.splice(cone, 1);
				scoopy.currentDelay = scoopy.eatDelay;
			}
		}
		running = true;
	} else {
		scoopy.wanderAngle += (Math.random() - 0.5) / 2;
		// we want to bias Mr. Scoopy's walk towards the player
		x = (Math.cos(scoopy.wanderAngle) + playerDir.x) / 2 * scoopy.walkSpeed;
		y = (Math.sin(scoopy.wanderAngle) + playerDir.y) / 2 * scoopy.walkSpeed;
	}
	
	scoopy.pos.x += x;
	scoopy.pos.y += y;
	
	animateScoopy(x, y, running);
}

function resizeCanvas(e) {
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
}

function drawScreen() {
	ctx.save()

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.translate(-player.pos.x + canvas.width/2, -player.pos.y + canvas.height/2);

	//Draw map
	tileEngine(ctx);
	
	for (var i = 0; i < objects.length; ++i) {
		var image = new Image();
		image.src = fullImagePath(objects[i].def.images[objects[i].imageVariation]);
		ctx.drawImage(image, objects[i].pos.x, objects[i].pos.y);
	}

	drawCharacter(player);

	ctx.fillStyle = 'beige';
	for (var i = 0; i < cones.length; ++i) {
		ctx.beginPath();
		var pos = cones[i];
		ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI, false);
		ctx.fill();
	}
	
	drawCharacter(scoopy);

	ctx.restore();
	var gradRef1 = new Point(canvas.width/2, canvas.height/2);
	var gradRef2 = new Point(canvas.width/2, canvas.height/2);
	var gradient = ctx.createRadialGradient(gradRef1.x, gradRef1.y, player.rad * 8, gradRef2.x, gradRef2.y, 25);
	gradient.addColorStop(0,"rgba(0,0,0,1)");
	gradient.addColorStop(1,"rgba(0,100,150,0.2)");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function drawCharacter(char) {
	var image = char.images[char.facing];
	var diam = char.rad * 2;
	var frameColCount = char.frameCols[char.facing];
	var frameCol = char.frame % frameColCount;
	var frameRow = Math.floor(char.frame / frameColCount);
	ctx.drawImage(image, diam * frameCol, diam * frameRow, diam, diam, char.pos.x - char.rad, char.pos.y - char.rad, diam, diam);
}
