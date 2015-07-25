function animateAlice() {
	var frameDelta = 0;
	if (player.vel.x > 0) {
		player.facing = 'r';
		frameDelta = 1;
	} else if (player.vel.x < 0) {
		player.facing = 'l';
		frameDelta = -1;
	}
	
	animateFrame(player, frameDelta, 1);
}

function animateScoopy(x, y, running) {
	var frameDelta = 0;
	
	if (x < 0) {
		scoopy.facing = 'l';
		frameDelta = 1;
	}
	
	animateFrame(scoopy, frameDelta, running ? 1 : 0.3);
}

function animateFrame(char, frameDelta, timeMultiplier) {		
	if (frameDelta) {
		if (char.currentFrameDelay <= 0) {
			// modulus doesn't QUITE do what I want for negatives, so let's do it manually
			var frameCount = char.frameCount[char.facing];
			char.frame += frameDelta;
			while (char.frame >= frameCount) {
				char.frame -= frameCount;
			}
			while (char.frame < 0) {
				char.frame += frameCount;
			}
			
			char.currentFrameDelay = char.frameDelay;
		} else {
			char.currentFrameDelay -= frameDuration * timeMultiplier;
		}
	}
}
