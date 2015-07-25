var tileData;

function tileEngine(ctx){
  var imgArray = [];

  for(imgIndex in currentLevel.tiles){
    var image = new Image();
    image.src = fullImagePath(currentLevel.tiles[imgIndex].image);
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


function loadMap(file) {
  var tempCanvas = document.createElement('canvas');
  var context = tempCanvas.getContext('2d');
  var img = new Image();
  img.src = file;
  img.onload = function() {
    context.drawImage(img, 0, 0 );
    tileData = context.getImageData(0, 0, img.width, img.height);
  }
}


function getTile(x, y) {
  var width = tileData.width;
  var startIndex = 4 * (x + (y * width));
  console.log(startIndex);
  return [tileData.data[startIndex], tileData.data[startIndex + 1], tileData.data[startIndex + 2]];
}
