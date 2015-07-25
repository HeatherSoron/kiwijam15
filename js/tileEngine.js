function tileEngine(ctx){
  var imgArray = [];

  for(imgIndex in foo.level.tiles){
    var image = new Image();
    image.src = foo.level.tiles[imgIndex].image
    imgArray[imgIndex] = image;
  }

  for(rowIndex in foo.level.map){
    var row = foo.level.map[rowIndex];
    for(columnIndex in row){
      var symbol = row[columnIndex];
      ctx.drawImage(imgArray[symbol], foo.level.tileSize*columnIndex, foo.level.tileSize*rowIndex);
    }
  }
}

function isCollidable(x, y){
  var tilex = Math.floor(x/foo.level.tileSize);
  var tiley = Math.floor(y/foo.level.tileSize);
  var tileSymbol = foo.level.map[tiley][tilex];
  if (tileSymbol in foo.level.tiles) {
    return foo.level.tiles[tileSymbol].collidable;
  }
  return false;
}
