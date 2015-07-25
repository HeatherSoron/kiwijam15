function tileEngine(ctx){
  var imgArray = [];

  for(imgIndex in currentLevel.tiles){
    var image = new Image();
    image.src = currentLevel.tiles[imgIndex].image
    imgArray[imgIndex] = image;
  }

  for(rowIndex in currentLevel.map){
    var row = currentLevel.map[rowIndex];
    for(columnIndex in row){
      var symbol = row[columnIndex];
      ctx.drawImage(imgArray[symbol], currentLevel.tileSize*columnIndex, currentLevel.tileSize*rowIndex);
    }
  }
}

function isCollidable(x, y){
  var tilex = Math.floor(x/currentLevel.tileSize);
  var tiley = Math.floor(y/currentLevel.tileSize);
  var tileSymbol = currentLevel.map[tiley][tilex];
  if (tileSymbol in currentLevel.tiles) {
    return currentLevel.tiles[tileSymbol].collidable;
  }
  return false;
}
