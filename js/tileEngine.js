var tileData;
var map = [[]];
var imgArray = [];

function loadMapInit(){
  var imageURL = foo.level.mapFile;
  loadMapImage(imageURL);
}


function processMap(){
  var imagex = tileData.width;
  var imagey = tileData.height;
  for(rowIndex = 0; rowIndex < imagey; rowIndex++){
    var row = [];
    for(columnIndex = 0; columnIndex < imagex; columnIndex++){
      var rgb = getTile(columnIndex,rowIndex);
      var symbol = rgb[0] +","+ rgb[1] +","+ rgb[2]
      row.push(symbol);
      if(symbol in foo.level.objects){
        var obj = foo.level.objects[symbol];
        addObject(obj, columnIndex, rowIndex, foo.level.tileSize);
        row[columnIndex] = obj.floorTile;
      }
    }
    map.push(row);
  }
  for(imgIndex in foo.level.tiles){
    var image = new Image();
    image.src = fullImagePath(foo.level.tiles[imgIndex].image);
    foo.level.tiles[imgIndex] = image;
  }
}

function tileEngine(ctx){
  for(rowIndex in map){
    var row = map[rowIndex];
    for(columnIndex in row){
      var symbol = row[columnIndex];
      if(typeof foo.level.tiles[symbol] != 'undefined'){
        ctx.drawImage(foo.level.tiles[symbol], foo.level.tileSize*columnIndex, foo.level.tileSize*rowIndex);
      }
    }
  }
}

function isCollidable(x, y){
  var tileX = Math.floor(x/foo.level.tileSize);
  var tileY = Math.floor(y/foo.level.tileSize);
  console.log(map[tileX][tileY]);
  console.log(tileX + "," + tileY);
  var tileSymbol = map[tileX][tileY];
  var tile = foo.level.tiles[tileSymbol];
  if (!tile) {
    return true;
  }
  return tile.collidable;
}


function loadMapImage(file) {
  var tempCanvas = document.createElement('canvas');
  var context = tempCanvas.getContext('2d');
  var img = new Image();
  img.src = file;
  img.onload = function() {
    context.drawImage(img, 0, 0 );
    tileData = context.getImageData(0, 0, img.width, img.height);
    processMap();
  }
}


function getTile(x, y) {
  var width = tileData.width;
  var startIndex = 4 * (x + (y * width));
  // console.log(startIndex);
  return [tileData.data[startIndex], tileData.data[startIndex + 1], tileData.data[startIndex + 2]];
}
