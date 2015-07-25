function interactWithObjects() {
	var remove = [];
	for (var i = 0; i < objects.length; ++i) {
		var obj = objects[i];
		var offset = obj.pos.minus(player.pos);
		if (offset.length() < player.rad) {
			if (obj.def.ontouch) {
				var doRemove = objectOntouch[obj.def.ontouch]();
				if (doRemove) {
					remove.push(i);
				}
			}
		}
	}
	
	for (var i = remove.length - 1; i >= 0; --i) {
		objects.splice(remove[i], 1);
	}
}

var objectOntouch = {
	gainIceCream: function() {
		player.scoopCount += 1;
		console.log(player.scoopCount);
		return true;
	},
};
