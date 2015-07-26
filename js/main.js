var canvas;
var ctx;
var gameLoop;

// player-lengths
var sightDist = 8;

// lime green
var endTextColor = 'rgb(0,255,0)';
var lossText = "a sacrifice for mr. scoopy's eyes-cream";
var scoreTextTemplate = "your value: %d";

var score;
var scoopyScorePenalty = 30;
var scorePerScoopFrame = 1;

var cones;

var player;
var scoopy;
var currentLevel;
var objects;

var gradOuterRad;
var gradInnerRad;

var chaseMusic;
var ambientMusic;

var lost = false;
var creditsPlaying = false;
var creditY = 0;

var frameDuration = 20;

var quietVolume = 1.0;
var baseLoudVolume = 0.4;
var volumeScaleRate = 0.6;

function init() {
	canvas = document.getElementById('kiwijam');
	ctx = canvas.getContext('2d');

	resizeCanvas();
	registerListeners();

	ambientMusic = new Audio('resources/music/GameJamGREEN_1.mp3');
	ambientMusic.loop = true;

	chaseMusic = new Audio('resources/music/GameJamCHASE_Celli&Glock.mp3');
	chaseMusic.loop = true;

	creditY = canvas.height + 50;
	startGame();
	gameLoop = setInterval(runGame, frameDuration);
}

function fullImagePath(path) {
	return "resources/images/" + path;
}

function processLevel(level) {
	loadMap(level.mapFile);
	var processed = {};
	for (var key in level) {
		processed[key] = level[key];
	}

	processed.map = [];
	for(rowIndex in level.map) {
		var row = level.map[rowIndex].split('');
		for (var colIndex in row) {
			var symbol = row[colIndex];
			if (symbol in level.objects) {
				var obj = level.objects[symbol];
				addObject(obj, colIndex, rowIndex, level.tileSize);
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
	score = 0;
	objects = [];
	cones = [];
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
			'd': 7,
			'u': 7,
		},
		frameCols: {
			'r': 8,
			'l': 8,
			'd': 7,
			'u': 7,
		},
		frame: 0,
		frameDelay: 60,
		currentFrameDelay: 0,
		facing: 'd',
		images: {
			'r': 'Right',
			'l': 'Left',
			'd': 'Front',
			'u': 'Back',
		},
	};
	for (var facing in player.images) {
		var image = new Image();
		image.src = fullImagePath("characters/Alice_" + player.images[facing] + ".png");
		player.images[facing] = image;
	}

	scoopy = {
		walkSpeed: 2.5,
		runSpeed: 3.1,
		wanderAngle: 0,
		pos: new Point(500, 200),
		rad: 100,
		// delays in ms
		currentDelay: 0,
		eatDelay: 700,
		frameCount: {
			'l': 8,
			'r': 8,
			'd': 8,
			'u': 8,
		},
		frameCols: {
			'l': 4,
			'r': 4,
			'd': 4,
			'u': 4,
		},
		frame: 0,
		frameDelay: 60,
		currentFrameDelay: 0,
		facing: 'l',
		images: {
			'l': 'leftside',
			'r': 'right',
			'd': 'front',
			'u': 'back',
		},
	};
	for (var facing in scoopy.images) {
		var image = new Image();
		image.src = fullImagePath("characters/scoopy_" + scoopy.images[facing] + "_sprite.png");
		scoopy.images[facing] = image;
	}

	gradOuterRad = player.rad * sightDist;
	gradInnerRad = 25;

	ambientMusic.volume = quietVolume;
	ambientMusic.play();
}

function runGame() {
	if (!lost) {
		if (isCollidable((player.vel.times(player.speed).x + player.pos.x), player.pos.y)){
			player.vel.x = 0;
		}
		if(isCollidable(player.pos.x, (player.vel.times(player.speed).y + player.pos.y))){
			player.vel.y = 0;
		}
		player.pos.offsetBy(player.vel.times(player.speed));
		interactWithObjects();
		animateAlice();

		moveScoopy();
	} else {
		gradOuterRad = Math.max(30, gradOuterRad - 3);
		gradInnerRad = Math.max(0, gradInnerRad - 1);
	}
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

function scoopyDist() {
	return player.pos.minus(scoopy.pos);
}

function moveScoopy() {
	if (scoopy.currentDelay > 0) {
		scoopy.currentDelay -= frameDuration;
		return;
	}

	var offset = scoopyDist();
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
	var chaseDistance = player.rad * (sightDist - 3);

	if (offset.length() < chaseDistance) {
		var scaleFactor = (1 - (offset.length() / chaseDistance));

		if (!ambientMusic.paused) {
			ambientMusic.pause();
			chaseMusic.play();
		}
		x = dir.x * scoopy.runSpeed;
		y = dir.y * scoopy.runSpeed;
		if (offset.length() < player.rad / 2) {
			if (cone === undefined) {
				lose();
			} else {
				cones.splice(cone, 1);
				scoopy.currentDelay = scoopy.eatDelay;
			}
		}
		score -= scoopyScorePenalty;
		running = true;
	} else {
		if (!chaseMusic.paused) {
			chaseMusic.pause();
			ambientMusic.play();
		}
		scoopy.wanderAngle += (Math.random() - 0.5) / 2;
		// we want to bias Mr. Scoopy's walk towards the player
		x = (Math.cos(scoopy.wanderAngle) + playerDir.x) / 2 * scoopy.walkSpeed;
		y = (Math.sin(scoopy.wanderAngle) + playerDir.y) / 2 * scoopy.walkSpeed;
		score += player.scoopCount * scorePerScoopFrame;
	}

	if (isCollidable(scoopy.pos.x + x, scoopy.pos.y)){
		x = 0;
		if(y <10){
			scoopy.wanderAngle += (Math.random() - 0.5) / 2;
			y = (Math.sin(scoopy.wanderAngle) + playerDir.y) / 2 * scoopy.walkSpeed;
		}
	}
	if(isCollidable(scoopy.pos.x, scoopy.pos.y + y)){
		y = 0;
		if(x <10){
			scoopy.wanderAngle += (Math.random() - 0.5) / 2;
			x = (Math.cos(scoopy.wanderAngle) + playerDir.x) / 2 * scoopy.walkSpeed;
		}
	}
	scoopy.pos.x += x;
	scoopy.pos.y += y;

	animateScoopy(x, y, running);
}

function lose() {
	lost = true;
	drawScreen();
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
	tileEngine(ctx, player.pos.x, player.pos.y);

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
	var gradient = ctx.createRadialGradient(gradRef1.x, gradRef1.y, gradOuterRad, gradRef2.x, gradRef2.y, gradInnerRad);
	gradient.addColorStop(0,"rgba(0,0,0,1)");
	gradient.addColorStop(1,"rgba(0,100,150,0.2)");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if (lost) {
		ctx.textAlign="left";
		ctx.fillStyle = endTextColor;
		ctx.font = "bold 30pt Comic Sans MS";

		var textWidth = ctx.measureText(lossText).width;
		ctx.fillText(lossText, (canvas.width - textWidth) / 2, 70);

		var scoreText = scoreTextTemplate.replace(/%d/, score);
		textWidth = ctx.measureText(scoreText).width;
		ctx.fillText(scoreText, (canvas.width - textWidth) / 2, canvas.height - 60);
	}

	if(creditsPlaying){
		ctx.textAlign="center";
		ctx.fillStyle = endTextColor;

		// var credit = "";
		for(index in credits.creditText){
			var credit = credits.creditText[index];
			textWidth = ctx.measureText(scoreText).width;
			if(credit.charAt(0) !='#'){
				ctx.font = "bold 30pt Lucida Sans MS";
			} else{
				ctx.font = "bold 20pt Lucida Sans MS";
				credit = credit.substring(1);
			}
			ctx.fillText(credit, canvas.width / 2,index*canvas.width/25 +   creditY);

		}
		creditY--;
	}
}

function credits(ctx){

}

function drawCharacter(char) {
	var image = char.images[char.facing];
	var diam = char.rad * 2;
	var frameColCount = char.frameCols[char.facing];
	var frameCol = char.frame % frameColCount;
	var frameRow = Math.floor(char.frame / frameColCount);
	ctx.drawImage(image, diam * frameCol, diam * frameRow, diam, diam, char.pos.x - char.rad, char.pos.y - char.rad, diam, diam);
}
