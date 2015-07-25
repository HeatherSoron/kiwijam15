function animateAlice() {
	var frameDelta = 0;
	if (player.vel.x > 0) {
		player.facing = 'r';
		frameDelta = 1;
	} else if (player.vel.x < 0) {
		player.facing = 'l';
		frameDelta = -1;
	}
	
	if (frameDelta) {
		if (player.currentFrameDelay <= 0) {
			// modulus doesn't QUITE do what I want for negatives, so let's do it manually
			var frameCount = player.frameCount[player.facing];
			player.frame += frameDelta;
			while (player.frame >= frameCount) {
				player.frame -= frameCount;
			}
			while (player.frame < 0) {
				player.frame += frameCount;
			}
			
			player.currentFrameDelay = player.frameDelay;
		} else {
			player.currentFrameDelay -= frameDuration;
		}
	}
}
