function tileEngine(ctx){
  var imgArray = [];

  for(imgIndex in foo.level.tiles){
    var image = new Image();
    image.src = foo.level.tiles[imgIndex].image
    imgArray.push(image);
  }

  for(rowIndex in foo.level.map){
    var row = foo.level.map[rowIndex];
    for(columnIndex in row){
      for(tileResource in foo.level.tiles){
        if(foo.level.tiles[tileResource].symbol == row[columnIndex]){
          ctx.drawImage(imgArray[tileResource], foo.level.tileSize*columnIndex, foo.level.tileSize*rowIndex);
        }
      }
    }
  }
}

function isCollidable(x, y){
  var tilex = Math.floor(x/foo.level.tileSize);
  var tiley = Math.floor(y/foo.level.tileSize);
  var tileSymbol = foo.level.map[tiley][tilex];
  for(tileResource in foo.level.tiles){
    if(foo.level.tiles[tileResource].symbol == tileSymbol){
      return foo.level.tiles[tileResource].collidable;
    }
  }
  return false;
}
